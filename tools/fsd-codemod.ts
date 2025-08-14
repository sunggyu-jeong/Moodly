/**
 * FSD 코데모드 – 고도화 통합판
 * -----------------------------------------------------------------------------
 * 기능
 *  1) 임포트 경로 정규화 (--fix)
 *     - 깊은 내부 경로 → @/<layer>/<slice>
 *    - 같은 슬라이스 내부는 기본 유지(옵션으로 변경 가능)
 *  2) 배럴(index.ts) 재생성 (--barrels[=public|all])
 *     - public: FSD 퍼블릭 폴더만(ui, model, lib, hooks, api, types)
 *     - all:   모든 디렉터리(재귀) – 파일 default export가 있을 때만 named re-export
 *              (export * + export { default as File } from './File')
 *              (디렉터리는 export * 만)
 *
 *   사용 예
 *     체크만:   pnpm tsx tools/fsd-codemod.ts --check
 *     퍼블릭 배럴 + 교정: pnpm tsx tools/fsd-codemod.ts --barrels --fix
 *     전 디렉터리 배럴:   pnpm tsx tools/fsd-codemod.ts --barrels=all
 *     내부도 배럴 치환:   pnpm tsx tools/fsd-codemod.ts --fix --internal=barrel
 *     이동 계획 산출:     pnpm tsx tools/fsd-codemod.ts --plan-moves
 *
 * @author <coder3306@gmail.com>
 * @utility
 */
import fg from 'fast-glob';
import { promises as fs } from 'fs';
import * as path from 'path';

type Layer = 'app' | 'pages' | 'widgets' | 'features' | 'entities' | 'shared';
type BarrelsMode = 'none' | 'public' | 'all';
type InternalMode = 'keep' | 'barrel' | 'relative';

type Mode = {
  check: boolean;
  fix: boolean;
  barrels: BarrelsMode;
  noSpecifiers: boolean;
  internal: InternalMode;
  planMoves: boolean;
};

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const aliasRoot = '@'; // 정규화는 기본 '@/<layer>/<slice>'
const layers: Layer[] = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

const exts = ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];
const indexCandidates = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];

const arg = (name: string) => process.argv.find(a => a === name || a.startsWith(name + '='));
const argValue = (name: string) => {
  const hit = arg(name);
  if (!hit) return undefined;
  const eq = hit.indexOf('=');
  return eq > -1 ? hit.slice(eq + 1) : 'true';
};

const mode: Mode = {
  check: !!arg('--check') || (!arg('--fix') && !arg('--barrels') && !arg('--plan-moves')),
  fix: !!arg('--fix'),
  barrels: ((): BarrelsMode => {
    const v = argValue('--barrels');
    if (!v) return 'none';
    if (v === 'true' || v === 'public') return 'public';
    if (v === 'all') return 'all';
    return 'public';
  })(),
  noSpecifiers: !!arg('--no-specifiers'),
  internal: ((): InternalMode => {
    const v = argValue('--internal');
    if (v === 'barrel' || v === 'relative') return v;
    return 'keep';
  })(),
  planMoves: !!arg('--plan-moves'),
};

type ImportEdit = {
  fromFile: string;
  original: string;
  next?: string;
  reason: string;
  violation: boolean;
};

const isInSrc = (p: string): boolean => path.resolve(p).startsWith(srcRoot);

const detectLayer = (p: string): Layer | null => {
  const rel = path.relative(srcRoot, p).split(path.sep);
  const first = rel[0];
  if (!first) return null;
  return layers.includes(first as Layer) ? (first as Layer) : null;
};

const layerOrder = (l: Layer | null): number => (l ? layers.indexOf(l) : Number.MAX_SAFE_INTEGER);

const resolveImportTargetAbs = async (
  fromFile: string,
  importPath: string
): Promise<string | null> => {
  if (importPath.startsWith(aliasRoot + '/')) {
    const rel = importPath.slice((aliasRoot + '/').length);
    const abs = path.join(srcRoot, rel);
    return resolveWithExt(abs);
  }
  if (importPath.startsWith('.')) {
    const abs = path.resolve(path.dirname(fromFile), importPath);
    return resolveWithExt(abs);
  }
  return null;
};

const resolveWithExt = async (absNoExt: string): Promise<string | null> => {
  for (const e of exts) {
    const cand = absNoExt.endsWith(e) ? absNoExt : absNoExt + e;
    if (await exists(cand)) return cand;
  }
  if ((await exists(absNoExt)) && (await isDir(absNoExt))) {
    for (const f of indexCandidates) {
      const cand = path.join(absNoExt, f);
      if (await exists(cand)) return cand;
    }
  }
  return null;
};

const exists = async (p: string): Promise<boolean> => {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
};

const isDir = async (p: string): Promise<boolean> => {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
};

// 슬라이스 루트: src/<layer>/<slice>
const sliceRootDir = (
  absTarget: string
): { layer: Layer; sliceDirAbs: string; sliceName: string } | null => {
  const rel = path.relative(srcRoot, absTarget).split(path.sep);
  const layer = rel[0] as Layer | undefined;
  const slice = rel[1];
  if (!layer || !slice || !layers.includes(layer)) return null;
  const sliceAbs = path.join(srcRoot, layer, slice);
  return { layer, sliceDirAbs: sliceAbs, sliceName: slice };
};

const toPublicApiImport = (targetLayer: Layer, sliceName: string): string =>
  `${aliasRoot}/${targetLayer}/${sliceName}`;

const collectImportStatements = (
  code: string
): Array<{ full: string; spec: string; start: number; end: number }> => {
  const results: Array<{ full: string; spec: string; start: number; end: number }> = [];
  const importFromRe = /import[\s\S]*?from\s+['"]([^'"]+)['"];?/g;
  const exportFromRe = /export\s+[\s\S]*?from\s+['"]([^'"]+)['"];?/g;
  let m: RegExpExecArray | null;
  while ((m = importFromRe.exec(code)))
    results.push({ full: m[0], spec: m[1], start: m.index, end: m.index + m[0].length });
  while ((m = exportFromRe.exec(code)))
    results.push({ full: m[0], spec: m[1], start: m.index, end: m.index + m[0].length });
  return results;
};

/* ===========================
 * 배럴 생성 로직
 * =========================== */

const PUBLIC_SUBDIRS = ['ui', 'model', 'lib', 'hooks', 'api', 'types'] as const;
const SHARED_PUBLIC_DIRS = ['ui', 'hooks', 'lib', 'api', 'constants', 'styles'] as const;

const EXCLUDE_DIR_NAMES = new Set([
  'node_modules',
  'internal',
  '__mocks__',
  '__tests__',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  'android',
  'ios',
  'assets',
  'images',
]);

const EXCLUDE_FILE_PATTERNS = [
  /\.d\.ts$/,
  /\.test\.(t|j)sx?$/,
  /\.spec\.(t|j)sx?$/,
  /\.stories\.(t|j)sx?$/,
  /^index\.(t|j)sx?$/,
  /\.(png|jpg|jpeg|gif|webp|svg)$/,
];

const isExcludedFile = (name: string): boolean => EXCLUDE_FILE_PATTERNS.some(re => re.test(name));

const toExportName = (fileBase: string): string => fileBase.replace(/\W+/g, '_');

const hasDefaultExport = async (absFile: string): Promise<boolean> => {
  try {
    const txt = await fs.readFile(absFile, 'utf8');
    if (/\bexport\s+default\b/.test(txt)) return true;
    // re-export default: export { default as X } from './foo'
    if (/export\s*{\s*default(?:\s+as\s+\w+)?\s*}\s*from\s*['"]/.test(txt)) return true;
    return false;
  } catch {
    return false;
  }
};

type BarrelItem = { relNoExt: string; base: string; kind: 'file' | 'dir'; hasDefault?: boolean };

const writeBarrel = async (dir: string, items: BarrelItem[]): Promise<void> => {
  const lines: string[] = [];
  for (const it of items) {
    lines.push(`export * from './${it.relNoExt}';`);
    if (it.kind === 'file' && it.hasDefault) {
      const exportName = toExportName(path.basename(it.base));
      lines.push(`export { default as ${exportName} } from './${it.relNoExt}';`);
    }
  }
  const indexPath = path.join(dir, 'index.ts');
  await fs.writeFile(indexPath, lines.join('\n') + '\n', 'utf8');
};

const scanDirectoryForBarrelAll = async (dir: string): Promise<void> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const items: BarrelItem[] = [];

  for (const e of entries) {
    if (e.isDirectory()) {
      if (EXCLUDE_DIR_NAMES.has(e.name) || e.name.startsWith('_')) continue;
      const sub = path.join(dir, e.name);
      await scanDirectoryForBarrelAll(sub);
      // 하위 폴더 index가 있으면 디렉터리로 재노출
      const subIndex = path.join(sub, 'index.ts');
      if (await exists(subIndex)) items.push({ relNoExt: e.name, base: e.name, kind: 'dir' });
    } else {
      const name = e.name;
      if (isExcludedFile(name)) continue;
      const noExt = name.replace(/\.(t|j)sx?$/, '');
      const abs = path.join(dir, name);
      const def = await hasDefaultExport(abs);
      items.push({ relNoExt: noExt, base: noExt, kind: 'file', hasDefault: def });
    }
  }

  if (items.length > 0) {
    await writeBarrel(dir, items);
  }
};

const scanDirectoryForBarrelPublic = async (dir: string): Promise<void> => {
  // 재귀: 퍼블릭 폴더 내부는 all 처럼 처리
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const e of entries) {
    if (e.isDirectory()) {
      if (EXCLUDE_DIR_NAMES.has(e.name) || e.name.startsWith('_')) continue;
      const sub = path.join(dir, e.name);
      await scanDirectoryForBarrelAll(sub); // 퍼블릭 폴더 내부는 전체 배럴
    }
  }

  // 현재 dir의 직접 파일/폴더를 한 단계로 묶음
  const items: BarrelItem[] = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      const subIndex = path.join(dir, e.name, 'index.ts');
      if (await exists(subIndex)) items.push({ relNoExt: e.name, base: e.name, kind: 'dir' });
    } else {
      const name = e.name;
      if (isExcludedFile(name)) continue;
      const noExt = name.replace(/\.(t|j)sx?$/, '');
      const abs = path.join(dir, name);
      const def = await hasDefaultExport(abs);
      items.push({ relNoExt: noExt, base: noExt, kind: 'file', hasDefault: def });
    }
  }

  if (items.length > 0) await writeBarrel(dir, items);
};

const generateForSlicePublic = async (sliceDir: string): Promise<void> => {
  const pubs = PUBLIC_SUBDIRS.map(d => path.join(sliceDir, d));
  for (const d of pubs) {
    if (await isDir(d)) await scanDirectoryForBarrelPublic(d);
  }
  const lines: string[] = [];
  for (const d of pubs) {
    if (await exists(path.join(d, 'index.ts')))
      lines.push(`export * from './${path.basename(d)}';`);
  }
  if (lines.length > 0)
    await fs.writeFile(path.join(sliceDir, 'index.ts'), lines.join('\n') + '\n', 'utf8');
};

const generateForSliceAll = async (sliceDir: string): Promise<void> => {
  await scanDirectoryForBarrelAll(sliceDir);
};

const generateForSharedPublic = async (): Promise<void> => {
  for (const name of SHARED_PUBLIC_DIRS) {
    const d = path.join(srcRoot, 'shared', name);
    if (await isDir(d)) await scanDirectoryForBarrelPublic(d);
  }
  const lines: string[] = [];
  for (const name of SHARED_PUBLIC_DIRS) {
    if (await exists(path.join(srcRoot, 'shared', name, 'index.ts'))) {
      lines.push(`export * from './${name}';`);
    }
  }
  if (lines.length > 0)
    await fs.writeFile(path.join(srcRoot, 'shared', 'index.ts'), lines.join('\n') + '\n', 'utf8');
};

const generateForSharedAll = async (): Promise<void> => {
  const root = path.join(srcRoot, 'shared');
  if (await isDir(root)) await scanDirectoryForBarrelAll(root);
};

const generateBarrels = async (mode: BarrelsMode): Promise<void> => {
  if (mode === 'none') return;

  for (const layer of layers) {
    const layerDir = path.join(srcRoot, layer);
    if (!(await isDir(layerDir))) continue;

    const slices = await fg(['*'], { cwd: layerDir, onlyDirectories: true, absolute: true });

    for (const sliceDir of slices) {
      if (mode === 'public') await generateForSlicePublic(sliceDir);
      else await generateForSliceAll(sliceDir);
    }
  }

  if (mode === 'public') await generateForSharedPublic();
  else await generateForSharedAll();
};

/* ===========================
 * 경로 정규화 (+ 내부 모드)
 * =========================== */

const processFile = async (absFile: string): Promise<ImportEdit[]> => {
  const text = await fs.readFile(absFile, 'utf8');
  const imports = collectImportStatements(text);
  if (imports.length === 0) return [];

  const fromLayer = detectLayer(absFile);
  const fromSlice = sliceRootDir(absFile);
  const edits: ImportEdit[] = [];
  let newText = text;
  let replaced = false;

  for (const im of imports) {
    const targetAbs = await resolveImportTargetAbs(absFile, im.spec);
    if (!targetAbs) continue;
    if (!isInSrc(targetAbs)) continue;

    const toLayer = detectLayer(targetAbs);
    const toSlice = sliceRootDir(targetAbs);
    const fromOrd = layerOrder(fromLayer);
    const toOrd = layerOrder(toLayer);
    const sameSlice = fromSlice && toSlice && fromSlice.sliceDirAbs === toSlice.sliceDirAbs;

    const isReverse = fromOrd > toOrd; // 하위→상위 (위반)
    const publicPath: string | null = toSlice
      ? toPublicApiImport(toSlice.layer, toSlice.sliceName)
      : null;

    const alreadyPublic =
      publicPath !== null && (im.spec === publicPath || im.spec.startsWith(publicPath + '/index'));

    // 내부 모드 처리
    if (sameSlice) {
      // 기본: keep (치환 안 함)
      if (mode.internal === 'barrel' && publicPath && !alreadyPublic) {
        // 내부도 배럴로 바꾸기
        const re = new RegExp(`(['"])${escapeRegExp(im.spec)}\\1`, 'g');
        newText = newText.replace(re, `'${publicPath}'`);
        replaced = true;
        edits.push({
          fromFile: absFile,
          original: im.spec,
          next: publicPath,
          reason: 'Same-slice import → barrel (by option)',
          violation: false,
        });
      }
      // relative 모드는 (정확한 타깃 파일경로 없이는) 안전치 않아 미구현
      continue;
    }

    // 레이어 위반 기록
    if (isReverse) {
      // 경로는 축약 제안만
      edits.push({
        fromFile: absFile,
        original: im.spec,
        next: publicPath && !alreadyPublic ? publicPath : undefined,
        reason: `Reverse import: ${fromLayer ?? 'unknown'} → ${toLayer ?? 'unknown'}`,
        violation: true,
      });
      if (mode.fix && publicPath && !alreadyPublic) {
        const re = new RegExp(`(['"])${escapeRegExp(im.spec)}\\1`, 'g');
        newText = newText.replace(re, `'${publicPath}'`);
        replaced = true;
      }
      continue;
    }

    // 정상 방향이지만 깊은 경로면 퍼블릭으로 축약
    if (!alreadyPublic && publicPath) {
      if (mode.fix) {
        const re = new RegExp(`(['"])${escapeRegExp(im.spec)}\\1`, 'g');
        newText = newText.replace(re, `'${publicPath}'`);
        replaced = true;
      }
      edits.push({
        fromFile: absFile,
        original: im.spec,
        next: publicPath,
        reason: 'Deep internal import → public API',
        violation: false,
      });
    }
  }

  if (mode.fix && replaced) await fs.writeFile(absFile, newText, 'utf8');
  return edits;
};

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ===========================
 * 배럴 경로 default→named 교정
 * =========================== */

const BARREL_PATH_RE =
  /^@\/(shared\/[a-z0-9_-]+|features\/[^/]+|widgets\/[^/]+|entities\/[^/]+|pages\/[^/]+|app\/[^/]+)/i;

const DEFAULT_WITH_NAMED_RE =
  /import\s+([A-Za-z0-9_$]+)\s*,\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]\s*;?/g;

const DEFAULT_ONLY_RE = /import\s+([A-Za-z0-9_$]+)\s+from\s*['"]([^'"]+)['"]\s*;?/g;

const fixImportSpecifiersInFile = async (abs: string): Promise<boolean> => {
  let code = await fs.readFile(abs, 'utf8');
  let changed = false;

  code = code.replace(DEFAULT_WITH_NAMED_RE, (m, def: string, named: string, source: string) => {
    if (!BARREL_PATH_RE.test(source)) return m;
    const merged = [
      def.trim(),
      ...named
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    ]
      .join(', ')
      .replace(/\s+,/g, ',');
    changed = true;
    return `import { ${merged} } from '${source}';`;
  });

  code = code.replace(DEFAULT_ONLY_RE, (m, def: string, source: string) => {
    if (!BARREL_PATH_RE.test(source)) return m;
    changed = true;
    return `import { ${def.trim()} } from '${source}';`;
  });

  if (changed) await fs.writeFile(abs, code, 'utf8');
  return changed;
};

/* ===========================
 * 이동 계획(드라이런)
 * =========================== */

type MoveSuggestion = {
  file: string;
  fromLayer: Layer | null;
  reasons: Array<{ toLayer: Layer | null; toSlice?: string; importPath: string }>;
  suggestedLayer?: Layer;
  suggestedSlice?: string;
  targetPath?: string;
  ambiguous?: boolean;
};

const ALLOW_MAP: Record<Layer, Layer[]> = {
  shared: [],
  entities: ['shared'],
  features: ['entities', 'shared'],
  widgets: ['features', 'entities', 'shared'],
  pages: ['widgets', 'features', 'entities', 'shared'],
  app: ['pages', 'widgets', 'features', 'entities', 'shared'],
};

const minimalLayerFor = (targets: Set<Layer>): Layer | null => {
  for (const layer of layers) {
    const allowed = new Set(ALLOW_MAP[layer] ?? []);
    let ok = true;
    for (const t of targets) {
      if (!allowed.has(t)) {
        ok = false;
        break;
      }
    }
    if (ok) return layer;
  }
  return null;
};

const planMoves = async (files: string[], allEdits: ImportEdit[]) => {
  const byFile: Record<string, MoveSuggestion> = {};

  // 위반만 추림
  const violations = allEdits.filter(e => e.violation);

  for (const v of violations) {
    const toAbs = await resolveImportTargetAbs(v.fromFile, v.original);
    if (!toAbs) continue;
    const toLayer = detectLayer(toAbs);
    const toSlice = sliceRootDir(toAbs)?.sliceName;
    const entry = (byFile[v.fromFile] ??= {
      file: v.fromFile,
      fromLayer: detectLayer(v.fromFile),
      reasons: [],
    });
    entry.reasons.push({ toLayer, toSlice, importPath: v.original });
  }

  // 제안 계산
  for (const key of Object.keys(byFile)) {
    const s = byFile[key];
    const targetLayers = new Set<Layer>();
    const slices = new Set<string>();
    for (const r of s.reasons) {
      if (r.toLayer) targetLayers.add(r.toLayer);
      if (r.toSlice) slices.add(r.toSlice);
    }
    const sugLayer = minimalLayerFor(targetLayers);
    s.suggestedLayer = sugLayer ?? undefined;

    if (slices.size === 1) s.suggestedSlice = [...slices][0];
    else s.ambiguous = true;

    if (s.suggestedLayer && s.suggestedSlice && !s.ambiguous) {
      const baseName = path.basename(s.file);
      s.targetPath = path.join(srcRoot, s.suggestedLayer, s.suggestedSlice, 'lib', baseName);
    }
  }

  const planPath = path.join(projectRoot, 'fsd-move-plan.json');
  await fs.writeFile(planPath, JSON.stringify(Object.values(byFile), null, 2), 'utf8');

  // 쉘 스크립트(모호하지 않은 것만)
  const lines: string[] = ['#!/usr/bin/env bash', 'set -euo pipefail'];
  for (const s of Object.values(byFile)) {
    if (s.targetPath) {
      lines.push(`mkdir -p "${path.dirname(s.targetPath)}"`);
      lines.push(`git mv "${s.file}" "${s.targetPath}" || mv "${s.file}" "${s.targetPath}"`);
    }
  }
  const shPath = path.join(projectRoot, 'fsd-move.sh');
  await fs.writeFile(shPath, lines.join('\n') + '\n', 'utf8');

  console.log(`\n[이동 계획] ${planPath} / ${shPath} 생성 (모호한 항목은 이동 제외)`);
};

/* ===========================
 * 메인
 * =========================== */

const main = async (): Promise<void> => {
  if (!(await exists(srcRoot))) {
    console.error(`src 디렉터리를 찾을 수 없습니다: ${srcRoot}`);
    process.exit(1);
  }

  // 1) 배럴 생성
  if (mode.barrels !== 'none') {
    await generateBarrels(mode.barrels);
    console.log(`Barrels regenerated (${mode.barrels}).`);
  }

  // 2) 경로 정규화
  const files = await fg(['src/**/*.{ts,tsx,js,jsx}'], {
    cwd: projectRoot,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
  });

  const allEdits: ImportEdit[] = [];
  for (const f of files) {
    const edits = await processFile(f);
    allEdits.push(...edits);
  }

  // 3) specifier 교정
  if (mode.fix && !mode.noSpecifiers) {
    let updated = 0;
    for (const f of files) {
      const ok = await fixImportSpecifiersInFile(f);
      if (ok) updated++;
    }
    if (updated > 0) console.log(`Import specifiers fixed in ${updated} files.`);
  }

  // 4) 리포트
  const reverse = allEdits.filter(e => e.violation);
  const fixed = allEdits.filter(e => e.next && !e.violation);
  const suggested = allEdits.filter(e => e.next && e.violation);

  if (reverse.length > 0) {
    console.log('\n[역참조 감지]');
    for (const r of reverse) {
      console.log(
        `- ${path.relative(projectRoot, r.fromFile)} imports "${r.original}" (${r.reason})${r.next ? ` → 후보: "${r.next}"` : ''}`
      );
    }
  }

  if (fixed.length > 0) {
    console.log('\n[공개 API로 정규화 완료]');
    for (const r of fixed) {
      console.log(`- ${path.relative(projectRoot, r.fromFile)}: "${r.original}" → "${r.next}"`);
    }
  }

  if (suggested.length > 0) {
    console.log('\n[역참조지만 공개 API로 축약 제안]');
    for (const r of suggested) {
      console.log(
        `- ${path.relative(projectRoot, r.fromFile)}: "${r.original}" → "${r.next}" (규칙 위반 자체는 남음)`
      );
    }
  }

  // 5) 이동 계획 산출
  if (mode.planMoves) {
    await planMoves(files, allEdits);
  }

  if (reverse.length > 0 && mode.check) {
    process.exit(2);
  }
};

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

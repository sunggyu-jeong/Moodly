/* FSD 코데모드 통합 버전
   기능
   1) 임포트 경로 정규화: 깊은 내부 경로 → @/<layer>/<slice> (--fix)
   2) 배럴(index.ts) 재생성: 파일 default도 파일명으로 named re-export (--barrels)
      - 파일: export * + export { default as FileName } from './FileName'
      - 디렉터리: export * 만 (default 재수출 없음)
   3) 배럴에서의 default import를 named import로 교정 (--fix)
      - import Foo from '@/shared/ui' → import { Foo } from '@/shared/ui'

   사용법
     체크만: pnpm tsx tools/fsd-codemod.ts --check
     수정만: pnpm tsx tools/fsd-codemod.ts --fix
     배럴만: pnpm tsx tools/fsd-codemod.ts --barrels
     둘다:   pnpm tsx tools/fsd-codemod.ts --barrels --fix
     옵션:   --no-specifiers 를 주면 default→named 변환 생략
*/

import fg from 'fast-glob';
import { promises as fs } from 'fs';
import * as path from 'path';

type Layer = 'app' | 'pages' | 'widgets' | 'features' | 'entities' | 'shared';

type Mode = {
  check: boolean;
  fix: boolean;
  barrels: boolean;
  noSpecifiers: boolean;
};

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const aliasPrefix = '@';

const layers: Layer[] = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

const exts = ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];
const indexCandidates = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];

const mode: Mode = {
  check:
    process.argv.includes('--check') ||
    (!process.argv.includes('--fix') && !process.argv.includes('--barrels')),
  fix: process.argv.includes('--fix'),
  barrels: process.argv.includes('--barrels'),
  noSpecifiers: process.argv.includes('--no-specifiers'),
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
  if (importPath.startsWith(aliasPrefix + '/')) {
    const relFromAlias = importPath.slice((aliasPrefix + '/').length);
    const abs = path.join(srcRoot, relFromAlias);
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
  `${aliasPrefix}/${targetLayer}/${sliceName}`;

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

/* 배럴 생성 로직 */

const PUBLIC_SUBDIRS = ['ui', 'model', 'lib', 'hooks', 'api', 'types'] as const;
const SHARED_PUBLIC_DIRS = ['ui', 'hooks', 'lib', 'api', 'constants', 'styles'] as const;

const EXCLUDE_DIR_NAMES = new Set(['node_modules', 'internal', '__mocks__', '__tests__', '.git']);
const EXCLUDE_FILE_PATTERNS = [
  /\.d\.ts$/,
  /\.test\.(t|j)sx?$/,
  /\.spec\.(t|j)sx?$/,
  /\.stories\.(t|j)sx?$/,
  /^index\.(t|j)sx?$/,
];

const isExcludedFile = (name: string): boolean => EXCLUDE_FILE_PATTERNS.some(re => re.test(name));
const toExportName = (fileBase: string): string => fileBase.replace(/\W+/g, '_');

type BarrelItem = { relNoExt: string; base: string; kind: 'file' | 'dir' };

const writeBarrel = async (dir: string, items: BarrelItem[]): Promise<void> => {
  const lines: string[] = [];
  for (const it of items) {
    lines.push(`export * from './${it.relNoExt}';`);
    if (it.kind === 'file') {
      const exportName = toExportName(path.basename(it.base));
      lines.push(`export { default as ${exportName} } from './${it.relNoExt}';`);
    }
  }
  const indexPath = path.join(dir, 'index.ts');
  await fs.writeFile(indexPath, lines.join('\n') + '\n', 'utf8');
};

const scanDirectoryForBarrel = async (dir: string): Promise<void> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (EXCLUDE_DIR_NAMES.has(e.name) || e.name.startsWith('_')) continue;
    await scanDirectoryForBarrel(path.join(dir, e.name));
  }

  const files = entries
    .filter(e => e.isFile())
    .map(e => e.name)
    .filter(name => !isExcludedFile(name));

  const items: BarrelItem[] = [];
  for (const f of files) {
    const noExt = f.replace(/\.(t|j)sx?$/, '');
    items.push({ relNoExt: noExt, base: noExt, kind: 'file' });
  }

  const subdirs = entries
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(name => !EXCLUDE_DIR_NAMES.has(name) && !name.startsWith('_'));

  for (const d of subdirs) {
    const subIndex = path.join(dir, d, 'index.ts');
    if (await exists(subIndex)) {
      items.push({ relNoExt: d, base: d, kind: 'dir' });
    }
  }

  if (items.length > 0) {
    await writeBarrel(dir, items);
  }
};

const generateForSlice = async (sliceDir: string): Promise<void> => {
  const pubs = PUBLIC_SUBDIRS.map(d => path.join(sliceDir, d));
  for (const d of pubs) {
    if (await isDir(d)) {
      await scanDirectoryForBarrel(d);
    }
  }
  const lines: string[] = [];
  for (const d of pubs) {
    if (await exists(path.join(d, 'index.ts'))) {
      lines.push(`export * from './${path.basename(d)}';`);
    }
  }
  if (lines.length > 0) {
    await fs.writeFile(path.join(sliceDir, 'index.ts'), lines.join('\n') + '\n', 'utf8');
  }
};

const generateForShared = async (): Promise<void> => {
  for (const name of SHARED_PUBLIC_DIRS) {
    const p = path.join(srcRoot, 'shared', name);
    if (await isDir(p)) {
      await scanDirectoryForBarrel(p);
    }
  }
  const lines: string[] = [];
  for (const name of SHARED_PUBLIC_DIRS) {
    const idx = path.join(srcRoot, 'shared', name, 'index.ts');
    if (await exists(idx)) {
      lines.push(`export * from './${name}';`);
    }
  }
  if (lines.length > 0) {
    await fs.writeFile(path.join(srcRoot, 'shared', 'index.ts'), lines.join('\n') + '\n', 'utf8');
  }
};

const generateBarrels = async (): Promise<void> => {
  for (const layer of layers) {
    if (layer === 'shared') continue;
    const layerDir = path.join(srcRoot, layer);
    if (!(await isDir(layerDir))) continue;
    const slices = await fg(['*'], { cwd: layerDir, onlyDirectories: true, absolute: true });
    for (const sliceDir of slices) {
      await generateForSlice(sliceDir);
    }
  }
  await generateForShared();
};

/* import 경로 정규화 */

const processFile = async (absFile: string): Promise<ImportEdit[]> => {
  const text = await fs.readFile(absFile, 'utf8');
  const imports = collectImportStatements(text);
  if (imports.length === 0) return [];

  const fromLayer = detectLayer(absFile);
  const edits: ImportEdit[] = [];
  let newText = text;
  let replaced = false;

  for (const im of imports) {
    const targetAbs = await resolveImportTargetAbs(absFile, im.spec);
    if (!targetAbs) continue;
    if (!isInSrc(targetAbs)) continue;

    const toLayer = detectLayer(targetAbs);
    const fromOrd = layerOrder(fromLayer);
    const toOrd = layerOrder(toLayer);

    const isReverse = fromOrd > toOrd;
    const sliceInfo = sliceRootDir(targetAbs);

    let publicPath: string | null = null;
    if (sliceInfo) {
      publicPath = toPublicApiImport(sliceInfo.layer, sliceInfo.sliceName);
    }

    const alreadyPublic =
      publicPath !== null && (im.spec === publicPath || im.spec.startsWith(publicPath + '/index'));

    let nextPath: string | undefined;

    if (isReverse) {
      if (publicPath && !alreadyPublic) nextPath = publicPath;
      edits.push({
        fromFile: absFile,
        original: im.spec,
        next: nextPath,
        reason: `Reverse import: ${fromLayer ?? 'unknown'} → ${toLayer ?? 'unknown'}`,
        violation: true,
      });
    } else {
      if (!alreadyPublic && publicPath) {
        nextPath = publicPath;
        edits.push({
          fromFile: absFile,
          original: im.spec,
          next: nextPath,
          reason: 'Deep internal import → public API',
          violation: false,
        });
      }
    }

    if (mode.fix && nextPath) {
      const re = new RegExp(`(['"])${escapeRegExp(im.spec)}\\1`, 'g');
      newText = newText.replace(re, `'${nextPath}'`);
      replaced = true;
    }
  }

  if (mode.fix && replaced) {
    await fs.writeFile(absFile, newText, 'utf8');
  }

  return edits;
};

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* 배럴 경로의 default import → named import 변환 */

const BARREL_PATH_RE =
  /^@\/(shared\/[a-z0-9_-]+|features\/[^/]+|widgets\/[^/]+|entities\/[^/]+|pages\/[^/]+|app\/[^/]+)/i;

const DEFAULT_WITH_NAMED_RE =
  /import\s+([A-Za-z0-9_$]+)\s*,\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]\s*;?/g;

const DEFAULT_ONLY_RE = /import\s+([A-Za-z0-9_$]+)\s+from\s*['"]([^'"]+)['"]\s*;?/g;

const fixImportSpecifiersInFile = async (abs: string): Promise<boolean> => {
  let code = await fs.readFile(abs, 'utf8');
  let changed = false;

  code = code.replace(
    DEFAULT_WITH_NAMED_RE,
    (m, def: string, namedGroup: string, source: string) => {
      if (!BARREL_PATH_RE.test(source)) return m;
      const merged = [
        def.trim(),
        ...namedGroup
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      ]
        .join(', ')
        .replace(/\s+,/g, ',');
      changed = true;
      return `import { ${merged} } from '${source}';`;
    }
  );

  code = code.replace(DEFAULT_ONLY_RE, (m, def: string, source: string) => {
    if (!BARREL_PATH_RE.test(source)) return m;
    changed = true;
    return `import { ${def.trim()} } from '${source}';`;
  });

  if (changed) {
    await fs.writeFile(abs, code, 'utf8');
  }
  return changed;
};

/* 메인 */

const main = async (): Promise<void> => {
  if (!(await exists(srcRoot))) {
    console.error(`src 디렉터리를 찾을 수 없습니다: ${srcRoot}`);
    process.exit(1);
  }

  if (mode.barrels) {
    await generateBarrels();
    console.log('Barrels regenerated successfully.');
  }

  const files = await fg(['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'], {
    cwd: projectRoot,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
  });

  const allEdits: ImportEdit[] = [];
  for (const f of files) {
    const edits = await processFile(f);
    allEdits.push(...edits);
  }

  if (mode.fix && !mode.noSpecifiers) {
    let updated = 0;
    for (const f of files) {
      const ok = await fixImportSpecifiersInFile(f);
      if (ok) updated++;
    }
    if (updated > 0) {
      console.log(`Import specifiers fixed in ${updated} files.`);
    }
  }

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

  if (reverse.length > 0 && mode.check) {
    process.exit(2);
  }
};

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

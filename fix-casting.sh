#!/usr/bin/env bash
set -euo pipefail

# 원하는(목표) 파일 경로들(소문자/원하는 케이싱)
targets=(
  "src/shared/api/appApi.ts"
  "src/shared/api/supabaseBaseQuery.ts"
  "src/shared/api/tagTypes.ts"
  "src/shared/constants/colors.ts"
  "src/shared/constants/constants.ts"
  "src/shared/constants/icons.ts"
  "src/shared/ui/elements/skeleton/SettingSkeleton.tsx"
  "src/shared/ui/elements/skeleton/SkeletonContainer.tsx"
)

echo "레포 루트에서 실행하세요. Git에 기록된 실제 파일명을 찾아 대소문자 정리합니다."

for desired in "${targets[@]}"; do
  # git에 저장된 파일 목록에서 대소문자 무시 매칭(널 구분자 처리)
  existing=$(git ls-files -z | tr '\0' '\n' | awk -v d="$desired" 'BEGIN{ld=tolower(d)} { if(tolower($0)==ld) print $0 }')

  if [ -z "$existing" ]; then
    echo "[SKIP] Git이 추적하지 않음: $desired"
    continue
  fi

  if [ "$existing" = "$desired" ]; then
    echo "[OK] 이미 일치: $desired"
    continue
  fi

  echo "[FIX] Git에 기록된: '$existing' -> 표준화: '$desired'"

  # 임시 이름을 거쳐 강제 변경 (중간 이름으로 git이 변경을 감지하도록)
  tmp="${existing}.tmp_casing_fix_$$"
  git mv "$existing" "$tmp"
  git mv "$tmp" "$desired"
done

# 변경사항 스테이징/커밋/푸시
git add -A
git commit -m "chore: normalize filename casing"
git push

echo "완료: 파일명 대소문자 정리 커밋 및 push 완료"
echo "이제 빌드 다시 시도: eas build --platform ios --profile development"

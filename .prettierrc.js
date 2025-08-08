module.exports = {
  // 함수 호출 시 괄호 스타일: 단일 매개변수에는 괄호 생략
  arrowParens: 'avoid',
  // ES5 호환 잔여 쉼표 허용 (objects, arrays, imports 등)
  trailingComma: 'es5',
  // 문자열에 작은따옴표 사용
  singleQuote: true,
  // HTML/XML 태그 속성을 한 줄에 하나씩 작성
  singleAttributePerLine: true,
  // 문장 끝에 세미콜론 추가
  semi: true,
  // 객체 키에 필요할 때만 따옴표 사용
  quoteProps: 'as-needed',
  // 마크다운에서 텍스트 감싸기 보존
  proseWrap: 'preserve',
  // 줄 길이 제한: 100자
  printWidth: 100,
  // 객체 리터럴: 중괄호와 내용 사이에 공백 허용
  bracketSpacing: true,
  // 탭 대신 스페이스 사용
  useTabs: false,
  // HTML 파일의 공백 민감도 설정
  htmlWhitespaceSensitivity: 'css',
  // 줄바꿈 방식: LF
  endOfLine: 'lf',
  // 내장 언어 코드(예: HTML, GraphQL) 자동 포맷팅
  embeddedLanguageFormatting: 'auto',
  // 탭 너비: 2 스페이스
  tabWidth: 2,
};

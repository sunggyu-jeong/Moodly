import { isEmpty } from './value.util';

export function withRequired<F extends (...args: unknown[]) => unknown>(
  fn: F,
  paramNames: string[],
) {
  return async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    paramNames.forEach((name, idx) => {
      if (isEmpty(args[idx])) {
        throw new Error(`${name}은(는) 필수값입니다.`);
      }
    });
    // 타입 단언 없이 원본 함수 실행
    return fn(...args) as Awaited<ReturnType<F>>;
  };
}

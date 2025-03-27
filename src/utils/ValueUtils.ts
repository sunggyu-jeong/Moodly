/**
 * 주어진 값이 비어있는 지 확인합니다.
 *
 * @param {T} value - The value to check for emptiness.
 * @returns {boolean} Returns true if the value is considered empty, false otherwise.
 *
 * @description
 * 다양한 유형의 값을 확인하고 비어있음으로 간주되는 지 판단합니다.
 * - null or undefined
 * - Empty or whitespace-only strings
 * - Empty arrays
 * - Empty objects (excluding arrays)
 * - NaN numbers
 *
 * @testcase 위치: __tests__/utils/ValueUtil.test.ts
 */
export const isEmpty = <T>(value: T): boolean => {
  /** 주어진 값이 null이거나 undefined인 경우 */
  if (value === null || value === undefined) return true;
  /** 주어진 값이 문자열이고, 공백을 제거한 문자열이 빈값일 경우 */
  if (typeof value === 'string' && value.trim() === '') return true;
  /** 주어진 값이 배열이고, 배열의 길이가 0일 경우 */
  if (Array.isArray(value) && value.length === 0) return true;
  /** 주어진 값이 객체이고, 객체의 데이터가 빈 경우 */
  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return true;
  /** 주어진 값이 숫자이고, Nan 일 경우 */
  if (typeof value === 'number' && Number.isNaN(value) === true) return true;

  /** 위 주어진 케이스가 아닐경우, 값이 있다고 판단 */
  return false;
};

export const isNotEmpty = <T>(value: T): boolean => !isEmpty(value)

/**
 * 주어진 값이 비어있는 경우 기본값을 반환하고, 그렇지 않으면 주어진 값을 반환
 *
 * @template T - 주어진 값의 타입
 * @template R - 기본값의 타입
 * @param {T} value - 검사할 값
 * @param {R} defaultValue - 값이 비어있을 때 반환할 기본값
 * @returns {R | T} - 값이 비어있으면 기본값을, 그렇지 않으면 주어진 값을 반환
 */
const defaultTo = <T, R>(value: T, defaultValue: R): R | T =>
  isEmpty(value) ? defaultValue : value;

/**
 * 주어진 데이터가 빈 데이터면 '', 그렇지 않으면 본래 데이터 반환
 *
 * @param {T} value 입력정보
 * @returns {T | ''} 빈 데이터일 경우 '', 데이터가 있을 경우 본래 데이터 반환
 */
export const defaultToBlank = <T>(value: T): T | '' => defaultTo(value, '');

/**
 * 주어진 데이터가 빈 데이터면 null, 그렇지 않으면 본래 데이터 반환
 *
 * @param {T} value 입력정보
 * @returns {T | null} 빈 데이터일 경우 null, 데이터가 있을 경우 본래 데이터 반환
 */
export const defaultToNull = <T>(value: T): T | null => defaultTo(value, null);

/**
 * 주어진 데이터가 빈 데이터면 0, 그렇지 않으면 본래 데이터 반환
 *
 * @param {T} value 입력정보
 * @returns {T | 0} 빈 데이터일 경우 0, 데이터가 있을 경우 본래 데이터 반환
 */
export const defaultToZero = <T>(value: T): T | 0 => defaultTo(value, 0);

/**
 * 주어진 객체에서 주어진 키에 해당하는 값을 반환
 *
 * @param {T} obj - 객체
 * @param {keyof T} key - 키
 * @returns {T[keyof T]} - 키에 해당하는 값
 */
export const rawValue = <T extends Record<string, string>>(
  obj: T,
  key: keyof T
): T[keyof T] => obj[key];

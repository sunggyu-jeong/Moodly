import dayjs, { Dayjs } from 'dayjs';

/**
 * KST(Asia/Seoul) 기준의 Day.js 객체를 생성합니다.
 * 이 함수는 앱의 모든 날짜 생성 기준점이 되어야 합니다.
 * `dayjs()` 대신 이 함수를 사용하세요.
 * @param input (선택) 날짜로 변환할 값 (e.g., '2025-12-25', new Date())
 * @returns KST로 설정된 Day.js 객체
 */
export const now = (input?: dayjs.ConfigType): Dayjs => {
  if (input) {
    const parsed = dayjs(input);
    if (parsed.isUTC()) {
      return dayjs.utc(input).tz('Asia/Seoul');
    }
    return parsed.tz('Asia/Seoul');
  }
  return dayjs().tz('Asia/Seoul');
};
/**
 * Day.js 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * @param date 변환할 Day.js 객체
 * @returns 'YYYY-MM-DD' 형식의 문자열
 */

export const formatDate = (date?: Dayjs): string => now(date).format('YYYY-MM-DD');
/**
 * Day.js 객체를 'YYYY-MM-DD HH:mm:ss' 형식의 문자열로 변환합니다.
 * @param date 변환할 Day.js 객체
 * @returns 'YYYY-MM-DD HH:mm:ss' 형식의 문자열
 */
export const formatDateTime = (date: Dayjs): string => date.format('YYYY-MM-DD HH:mm:ss');

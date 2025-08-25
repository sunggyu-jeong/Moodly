// date.utils.test.ts

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { formatDate, formatDateTime, now } from '../day.util';

// dayjs에 timezone 플러그인 적용
dayjs.extend(utc);
dayjs.extend(timezone);

describe('날짜 유틸리티 함수 테스트', () => {
  const MOCK_DATE_UTC = '2025-08-25T16:00:00.000Z';
  const KST_EXPECTED_DATE = '2025-08-26';
  const KST_EXPECTED_DATETIME = '2025-08-26 01:00:00';

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCK_DATE_UTC));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('now()', () => {
    it('인자 없이 호출하면 현재 고정된 시간을 KST 기준 dayjs 객체로 반환해야 한다', () => {
      const result = now();
      expect(result.tz('Asia/Seoul').format('YYYY-MM-DD')).toBe(KST_EXPECTED_DATE);
    });

    it('특정 날짜 문자열을 넘기면 해당 날짜의 KST dayjs 객체를 반환해야 한다', () => {
      const input = '2024-01-01T00:00:00.000Z'; // UTC
      const result = now(input);
      expect(result.tz('Asia/Seoul').format('YYYY-MM-DD')).toBe('2024-01-01');
      expect(result.tz('Asia/Seoul').hour()).toBe(9); // UTC 자정은 KST 오전 9시
    });
  });

  describe('formatDate()', () => {
    it('Dayjs 객체를 YYYY-MM-DD 형식으로 변환한다', () => {
      const result = formatDate(now());
      expect(result).toBe(KST_EXPECTED_DATE);
    });
  });

  describe('formatDateTime()', () => {
    it('Dayjs 객체를 YYYY-MM-DD HH:mm:ss 형식으로 변환한다', () => {
      const result = formatDateTime(now());
      expect(result).toBe(KST_EXPECTED_DATETIME);
    });
  });

  describe('다른 시간대 시나리오 (08:00 UTC)', () => {
    const MOCK_DATE_UTC = '2025-08-25T08:00:00.000Z';
    const EXPECTED_KST_DATE = '2025-08-25';
    const EXPECTED_KST_DATETIME = '2025-08-25 17:00:00';

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(MOCK_DATE_UTC));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('now() > KST 변환 확인', () => {
      const result = now();
      expect(result.format('YYYY-MM-DD')).toBe(EXPECTED_KST_DATE);
      expect(result.hour()).toBe(17);
    });

    it('formatDate() > YYYY-MM-DD', () => {
      const result = formatDate(now());
      expect(result).toBe(EXPECTED_KST_DATE);
    });

    it('formatDateTime() > YYYY-MM-DD HH:mm:ss', () => {
      const result = formatDateTime(now());
      expect(result).toBe(EXPECTED_KST_DATETIME);
    });
  });
});

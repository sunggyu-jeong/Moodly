import { isEmpty } from "../../src/utils/ValueUtils";

describe('isEmpty_함수', () => {
  test('null_또는_undefined는_비어있다고_판단해야_한다.', () => {
    // Given: null과 undefined
    const nullValue = null;
    const undefinedValue = undefined;

    // When & Then
    expect(isEmpty(nullValue)).toBe(true);
    expect(isEmpty(undefinedValue)).toBe(true);
  });

  test('빈_문자열_또는_공백_문자열은_비어있다고_판단해야_한다.', () => {
    // Given
    const emptyString = '';
    const whitespaceString = '   ';

    // When & Then
    expect(isEmpty(emptyString)).toBe(true);
    expect(isEmpty(whitespaceString)).toBe(true);
  });

  test('빈_배열은_비어있다고_판단해야_한다.', () => {
    // Given
    const emptyArray: any[] = [];

    // When & Then
    expect(isEmpty(emptyArray)).toBe(true);
  });

  test('빈_객체는_비어있다고_판단해야_한다.', () => {
    // Given
    const emptyObject = {};

    // When & Then
    expect(isEmpty(emptyObject)).toBe(true);
  });

  test('NaN은_비어있다고_판단해야_한다.', () => {
    // Given
    const notANumber = NaN;

    // When & Then
    expect(isEmpty(notANumber)).toBe(true);
  });

  test('값이_있는_경우에는_비어있지_않다고_판단해야_한다.', () => {
    // Given
    const nonEmptyString = '안녕하세요';
    const nonEmptyArray = [1, 2, 3];
    const nonEmptyObject = { key: 'value' };
    const numberValue = 42;
    const trueValue = true;
    const zero = 0;

    // When & Then
    expect(isEmpty(nonEmptyString)).toBe(false);
    expect(isEmpty(nonEmptyArray)).toBe(false);
    expect(isEmpty(nonEmptyObject)).toBe(false);
    expect(isEmpty(numberValue)).toBe(false);
    expect(isEmpty(trueValue)).toBe(false);
    expect(isEmpty(zero)).toBe(false); // 0은 유효한 값으로 간주한다.
  });
});
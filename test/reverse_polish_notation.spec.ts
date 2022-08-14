import assert from 'assert';
import { calculate, decode } from '../src/reverse_polish_notation';

describe('poland', function () {
  describe('calculate', () => {
    const tests = [
      { exp: '8542/-*', expected: 24 },
      { exp: '634*8-+', expected: 10 },
      { exp: '312/-8*', expected: 20 },
      { exp: '13+21-*', expected: 4 },
      { exp: '12+3+4+', expected: 10 },
    ];
    for (const test of tests) {
      const { exp, expected } = test;
      it(exp, () => {
        const result = calculate(exp);
        assert.deepStrictEqual(result, expected);
      });
    }
  });

  describe('decode', function () {
    const tests = [
      { exp: '8115/-*', expected: '8*(1-1/5)' },
      { exp: '634*8-+', expected: '6+3*4-8' },
      { exp: '374/-8*', expected: '(3-7/4)*8' },
      { exp: '11+61-*', expected: '(1+1)*(6-1)' },
      { exp: '12+3+4+', expected: '1+2+3+4' },
    ];
    for (const test of tests) {
      const { exp, expected } = test;
      it(exp, () => {
        const result = decode(exp);
        assert.deepStrictEqual(result, expected);
      });
    }
  });
});

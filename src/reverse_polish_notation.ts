/**
 * 逆ポーランド記法から計算した結果を返す
 */
export const calculate = (exp: string): number => {
  const space: number[] = [];

  for (const c of exp) {
    if (c >= '0' && c <= '9') {
      const add = parseInt(c);
      space.push(add);
    } else {
      // 演算子なら末尾から2つの数を取り出す
      const second = space.pop();
      const first = space.pop();
      if (second === undefined || first === undefined) {
        throw new Error('unexpected expression');
      }

      // 演算子の実施結果を配列の末尾に挿入する
      switch (c) {
        case '+': {
          space.push(first + second);
          break;
        }
        case '-': {
          space.push(first - second);
          break;
        }
        case '*': {
          space.push(first * second);
          break;
        }
        case '/': {
          space.push(first / second);
          break;
        }
      }
    }
  }
  const last = space.pop();
  if (typeof last !== 'number') {
    throw new Error(`invalid result: ${last}`);
  }
  return last;
};

// 単独の数値を除いた計算式に括弧をつけ、演算子の優先順位が高くする
const updatePriority = (exp: string): string => {
  if (exp.length > 1) {
    return `(${exp})`;
  }
  return exp;
};

/**
 * 逆ポーランド記法の計算式から通常の計算式に復元する
 */
export const decode = (exp: string): string => {
  let space: string[] = [];

  for (const c of exp) {
    if (c >= '0' && c <= '9') {
      space.push(c);
    } else {
      const second = space.pop();
      const first = space.pop();
      if (second === undefined || first === undefined) {
        throw new Error('unexpected expression');
      }

      // 演算子を元に復元した計算式を配列の末尾に挿入する
      switch (c) {
        case '+': {
          const item = `${first}+${second}`;
          space.push(item);
          break;
        }
        case '-': {
          const item = `${first}-${second}`;
          space.push(item);
          break;
        }
        case '*': {
          const _first = updatePriority(first);
          const _second = updatePriority(second);
          const item = `${_first}*${_second}`;
          space.push(item);
          break;
        }
        case '/': {
          const _first = updatePriority(first);
          const _second = updatePriority(second);
          const item = `${_first}/${_second}`;
          space.push(item);
          break;
        }
      }
    }
  }
  const last = space.pop();
  if (typeof last !== 'string') {
    throw new Error(`invalid result: ${last}`);
  }
  return last;
};

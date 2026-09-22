/**
 * 按模板语法把一行拆成若干格。语法错误直接抛出，由调用方渲染成错误提示。
 */
export function parseRow(row) {
  const chars = Array.from(String(row)); // Array.from 按 code point 切，代理对不会被劈开
  const cells = [];
  let index = 0;

  while (index < chars.length) {
    const char = chars[index];

    // 普通字符：一个 code point 就是一格
    if (char !== '`') {
      cells.push(char);
      index += 1;
      continue;
    }

    // 反引号：一直读到下一个未转义的反引号为止，整段算一个标志符
    index += 1;
    let buffer = '';
    let closed = false;
    while (index < chars.length) {
      const current = chars[index];
      if (current === '`') {
        closed = true;
        index += 1;
        break;
      }
      if (current === '\\') {
        index += 1;
        if (index >= chars.length) throw new Error('未闭合的转义序列');
        const escaped = chars[index];
        if (escaped !== '`' && escaped !== '\\') {
          throw new Error(`不支持的转义序列 \\${escaped}，反引号内只能转义 \` 和 \\`);
        }
        buffer += escaped;
        index += 1;
        continue;
      }
      buffer += current;
      index += 1;
    }
    if (!closed) throw new Error('未闭合的反引号标志符');
    cells.push(buffer);
  }

  return cells;
}


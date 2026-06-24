// One-off migration: convert native <details>/<summary> to the <Details> component.
// Run: node scripts/migrate-details.cjs
// Idempotent-ish: only rewrites files containing <details>.
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs');

function findFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) findFiles(p, out);
    else if (/\.(mdx?|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

// Decide how to render the summary attribute given its raw inner text.
function summaryAttr(raw) {
  const text = raw.trim();
  const needsNode = /["<>]/.test(text); // quotes or any JSX-ish markup
  if (!needsNode) return `summary="${text}"`;
  // Wrap in a fragment. Escape nothing — MDX/JSX handles <code> etc.
  // For double quotes inside, the fragment form avoids quote-escaping.
  return `summary={<>${text}</>}`;
}

function transform(content) {
  // Match a whole <details> ... </details> block (non-greedy, dotall).
  const re = /<details>\s*\n(\s*)<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
  let count = 0;
  let out = content.replace(re, (m, indent, summ, body) => {
    count++;
    let inner = body.replace(/^\s*\n/, '');          // remove blank line right after </summary>
    inner = inner.replace(/\n[ \t]*$/, '');           // trim trailing whitespace/newline
    const attr = summaryAttr(summ);
    return `<Details ${attr}>\n${inner}\n</Details>`;
  });

  // Add the import if the file uses <Details> but doesn't import it yet.
  let final = out;
  const usesDetails = /<Details\s/.test(final);
  const hasImport = /import Details from ['"]@site\/src\/components\/Details['"]/.test(final);
  if (usesDetails && !hasImport) {
    const importLine = "import Details from '@site/src/components/Details';";
    if (/(^import [^\n]+\r?\n)/m.test(final)) {
      final = final.replace(/((?:^import [^\n]+\r?\n)+)/m, (block) => block + importLine + '\n');
    } else {
      final = final.replace(/(^---[\s\S]*?---\r?\n)/, `$1\n${importLine}\n`);
    }
  }
  const changed = final !== content;
  return { content: final, changed, count };
}

let totalFiles = 0;
let totalBlocks = 0;
for (const file of findFiles(DOCS)) {
  const src = fs.readFileSync(file, 'utf8');
  const { content: next, changed, count } = transform(src);
  if (changed) {
    fs.writeFileSync(file, next, 'utf8');
    totalFiles++;
    totalBlocks += count;
    console.log(`  ${count}  ${path.relative(DOCS, file)}`);
  }
}
console.log(`\nDone: ${totalBlocks} blocks across ${totalFiles} files.`);

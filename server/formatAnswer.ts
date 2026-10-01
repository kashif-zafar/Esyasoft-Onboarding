/**
 * Safety net for chatbot replies.
 *
 * The chat bubble shows plain text, so Markdown symbols (**bold**, # headings,
 * --- rules, `code`, tables, links) would appear literally and hurt legibility.
 * This converts whatever the model returns into clean plain text:
 *  - paragraphs separated by one blank line
 *  - list items shown as "• item", one per line
 */
export function cleanAnswer(raw: string): string {
  let t = String(raw ?? '').replace(/\r\n?/g, '\n');

  // Code fences and inline code
  t = t.replace(/```[a-zA-Z0-9_-]*\n?/g, '').replace(/`([^`\n]*)`/g, '$1');

  // Horizontal rules (---, ***, ___)
  t = t.replace(/^[ \t]{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, '');

  // Tables: drop separator rows, turn "| a | b |" into "a - b"
  t = t.replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[\s|:-]*$/gm, '');
  t = t.replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_m, cells: string) =>
    cells
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
      .join(' - ')
  );

  // Headings and blockquotes
  t = t.replace(/^[ \t]{0,3}#{1,6}[ \t]*/gm, '');
  t = t.replace(/^[ \t]*>[ \t]?/gm, '');

  // Bold / italics / strikethrough markers
  t = t.replace(/(\*\*|__)([\s\S]+?)\1/g, '$2');
  t = t.replace(/~~([\s\S]+?)~~/g, '$1');
  t = t.replace(/(^|[\s(])\*(?![\s*])([^*\n]+?)\*(?=[\s).,;:!?]|$)/g, '$1$2');
  t = t.replace(/\*\*/g, '');

  // Links: [text](url) -> text (url)
  t = t.replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1 ($2)');

  // Bullet markers (-, *, +) -> "• "
  t = t.replace(/^[ \t]*[-*+][ \t]+/gm, '• ');

  // Trailing spaces (Markdown hard line breaks) and excess blank lines
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');

  return t.trim();
}

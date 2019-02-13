import katex from 'katex'

export const formulaToKatex = (formula, options) => {
  try {
    return katex.renderToString(formula, options);
  } catch (e) {
    if (!(e instanceof katex.ParseError)) {
      throw e;
    }
    console.error(
      "KaTeX auto-render: Failed to parse `" + formula + "` with ", e
    );
  }
  return null
}
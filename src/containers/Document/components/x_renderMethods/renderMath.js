import React from 'react'
import katex from 'katex'

const getKatexOptions = function(mathOptions) {
  return ({
    delimiters: [
      {left: mathOptions.delimiters.display.left, right: mathOptions.delimiters.display.right, display: true},
      {left: mathOptions.delimiters.inline.left, right: mathOptions.delimiters.inline.right, display: false},
    ]
  })
}

const renderMath = function(math, options) {
  const katexOpts = getKatexOptions(options.math)
  try {
    const html = katex.renderToString(math, katexOpts)
    return React.createElement('span', {dangerouslySetInnerHTML: {__html: html}})
  } catch(e) {
    if (!(e instanceof katex.ParseError)) {
      throw e
    }
    options.errorCallback(
      "KaTeX: Failed to parse `" + math + "` with ", e
    )
    return math
  }
}

export {
  renderMath,
  getKatexOptions,
}
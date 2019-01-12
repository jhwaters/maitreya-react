import React from 'react'
const katex = require('katex')
const markdownIt = require('markdown-it')
const mdmath = require('markdown-it-math')
const mdsup = require('markdown-it-sup');
const mdsub = require('markdown-it-sub');
const mdsmartarrows = require('markdown-it-smartarrows')


function renderText(text, opts = {}) {
  let md = new markdownIt()
  if (opts.markdown.subscript) { md = md.use(mdsub); }
  if (opts.markdown.superscript) { md = md.use(mdsup); }
  if (opts.markdown.smartarrows) { md = md.use(mdsmartarrows); }
  if (opts.math.render) {
    md = md.use(mdmath, {
      inlineRenderer: (str) => katex.renderToString(str),
      blockRenderer: (str) => '<div class="math-block">' + katex.renderToString(str, {displayMode: true}) + '</div>',
      inlineOpen: opts.math.delimiters.inline.left,
      inlineClose: opts.math.delimiters.inline.right,
      blockOpen: opts.math.delimiters.display.left,
      blockClose: opts.math.delimiters.display.right,
    })
  }

  return <span dangerouslySetInnerHTML={{__html: md.render(text)}} ></span> 
}


export default renderText
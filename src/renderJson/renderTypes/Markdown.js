import React from 'react'
import { defaultsDeep } from 'lodash'
import { formulaToKatex as formulaToHtml } from './katexMath'
import MarkdownIt from 'markdown-it'
import mdsup from 'markdown-it-sup'
import mdsub from 'markdown-it-sub'
import mdsmartarrows from 'markdown-it-smartarrows'
import mdmath from 'markdown-it-math'
import styles from './styles.module.css'

const defaultOptions = {
  renderMath: true,
  
  mdSuperscript: true,
  mdSubscript: true,
  mdSmartarrows: true,

  mathDelimiters: {
    display: {left: '$$$', right: '$$$'},
    inline: {left: '$$', right: '$$'},
  }
};

export const InlineMarkdown = ({data, options}) => {
  const opts = defaultsDeep({}, options, defaultOptions)
  let md = new MarkdownIt()
  if (opts.mdSubscript) { md = md.use(mdsub); }
  if (opts.mdSuperscript) { md = md.use(mdsup); }
  if (opts.mdSmartarrows) { md = md.use(mdsmartarrows); }
  if (opts.renderMath) {
    md = md.use(mdmath, {
      inlineRenderer: (str) => formulaToHtml(str),
      blockRenderer: (str) => formulaToHtml(str, {displayMode: true}),
      inlineOpen: opts.mathDelimiters.inline.left,
      inlineClose: opts.mathDelimiters.inline.right,
      blockOpen: opts.mathDelimiters.display.left,
      blockClose: opts.mathDelimiters.display.right,
    })
  }
  return <span dangerouslySetInnerHTML={{__html: md.renderInline(data)}} />
}

export const Markdown = ({data, options}) => {
  const opts = defaultsDeep({}, options, defaultOptions)
  let md = new MarkdownIt()
  if (opts.mdSubscript) { md = md.use(mdsub); }
  if (opts.mdSuperscript) { md = md.use(mdsup); }
  if (opts.mdSmartarrows) { md = md.use(mdsmartarrows); }
  if (opts.renderMath) {
    md = md.use(mdmath, {
      inlineRenderer: (str) => formulaToHtml(str),
      blockRenderer: (str) => formulaToHtml(str, {displayMode: true}),
      inlineOpen: opts.mathDelimiters.inline.left,
      inlineClose: opts.mathDelimiters.inline.right,
      blockOpen: opts.mathDelimiters.display.left,
      blockClose: opts.mathDelimiters.display.right,
    })
  }
  return (
    <span className={styles.Markdown} dangerouslySetInnerHTML={{__html: md.render(data)}} ></span> 
  )
}
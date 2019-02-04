/*
This renders math in text using markdown, and simple markdown using
markdown-it's inline renderer. For more complicated markdown, use
the 'markdown' type, which will be passed to the 'renderMarkdown' function
*/

import React from 'react'
import katex from 'katex'
import { defaultsDeep } from 'lodash'
import MarkdownIt from 'markdown-it'
import mdsup from 'markdown-it-sup'
import mdsub from 'markdown-it-sub'
import mdsmartarrows from 'markdown-it-smartarrows'
import mdmath from 'markdown-it-math'
import splitAtDelimiters  from 'katex/contrib/auto-render/splitAtDelimiters'


const defaultOptions = {
  renderMath: true,
  renderMarkdown: true,
  
  markdown: {
    superscript: true,
    subscript: true,
    smartarrows: true,
  },

  mathDelimiters: {
    display: {left: '$$$', right: '$$$'},
    inline: {left: '$$', right: '$$'},
  }
};



// from katex:
const splitWithDelimiters = function(text, delimiters) {
  let data = [{type: "text", data: text}];
  for (let i = 0; i < delimiters.length; i++) {
    const delimiter = delimiters[i];
    data = splitAtDelimiters(
      data, delimiter.left, delimiter.right,
      delimiter.display || false);
  }
  return data;
};

const MathAndMarkdown = ({data, options}) => {
  /**
   * Split text using Katex, then render pieces with katex (if math)
   * or markdown (inline only)
   */
  const katexOptions = {
    delimiters: [
      {left: options.mathDelimiters.display.left, right: options.mathDelimiters.display.right, display: true},
      {left: options.mathDelimiters.inline.left, right: options.mathDelimiters.inline.right, display: false},
    ],
    errorCallback: console.error,
  }

  return (
    <span>
      {splitWithDelimiters(data, katexOptions.delimiters).map((c,i) => {
        if (c.type === 'text') {
          if (options.renderMarkdown) {
            return <InlineMarkdown key={i} data={c.data} options={options} />
          } else {
            return <PlainText key={i} data={c.data} />
          }
        } else {
          return <KatexMath key={i} data={c} katexOptions={{...katexOptions, displayMode: c.display}} />
        }
      })}
    </span>
  )
}

const PlainText = ({data}) => {
  return <span>{data.toString()}</span>
}

const KatexMath = ({data, katexOptions}) => {
  try {
    const html = katex.renderToString(data.data, katexOptions);
    return <span dangerouslySetInnerHTML={{__html: html}} />
  } catch (e) {
    if (!(e instanceof katex.ParseError)) {
      throw e;
    }
    katexOptions.errorCallback(
      "KaTeX auto-render: Failed to parse `" + data.data + "` with ", e
    );
    return <span>{data.raw}</span>
  }
}

const InlineMarkdown = ({data, options}) => {
  let md = new MarkdownIt()
  if (options.markdown.subscript) {
    md = md.use(mdsub)
  }
  if (options.markdown.superscript) {
    md = md.use(mdsup)
  }
  if (options.markdown.smartarrows) {
    md = md.use(mdsmartarrows)
  }
  const html = md.renderInline(data)
  return <span dangerouslySetInnerHTML={{__html: html}} />
}

export const Text = props => {
  const { 
    fontFamily, 
    color,
    options,
    //renderMarkdown=true,
    //renderMath=true,
    //mathDelimiters=
  } = props
  const opts = defaultsDeep({}, options, defaultOptions)
  const style = {}
  if (fontFamily) {
    style.fontFamily = fontFamily
  }
  if (color) {
    style.color = color
  }
  if (opts.renderMath) {
    return (
      <span style={style}>
        {props.children.map((c,i) => <MathAndMarkdown key={i} options={opts} data={c}/>)}
      </span>
    )
  } else if (opts.renderMarkdown) {
    return (
      <span style={style}>
        {props.children.map((c,i) => <InlineMarkdown key={i} options={opts} data={c}/>)}
      </span>
    )
  } else {
    return (
      <span style={style}>
        {props.children.map((c,i) => <PlainText key={i} options={opts} data={c}/>)}
      </span>
    )
  }
}

export const Markdown = ({data, options}) => {
  const opts = defaultsDeep({}, options, defaultOptions)
  let md = new MarkdownIt()
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
  return (
    <span dangerouslySetInnerHTML={{__html: md.render(data)}} ></span> 
  )
}






/*
const defaultDelimiters = {
  display: {left: '$$$', right: '$$$'},
  inline: {left: '$$', right: '$$'},
}

const replaceMathDelimiters = function(text, options, delimiters=defaultDelimiters) {
  let optionsCopy = {...options.katex}
  const data = splitWithDelimiters(text, optionsCopy.delimiters)
  let result = ""
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "text") {
      result += data[i].data
    } else if (data[i].display) {
      result += `${delimiters.display.left}${data[i].data}${delimiters.display.right}`
    } else {
      result += `${delimiters.inline.left}${data[i].data}${delimiters.inline.right}`
    }
  }
  return result
}
*/

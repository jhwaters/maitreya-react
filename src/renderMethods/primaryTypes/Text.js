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
  markdown: {
    render: true,
    superscript: true,
    subscript: true,
    smartarrows: true,
  },

  math: {
    render: true,
    delimiters: {
      display: {left: '$$$', right: '$$$'},
      inline: {left: '$$', right: '$$'},
    },
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
      {left: options.math.delimiters.display.left, right: options.math.delimiters.display.right, display: true},
      {left: options.math.delimiters.inline.left, right: options.math.delimiters.inline.right, display: false},
    ],
    errorCallback: console.error,
  }

  return (
    <span>
      {splitWithDelimiters(data, katexOptions.delimiters).map((c,i) => {
        if (c.type === 'text') {
          if (options.markdown.render) {
            return <InlineMarkdown key={i} data={c.data} markdownOptions={options.markdown} />
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

const InlineMarkdown = ({data, markdownOptions}) => {
  let md = new MarkdownIt()
  if (markdownOptions.subscript) { md = md.use(mdsub); }
  if (markdownOptions.superscript) { md = md.use(mdsup); }
  if (markdownOptions.smartarrows) { md = md.use(mdsmartarrows); }
  const html = md.renderInline(data)
  return <span dangerouslySetInnerHTML={{__html: html}} />
}

export const Text = ({data, options}) => {
  if (typeof data === 'number') {
    return <PlainText data={data.toString()} />
  } else {
    const opts = defaultsDeep({}, options, defaultOptions)
    if (opts.math.render) {
      return <MathAndMarkdown data={data} options={opts} />
    } else if (opts.markdown.render) {
      return <InlineMarkdown data={data} markdownOptions={opts.markdown} />
    } else {
      return <PlainText data={data} />
    }
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

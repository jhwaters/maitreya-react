/*
This renders math in text using markdown, and simple markdown using
markdown-it's inline renderer. For more complicated markdown, use
the 'markdown' type, which will be passed to the 'renderMarkdown' function
*/

import React from 'react'
import katex from 'katex'
import MarkdownIt from 'markdown-it'
import mdsup from 'markdown-it-sup'
import mdsub from 'markdown-it-sub'
import mdsmartarrows from 'markdown-it-smartarrows'
import splitAtDelimiters  from './splitAtDelimiters'


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


const reactRenderMathInText = function(text, options) {
  let optionsCopy = {
    delimiters: [
      {left: options.math.delimiters.display.left, right: options.math.delimiters.display.right, display: true},
      {left: options.math.delimiters.inline.left, right: options.math.delimiters.inline.right, display: false},
    ],
    errorCallback: console.error,
  }
  const data = splitWithDelimiters(text, optionsCopy.delimiters);
  let children = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "text") {
      children.push(reactRenderMarkdownInText(data[i].data, options))
    } else {
      const math = data[i].data
      optionsCopy.displayMode = data[i].display
      try {
        const html = katex.renderToString(math, optionsCopy);
        children.push(React.createElement('span', {dangerouslySetInnerHTML: {__html: html}}))
      } catch (e) {
        if (!(e instanceof katex.ParseError)) {
          throw e;
        }
        optionsCopy.errorCallback(
          "KaTeX auto-render: Failed to parse `" + data[i].data +
          "` with ",
          e
        );
        children.push(data[i].rawData)
      }
    }
  }
  return React.createElement('span', {}, ...children)
}

const reactRenderMarkdownInText = function(text, options) {
  if (options.math.render) {
    let md = new MarkdownIt()
    if (options.markdown.subscript) { md = md.use(mdsub); }
    if (options.markdown.superscript) { md = md.use(mdsup); }
    if (options.markdown.smartarrows) { md = md.use(mdsmartarrows); }
    const html = md.renderInline(text)
    return <span dangerouslySetInnerHTML={{__html: html}} />
  } else {
    return text
  }
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


const renderText = function(text, options) {
  if (typeof text === 'number') {
    return text.toString()
  } else {
    if (options.math.render) {
      return reactRenderMathInText(text, options)
    } else {
      return reactRenderMarkdownInText(text, options)
    }
  }
}

export default renderText
import React from 'react'
import katex from 'katex'
import { getKatexOptions, renderMath } from './renderMath'
import { renderMarkdownInline } from './renderMarkdown'
import splitAtDelimiters  from './katexSplitAtDelimiters'


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

const renderMathInText = function(text, options) {
  const katexOpts = getKatexOptions(options.math)
  const data = splitWithDelimiters(text, katexOpts.delimiters);
  let children = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "text") {
      children.push(renderMarkdownInline(data[i].data, options.markdown))
    } else {
      optionsCopy.displayMode = data[i].display
      children.push(renderMath(data[i].data, optionsCopy))
    }
  }
  return children
}

const defaultDelimiters = {
  display: {left: '$$$', right: '$$$'},
  inline: {left: '$$', right: '$$'},
}

export const replaceMathDelimiters = function(text, options, delimiters=defaultDelimiters) {
  const katexOpts = getKatexOptions(options)
  const data = splitWithDelimiters(text, katexOptions.delimiters)
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

export const renderText = function(text, options) {
  if (typeof text === 'number') {
    return text.toString()
  } else {
    if (options.math.render) {
      return renderMathInText(text, options)
    } else if (options.markdown.render) {
      return renderMarkdownInline(text, options)
    } else {
      return text
    }
  }
}

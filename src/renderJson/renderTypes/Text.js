/*
This renders math in text using markdown, and simple markdown using
markdown-it's inline renderer. For more complicated markdown, use
the 'markdown' type, which will be passed to the 'renderMarkdown' function
*/

import React from 'react'
import splitAtDelimiters  from 'katex/contrib/auto-render/splitAtDelimiters'
import { defaultsDeep } from 'lodash'
import { Math, DisplayMath } from './Math'
import { Markdown, InlineMarkdown } from './Markdown'

const defaultOptions = {
  renderMath: true,
  markdown: 'inline',
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

const ParseMath = ({data, options}) => {
  const delimiters = [
    {left: options.mathDelimiters.display.left, right: options.mathDelimiters.display.right, display: true},
    {left: options.mathDelimiters.inline.left, right: options.mathDelimiters.inline.right, display: false},
  ]

  return (
    <span>
      {splitWithDelimiters(data, delimiters).map((c,i) => {
        if (c.type === 'text') {
          if (options.markdown) {
            return <InlineMarkdown key={i} data={c.data} options={options}/>
          } else {
            return <Plain key={i} data={c.data} options={options}/>
          }
        } else {
          if (c.display) {
            return <DisplayMath key={i} data={c.data}/>
          } else {
            return <Math key={i} data={c.data}/>
          }
        }
      })}
    </span>
  )
}

export const Plain = props => {
  return <span>{props.data}</span>
}


export const Text = props => {
  const {
    data, fontFamily, fontSize, color,
    ...otherprops
  } = props
  const opts = defaultsDeep({}, otherprops, defaultOptions)
  const style = {fontFamily, fontSize, color}
  let RenderMethod
  if (opts.markdown === true || opts.markdown === 'full') {
    RenderMethod = Markdown
  } else if (opts.renderMath) {
    RenderMethod = ParseMath
  } else if (opts.markdown === 'inline') {
    RenderMethod = InlineMarkdown
  } else {
    RenderMethod = Plain
  }

  return (
    <span style={style}>
      <RenderMethod data={data} options={opts}/>
    </span>
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

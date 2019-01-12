import React from 'react'
import {
  renderJsonML,
  renderMath,
  renderMarkdown,
  renderText,
  renderVegaLite
} from './index'


export const renderElement = function({data, type='text', options={}}) {
  switch(type) {
    case 'jsonml':
      return renderJsonML(data, options)
    case 'markdown':
      return renderMarkdown(data, options.markdown)
    case 'math':
      return renderMath(data, options.math)
    case 'text':
      return renderText(data, {markdown: options.markdown, math: options.math})
    case 'vega-lite':
      return renderVegaLite(data, options['vega-lite'])
    default:
      console.log(`No render method for type ${type}`)
      return data.toString()
  }
}

export const defaultOptions = {
  list: {
    type: 'a'
  },

  math: {
    render: true,
    delimiters: {
      inline: {left: '$$', right: '$$'},
      display: {left: '$$$', right: '$$$'},
    },
  },

  markdown: {
    render: true,
    superscript: true,
    subscript: true,
    smartarrows: true,
  },

  'vega-lite': {}
}

export const inheritOptions = function(type, options) {
  switch(type) {
    case 'jsonml':
      return options
    case 'list':
      return options
    case 'markdown':
      return options.markdown
    case 'math':
      return options.math
    case 'text':
      return {markdown: options.markdown, math: options.math}
    case 'vega-lite':
      return options['vega-lite']
  }
}
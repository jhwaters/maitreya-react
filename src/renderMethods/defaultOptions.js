export const defaultOptions = {
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

/*
const isObject = function(thing) {
  return (thing && typeof thing === 'object' && !Array.isArray(thing))
}

const deepAssign = function(target, ...updates) {
  if (!updates.length) return target;
  const source = updates.shift()
  if (isObject(target) && isObject(source)) {
    for (const k in source) {
      if (isObject(source[k])) {
        if (!target[k]) Object.assign(target, { [k]: {} });
        deepAssign(target[k], source[k])
      } else {
        Object.assign(target, { [k]: source[k] })
      }
    }
  }
  return deepAssign(target, ...updates)
}

export const setOptions = (...options) => deepAssign({}, defaultOptions, ...options)
*/
import { kebabCase } from 'lodash'

export function setStyle(style) {
  document.documentElement.style.setProperty('--doc-font-family', style.fontFamily)
  document.documentElement.style.setProperty('--doc-font-size', style.fontSize)
  document.documentElement.style.setProperty('--doc-math-font-size', style.mathFontSize)
  document.documentElement.style.setProperty('--doc-math-font-weight', style.mathFontWeight)
  const mathFontFamily = style.mathFontFamily
  if (mathFontFamily === '__MATCH__') {
    document.documentElement.style.setProperty('--doc-math-font-family', 'var(--doc-font-family)')
  } else if (mathFontFamily === '__DEFAULT__') {
    document.documentElement.style.removeProperty('--doc-math-font-family')
  } else {
    document.documentElement.style.setProperty('--doc-math-font-family', mathFontFamily)
  }
  for (const k in style.graph) {
    document.documentElement.style.setProperty(`--vg-${kebabCase(k)}`, style.graph[k])
  }
}
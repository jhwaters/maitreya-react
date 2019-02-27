import WebFont from 'webfontloader'
import { addFontFamily, setUITheme } from './actions/config'
import { kebabCase } from 'lodash'
import initializeDev from './initialize-dev'

function loadFonts(store) {
  WebFont.load({
    custom: {
      families: [
        'cmu_bright',
        'cmu_concrete',
        'cmu_sansserif',
        'cmu_serif',
        'katex_main', 
        'katex_sansserif', 
      ].map(f => `${f}:n4,i4,n7,i7`),
      urls: ['../stylesheets/styles.global.css'],
    },
    /*
    google: {
      families: [
        'IBM Plex Serif:n4,i4,n7,i7', 
        'IBM Plex Sans:n4,i4,n7,i7', 
      ],
    },
    */
    fontactive: (family) => store.dispatch(addFontFamily(family)),
    fontinactive: (family) => console.error(`Could not load font ${family}`),
  })
}

function setCss(store) {
  const state = store.getState()
  document.body.style.setProperty('--doc-font-family', state.style.fontFamily)
  document.body.style.setProperty('--doc-font-size', state.style.fontSize)
  document.body.style.setProperty('--doc-math-font-size', state.style.mathFontSize)
  document.body.style.setProperty('--doc-math-font-weight', state.style.mathFontWeight)
  const mathFontFamily = state.style.mathFontFamily
  if (mathFontFamily !== '__DEFAULT__') {
    document.body.style.setProperty('--doc-math-font-family', mathFontFamily)
  }
  for (const k in state.style.graph) {
    document.body.style.setProperty(`--vg-${kebabCase(k)}`, state.style.graph[k])
  }
  store.dispatch(setUITheme(state.config.uiTheme))
}

export default function intialize(store) {
  loadFonts(store)
  setCss(store)
  //initializeDev(store)
  return store
}
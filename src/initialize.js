import WebFont from 'webfontloader'
import { addFontFamily, setUITheme } from './actions/config'
import { setStyle } from './stylesetter'
import initializeDev from './initialize-dev'

function loadKatexFonts() {
  WebFont.load({
    custom: {
      families: [
        'katex_ams',
        'katex_caligraphic',
        'katex_fraktur',
        'katex_main',
        'katex_math',
        'katex_sansserif',
        'katex_script',
        'katex_size1',
        'katex_size2',
        'katex_size3',
        'katex_size4',
        'katex_typewriter',
      ].map(f => `${f}:n4,i4,n7,i7`),
      urls: ['./stylesheets/styles.global.css']
    },
    fontactive: (family) => console.log(`load font ${family} successful`),
    fontinactive: (family) => console.error(`load font ${family} failed`),
  })
}

function addFonts(store) {
  WebFont.load({
    custom: {
      families: [
        //'cmu_bright',
        //'cmu_concrete',
        'cmu_sansserif',
        'cmu_serif',
        //'katex_main', 
        //'katex_sansserif', 
      ].map(f => `${f}:n4,i4,n7,i7`),
      urls: ['./stylesheets/styles.global.css'],
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

function checkCookie(store) {
  const state = store.getState()
  let themeset = false
  const cookie = document.cookie
  if (cookie) {
    for (const c of cookie.split(';')) {
      const [k, v] = c.split('=')
      if (k === 'ui-theme') {
        store.dispatch(setUITheme(v))
        themeset = true
      }
    }
  }
  if (!themeset) {
    store.dispatch(setUITheme(state.config.uiTheme))
  }
}

export default function intialize(store) {
  loadKatexFonts()
  addFonts(store)
  checkCookie(store)
  setStyle(store.getState().style)
  //initializeDev(store)
  return store
}
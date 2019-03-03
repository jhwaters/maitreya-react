import WebFont from 'webfontloader'
import { addFontFamily, setUITheme } from './actions/config'
import { setStyle } from './stylesetter'
import initializeDev from './initialize-dev'

function loadFonts(store) {
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
  loadFonts(store)
  checkCookie(store)
  setStyle(store.getState().style)
  //initializeDev(store)
  return store
}
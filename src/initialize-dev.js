import { addFontFamily } from './actions/config'

function addFontFamilies(store) {
  for (const f of [
    'ABeeZee',
    //'Alegreya',
    //'Alegreya Sans',
    'Arima Madurai',
    //'BioRhyme',
    //'Cormorant',
    'EB Garamond',
    'Fira Sans',
    //'Gentium Basic',
    //'Handlee',
    'IBM Plex Sans',
    //'IBM Plex Serif',
    //'Inconsolata',
    //'Jura',
    'Lora',
    //'Merriweather',
    //'Neuton',
    'Noticia Text',
    //'Noto Sans',
    //'Noto Serif',
    //'Old Standard TT',
    //'Raleway',
    //'Roboto',
    'Roboto Slab',
    //'Signika',
    //'Source Sans Pro',
    //'Source Serif Pro',
    'Ubuntu',
    //'Zilla Slab',
  ]) {
    store.dispatch(addFontFamily(f))
  }
}

export default function initializeDev(store) {
  addFontFamilies(store)
  return store
}
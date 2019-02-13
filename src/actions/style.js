export const SET_DOCUMENT_FONTFAMILY = 'SET_DOCUMENT_FONTFAMILY'
export const SET_DOCUMENT_FONTSIZE = 'SET_DOCUMENT_FONTSIZE'
export const SET_MATH_FONTSIZE = 'SET_MATH_FONTSIZE'
export const SET_MATH_FONTWEIGHT = 'SET_MATH_FONTWEIGHT'
export const SET_PAGE_MARGIN = 'SET_PAGE_MARGIN'
export const UPDATE_GRAPHSTYLE = 'UPDATE_GRAPHSTYLE'
export const RESET_GRAPHSTYLE = 'RESET_GRAPHSTYLE'

// Document font
export const setDocumentFontFamily = (family) => {
  return ({
    type: SET_DOCUMENT_FONTFAMILY,
    payload: family
  })
}
export const setDocumentFontSize = (size) => {
  return ({
    type: SET_DOCUMENT_FONTSIZE,
    payload: size
  })
}

// Document Math Font
export const setMathFontSize = (size) => {
  return ({
    type: SET_MATH_FONTSIZE,
    payload: size
  })
}
export const setMathFontWeight = (weight) => {
  return ({
    type: SET_MATH_FONTWEIGHT,
    payload: weight
  })
}

// Page Layout
export const setPageMargin = (margins) => ({
  type: SET_PAGE_MARGIN,
  payload: margins
})

// Graph Style
export const updateGraphStyle = (props) => {
  return ({
    type: UPDATE_GRAPHSTYLE,
    payload: props,
  })
}

export const resetGraphStyle = () => ({
  type: RESET_GRAPHSTYLE,
})
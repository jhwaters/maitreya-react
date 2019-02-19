export const SET_DOCUMENT_FONTFAMILY = 'SET_DOCUMENT_FONTFAMILY'
export const SET_DOCUMENT_FONTSIZE = 'SET_DOCUMENT_FONTSIZE'
export const SET_MATH_FONTSIZE = 'SET_MATH_FONTSIZE'
export const SET_MATH_FONTWEIGHT = 'SET_MATH_FONTWEIGHT'
export const SET_MATH_FONTFAMILY = 'SET_MATH_FONTFAMILY'
export const SET_PAGE_MARGIN = 'SET_PAGE_MARGIN'
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE'
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
export const setMathFontFamily = family => {
  return ({
    type: SET_MATH_FONTFAMILY,
    payload: family,
  })
}

// Page Layout
export const setPageSize = size => ({
  type: SET_PAGE_SIZE,
  payload: size,
})
export const setPageMargin = margins => ({
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
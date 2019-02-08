export const ADD_TO_DOCUMENT = 'ADD_TO_DOCUMENT'
export const CLEAR_ALL = 'CLEAR_ALL'
export const REMOVE_LAST = 'REMOVE_LAST'
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT'
export const UPDATE_HEADER = 'UPDATE_HEADER'
export const DELETE_ELEMENT = 'DELETE_ELEMENT'
export const DELETE_HEADER = 'DELETE_HEADER'
export const SET_DOCUMENT_STARTNUMBERING = 'SET_DOCUMENT_STARTNUMBERING'
export const ADD_PAGEBREAK_BEFORE = 'ADD_PAGEBREAK_BEFORE' // need to come up with a better way to do this
export const CLEAR_PAGEBREAKS = 'CLEAR_PAGEBREAKS'

let elemID = 0

// Document content

export const addToDocument = (elem) => ({
  type: ADD_TO_DOCUMENT,
  payload: {element: elem, id: ++elemID}
})

export const clearAll = () => ({
  type: CLEAR_ALL
})

export const removeLast = () => ({
  type: REMOVE_LAST,
})

export const updateElement = (idstr, data) => {
  const [type, id] = idstr.split('.')
  if (type === 'header') {
    return { type: UPDATE_HEADER, payload: {id: +id, data} }
  }
  if (type === 'content') {
    return { type: UPDATE_ELEMENT, payload: {id: +id, data} }
  }
}

export const deleteElement = (idstr) => {
  const [type, id] = idstr.split('.')
  if (type === 'header') {
    return { type: DELETE_HEADER, payload: +id }
  }
  if (type === 'content') {
    return { type: DELETE_ELEMENT, payload: +id }
  }
}

export const deleteHeader = (id) => ({
  type: DELETE_HEADER,
  payload: +id,
})

// Document settings


export const setDocumentStartNumbering = (n) => ({
  type: SET_DOCUMENT_STARTNUMBERING,
  payload: n
})



// Document view

export const addPageBreakBefore = (id) => ({
  type: ADD_PAGEBREAK_BEFORE,
  payload: id
})

export const clearPageBreaks = () => ({
  type: CLEAR_PAGEBREAKS
})



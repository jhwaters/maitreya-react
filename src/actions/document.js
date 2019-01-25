export const ADD_TO_DOCUMENT = 'ADD_TO_DOCUMENT'
export const CLEAR_ALL = 'CLEAR_ALL'
export const REMOVE_LAST = 'REMOVE_LAST'
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT'
export const DELETE_ELEMENT = 'DELETE_ELEMENT'
export const SET_DOCUMENT_STARTNUMBERING = 'SET_DOCUMENT_STARTNUMBERING'
export const ADD_PAGEBREAK_BEFORE = 'ADD_PAGEBREAK_BEFORE' // need to come up with a better way to do this

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

export const updateElement = (id, element) => ({
  type: UPDATE_ELEMENT,
  payload: { id, element }
})

export const deleteElement = (id) => ({
  type: DELETE_ELEMENT,
  payload: id,
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



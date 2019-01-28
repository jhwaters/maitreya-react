import React from 'react'
import { connect } from 'react-redux'
import { updateElement, deleteElement } from '../../actions/document'

import DefaultEditor from './DefaultEditor'
import Header from './Header'
import Question from './Question'



const EditElement = (props) => {
  if (props.element.type === 'header') return <Header {...props} />
  if (props.element.type === 'question') return <Question {...props} />
  return <DefaultEditor {...props} />
}


const mapDispatchToProps = dispatch => ({
  onUpdateElement: (id, elem) => dispatch(updateElement(id, elem)),
  onDeleteElement: (id) => dispatch(deleteElement(id)),
})

export default connect(null, mapDispatchToProps)(EditElement)
import React from 'react'
import DefaultEditor from './DefaultEditor'
import EditPageHeader from './EditPageHeader'
import EditQuestion from './EditQuestion'
import EditText from './EditText'
import { parseJson } from '..'
import { connect } from 'react-redux'
import { updateElement, deleteElement } from '../../actions/document'

const renderTypes = ({
  NumberedQuestion: EditQuestion,
  Question: EditQuestion,
  PageHeader: EditPageHeader,
  Text: EditText,
})

const EditJson = props => {
  const { type } = parseJson(props.json)
  const RenderType = renderTypes[type]
  if (RenderType) {
    return <RenderType {...props}/>
  }
  return <DefaultEditor {...props}/>
}

const mapDispatchToProps = dispatch => ({
  onUpdateElement: (id, elem) => dispatch(updateElement(id, elem)),
  onDeleteElement: (id) => dispatch(deleteElement(id)),
})

export default connect(null, mapDispatchToProps)(EditJson)
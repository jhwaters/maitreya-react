import { connect } from 'react-redux'
import Document from './Document'

const mapStateToProps = state => ({
  questions: state.document.questions,
  order: state.document.order,
  settings: {...state.document.settings},
})

export default connect(mapStateToProps)(Document)

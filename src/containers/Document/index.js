import { connect } from 'react-redux'
import Document from './Document'

const mapState = state => ({
  questions: state.document.questions,
  order: state.document.order,
})

export default connect(mapState)(Document)

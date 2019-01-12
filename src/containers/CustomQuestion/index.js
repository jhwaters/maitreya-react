import { connect } from 'react-redux'
import CustomQuestion from './CustomQuestion'
import {
  addQuestion
} from '../../actions/document'

const mapDispatchToProps = dispatch => ({
  addQuestion: (q) => dispatch(addQuestion(q))
})

export default connect(null, mapDispatchToProps)(CustomQuestion)
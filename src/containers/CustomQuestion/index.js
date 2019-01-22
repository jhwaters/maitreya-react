import { connect } from 'react-redux'
import CustomQuestion from './CustomQuestion'
import {
  addToDocument
} from '../../actions/document'

const mapDispatchToProps = dispatch => ({
  addToDocument: (thing) => dispatch(addToDocument(thing))
})

export default connect(null, mapDispatchToProps)(CustomQuestion)
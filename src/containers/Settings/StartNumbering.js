import React from 'react'
import { connect } from 'react-redux'
import { setDocumentStartNumbering } from '../../actions/document'

class StartNumbering extends React.Component {

  setCSSVariable(n) {
    document.body.style.setProperty('--doc-startnumber', n-1)
  }

  setNumbering = evt => {
    const startat = evt.target.value
    if (startat) {
      this.setCSSVariable(startat)
      this.props.setDocumentStartNumbering(startat)
    }
  }

  render() {
    return (
      <input 
        onChange={this.setNumbering}
        type='number' 
        min='1'
        value={this.props.current}
      />
    )
  }
}

const mapStateToProps = state => ({
  current: state.document.startNumbering,
})
const mapDispatchToProps = dispatch => ({
  setDocumentStartNumbering: (n) => dispatch(setDocumentStartNumbering(n)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartNumbering)
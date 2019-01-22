import React from 'react'
import { connect } from 'react-redux'
import { setDocumentStartNumbering } from '../../actions/document'

class StartNumbering extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  setCSSVariable(n) {
    document.body.style.setProperty('--doc-startnumber', n-1)
  }

  setNumbering = () => {
    const startat = this.input.current.value
    if (startat) {
      this.setCSSVariable(startat)
      this.props.setDocumentStartNumbering(startat)
    }
  }

  render() {
    if (this.props.applyButton) {
      return (
        <>
          <input 
            type='number' 
            min='1' 
            ref={this.input} 
            style={{width: '2rem'}}></input>
          <button onClick={this.setNumbering}>Apply</button>
        </>
      )
    } else {
      return (
        <>
          <input 
            onChange={this.setNumbering}
            type='number' 
            defaultValue='1'
            min='1' 
            ref={this.input} 
            style={{width: '2rem'}}></input>
        </>
      )
    }
  }
}


const mapDispatchToProps = dispatch => ({
  setDocumentStartNumbering: (n) => dispatch(setDocumentStartNumbering(n)),
})

export default connect(null, mapDispatchToProps)(StartNumbering)
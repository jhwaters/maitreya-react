import React from 'react'
import { connect } from 'react-redux'

class CheckStateButton extends React.Component {

  logState = () => {console.log(this.props.state)}

  render() {
    return <button onClick={this.logState}>{this.props.children}</button>
  }
}

const mapStateToProps = state => ({
  state: state,
})

export default connect(mapStateToProps)(CheckStateButton)
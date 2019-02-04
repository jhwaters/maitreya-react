import React from 'react'
import { connect } from 'react-redux'

function setCss(k, v) {
  document.body.style.setProperty(k, v)
}

class CssSetter extends React.Component {
  
}

const mapStateToProps = state => ({
  style: state.style
})

export default connect(mapStateToProps)(CssSetter)
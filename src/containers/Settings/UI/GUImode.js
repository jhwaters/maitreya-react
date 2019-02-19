import React from 'react'
import { connect } from 'react-redux'
import { setDebugView } from '../../../actions/config'

class GUImode extends React.Component {

  update = evt => {
    const debugView = evt.target.checked
    if (debugView !== this.props.debugView) {
      this.props.setDebugView(debugView)
    }
  }

  render() {
    return (
      <div style={{fontSize: '0.8em'}}>
      <div>
        <input id="layout-on-hover-checkbox"
          type="checkbox"
          checked={this.props.debugView}
          onChange={this.update}/>
        <label htmlFor="layout-on-hover-checkbox">
          Layout on Hover
        </label>
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  debugView: state.config.debugView,
})
const mapDispatchToProps = dispatch => ({
  setDebugView: b => dispatch(setDebugView(b)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GUImode)
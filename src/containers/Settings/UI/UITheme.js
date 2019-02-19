import React from 'react'
import { connect } from 'react-redux'
import { setUITheme } from '../../../actions/config'

class UIThemeSetter extends React.Component {

  setTheme = evt => {
    const theme = evt.target.value
    this.props.setUITheme(theme)
  }

  render() {
    return (
      <select value={this.props.theme}
        onChange={this.setTheme}
      >
        <option value="none">None</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.config.uiTheme,
})

const mapDispatchToProps = dispatch => ({
  setUITheme: theme => dispatch(setUITheme(theme)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UIThemeSetter)
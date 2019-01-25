import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateGraphStyle } from '../../../actions/style'

class GraphStyle extends React.Component {
  static propTypes = {
    updateGraphStyle: PropTypes.func.isRequired,
    propertyName: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
    cssName: PropTypes.string.isRequired,
  }

  setCss(value) {
    document.body.style.setProperty(this.props.cssName, value)
  }

  setValue(value) {
    this.setCss(value)
    this.props.updateGraphStyle({[this.props.propertyName]: value})
  }

  onChange = (evt) => {
    this.setValue(evt.target.value)
  }

}

class GraphStyleColor extends GraphStyle {
  render() {
    return (
      <input type='color'
        value={this.props.current}
        onChange={this.onChange}
      />
    )
  }
}

class GraphStyleWidth extends GraphStyle {
  onChange = (evt) => {
    this.setValue(evt.target.value + 'mm')
  }
  render() {
    return (
      <input type='range'
        value={this.props.current.slice(0,-2)}
        onChange={this.onChange}
        min='0'
        max='1'
        step='0.01'
      />
    )
  }
}

class PathColor_ extends GraphStyleColor {
  static defaultProps = {
    propertyName: 'pathColor',
    cssName: '--plot-path-color',
  }
}
class AsymptoteColor_ extends GraphStyleColor {
  static defaultProps = {
    propertyName: 'asymptoteColor',
    cssName: '--plot-asymptote-color',
  }
}
class AxisColor_ extends GraphStyleColor {
  static defaultProps = {
    propertyName: 'axisColor',
    cssName: '--plot-axis-color',
  }
}
class GridColor_ extends GraphStyleColor {
  static defaultProps = {
    propertyName: 'gridColor',
    cssName: '--plot-grid-color',
  }
}
class PathWidth_ extends GraphStyleWidth {
  static defaultProps = {
    propertyName: 'pathWidth',
    cssName: '--plot-path-width',
  }
}
class AxisWidth_ extends GraphStyleWidth {
  static defaultProps = {
    propertyName: 'axisWidth',
    cssName: '--plot-axis-width',
  }
}
class GridWidth_ extends GraphStyleWidth {
  static defaultProps = {
    propertyName: 'gridWidth', 
    cssName: '--plot-grid-width',
  }
}

function stateMap(propertyName) {
  return state => ({current: state.style.graph[propertyName]})
}

const mapDispatchToProps = dispatch => ({
  updateGraphStyle: (props) => dispatch(updateGraphStyle(props))
})

export const PathColor = connect(stateMap('pathColor'), mapDispatchToProps)(PathColor_)
export const AsymptoteColor = connect(stateMap('asymptoteColor'), mapDispatchToProps)(AsymptoteColor_)
export const AxisColor = connect(stateMap('axisColor'), mapDispatchToProps)(AxisColor_)
export const GridColor = connect(stateMap('gridColor'), mapDispatchToProps)(GridColor_)
export const PathWidth = connect(stateMap('pathWidth'), mapDispatchToProps)(PathWidth_)
export const AxisWidth = connect(stateMap('axisWidth'), mapDispatchToProps)(AxisWidth_)
export const GridWidth = connect(stateMap('gridWidth'), mapDispatchToProps)(GridWidth_)
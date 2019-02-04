import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { kebabCase } from 'lodash'
import { updateGraphStyle } from '../../../actions/style'

function setCss(k, v) {
  document.body.style.setProperty(k, v)
}

class GraphStyle extends React.Component {
  static propTypes = {
    updateGraphStyle: PropTypes.func.isRequired,
    propertyName: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.cssName = `--vg-${kebabCase(props.propertyName)}`
  }

  componentDidMount() {
    setCss(this.cssName, this.props.current)
  }

  componentDidUpdate() {
    setCss(this.cssName, this.props.current)
  }

  setValue(value) {
    this.props.updateGraphStyle({[this.props.propertyName]: value})
  }

  onChange = (evt) => {
    this.setValue(evt.target.value)
  }

}

class Color extends GraphStyle {
  render() {
    return (
      <input type='color'
        value={this.props.current}
        onChange={this.onChange}
      />
    )
  }
}

class Width extends GraphStyle {
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

class Opacity extends GraphStyle {
  render() {
    return (
      <input type='range'
        value={this.props.current}
        onChange={this.onChange}
        min='0'
        max='1'
        step='0.01'
      />
    )
  }
}


const mapDispatchToProps = dispatch => ({
  updateGraphStyle: (props) => dispatch(updateGraphStyle(props))
})

function createComponent(base, propertyName) {
  class StyleSettingComponent extends base {
    static defaultProps = ({propertyName: propertyName})
  }
  
  return connect(
    state => ({current: state.style.graph[propertyName]}), 
    mapDispatchToProps
  )(StyleSettingComponent)
}


export const Plot1PathColor = createComponent(Color, 'plot1PathColor')
export const PlotPathWidth = createComponent(Width, 'plotPathWidth')
export const Plot2PathColor = createComponent(Color, 'plot2PathColor')
export const GeomPathColor = createComponent(Color, 'geomPathColor')
export const GeomPathWidth = createComponent(Width, 'geomPathWidth')
export const AsymptoteColor = createComponent(Color, 'asymptoteColor')
export const AsymptoteWidth = createComponent(Width, 'asymptoteWidth')
export const AxisColor = createComponent(Color, 'axisColor')
export const AxisWidth = createComponent(Width, 'axisWidth')
export const GridColor = createComponent(Color, 'gridColor')
export const GridWidth = createComponent(Width, 'gridWidth')
export const FillOpacity = createComponent(Opacity, 'fillOpacity')




class SwapButton extends React.Component {
  static propTypes = {
    current1: PropTypes.string.isRequired,
    current2: PropTypes.string.isRequired,
    propertyName1: PropTypes.string.isRequired,
    propertyName2: PropTypes.string.isRequired,
    updateGraphStyle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.cssName1 = `--vg-${kebabCase(props.propertyName1)}`
    this.cssName2 = `--vg-${kebabCase(props.propertyName2)}`
  }

  doSwap = () => {
    setCss(this.cssName1, this.current2)
    setCss(this.cssName2, this.current1)
    this.props.updateGraphStyle({
      [this.props.propertyName1]: this.props.current2,
      [this.props.propertyName2]: this.props.current1,
    })
  }

  render() {
    return (
      <button onClick={this.doSwap}>{this.props.children}</button>
    )
  }
}

export const PlotColorSwap = connect(
  state => ({
    current1: state.style.graph.plot1PathColor, 
    current2: state.style.graph.plot2PathColor,
    propertyName1: 'plot1PathColor',
    propertyName2: 'plot2PathColor'
  }),
  dispatch => ({
    updateGraphStyle: updates => dispatch(updateGraphStyle(updates)),
  })
)(SwapButton)
import React from 'react'
import { connect } from 'react-redux'
import { setPageMargin } from '../../../actions/style'


function unitProps(units) {
  if (units === 'in') return {max: 1.5, step: 0.01}
  if (units === 'cm') return {max: 3.5, step: 0.01}
  if (units === 'mm') return {max: 35, step: 0.1}
}

function inputProps(units) {
  return Object.assign({
    min: 0, 
    style: {minWidth: '5em'}, 
  }, unitProps(units))
}

function fromMM(value, units) {
  if (units === 'cm') return value / 10
  if (units === 'in') return value / 25.4
  if (units === 'mm') return value
}

function toMM(value, units) {
  if (units === 'cm') return value * 10
  if (units === 'in') return value * 25.4
  if (units === 'mm') return value
}

function convert(value, from, to) {
  if (from === to) return value
  return fromMM(toMM(value, from), to)
}

function convertStr(s, to) {
  const units = s.slice(-2)
  return convert(parseFloat(s), units, to)
}


class PageMargins extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...this.props}
  }

  setMargins = (m={}) => {
    const {top, right, bottom, left, units} = {...this.state, ...m}
    const pageMargin = [top+units, right+units, bottom+units, left+units].join(' ')
    this.props.setPageMargin(pageMargin)
    this.setState({top, right, bottom, left, units})
  }
  setUnits = evt => {
    const from = this.state.units
    const units = evt.target.value
    const newValues = {}
    for (const m of ['top', 'right', 'bottom', 'left']) {
      const v = parseFloat(this.state[m])
      const rounder = units === 'mm' ? 10 : 100
      newValues[m] = Math.round(rounder * convert(v, from, units)) / rounder
    }
    this.setState({units, ...newValues})
  }
  setTop = evt => {
    const top = evt.target.value
    this.setMargins({top})
  }
  setRight = evt => {
    const right = evt.target.value
    this.setMargins({right})
  }
  setBottom = evt => {
    const bottom = evt.target.value
    this.setMargins({bottom})
  }
  setLeft = evt => {
    const left = evt.target.value
    this.setMargins({left})
  }

  render() {
    return (
      <>
      <span>Units: </span>
      <select value={this.state.units} onChange={this.setUnits}>
        <option value="mm">millimeters</option>
        <option value="cm">centimeters</option>
        <option value="in">inches</option>
      </select>
      <table>
        <tbody>
          <tr>
            <td/>
            <td>
              Top
              <br/>
              <input type="number" 
                value={this.state.top} 
                onChange={this.setTop} 
                {...inputProps(this.state.units)}
              />
              </td>
            <td/>
          </tr>
          <tr>
            <td>
              Left
              <br/>
              <input type="number" 
                value={this.state.left} 
                onChange={this.setLeft}
                {...inputProps(this.state.units)}
              />
            </td>
            <td/>
            <td>
              Right
              <br/>
              <input type="number" 
                value={this.state.right} 
                onChange={this.setRight}
                {...inputProps(this.state.units)}
              />
            </td>
          </tr>
          <tr>
            <td/>
            <td>
              Bottom
              <br/>
              <input type="number" 
                value={this.state.bottom} 
                onChange={this.setBottom}
                {...inputProps(this.state.units)}
              />
            </td>
            <td/>
          </tr>
        </tbody>
      </table>
      </>
    )
  }
}

const mapStateToProps = state => {
  const margins = state.style.pageMargin.split(' ')
  let top, right, bottom, left
  if (margins.length === 1) {
    top = margins[0]
    right = top
    bottom = top
    left = top
  } else if (margins.length === 2) {
    [top, right] = margins
    bottom = top
    left = right
  } else {
    [top, right, bottom, left] = margins
  }
  const units = left.slice(-2)

  return {
    top: +convertStr(top, units),
    right: +convertStr(right, units),
    bottom: +convertStr(bottom, units),
    left: +convertStr(left, units),
    units,
  }
}
const mapDispatchToProps = dispatch => ({setPageMargin: m => dispatch(setPageMargin(m))})

export default connect(mapStateToProps, mapDispatchToProps)(PageMargins)
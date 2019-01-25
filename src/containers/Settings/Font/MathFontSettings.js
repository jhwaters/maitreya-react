import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setMathFontSize, setMathFontWeight } from '../../../actions/style'

class MathFontSettings extends React.Component {
  static propTypes = {
    currentSize: PropTypes.string,
    currentWeight: PropTypes.string,
    setMathFontSize: PropTypes.func.isRequired,
    setMathFontWeight: PropTypes.func.isRequired,
  }

  setSizeCss(size) {
    document.body.style.setProperty('--doc-math-font-size', size)
  }

  setWeightCss(weight) {
    document.body.style.setProperty('--doc-math-font-weight', weight)
  }

  setSize(size) {
    this.setSizeCss(size)
    this.props.setMathFontSize(size)
  }

  setWeight(weight) {
    this.setWeightCss(weight)
    this.props.setMathFontWeight(weight)
  }

  onChangeSize = (evt) => {
    this.setSize(evt.target.value)
  }

  onChangeWeight = (evt) => {
    if (evt.target.checked) {
      this.setWeight('bold')
    } else {
      this.setWeight('normal')
    }
  }

  render() {
    return (
      <>
        Relative Size:
        <select
          onChange={this.onChangeSize}
          value={this.props.currentSize}
        >
          <option value='0.6em'>0.6</option>
          <option value='0.7em'>0.7</option>
          <option value='0.8em'>0.8</option>
          <option value='0.9em'>0.9 (default)</option>
          <option value='1em'>1.0</option>
          <option value='1.1em'>1.1</option>
          <option value='1.2em'>1.2</option>
          <option value='1.3em'>1.3</option>
          <option value='1.4em'>1.4</option>
        </select>
        Bold:
        <input ref={this.bold} 
          onChange={this.onChangeWeight}
          type="checkbox"
          checked={this.props.currentWeight === 'bold'}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentSize: state.style.mathFontSize,
  currentWeight: state.style.mathFontWeight,
})

const mapDispatchToProps = dispatch => ({
  setMathFontSize: (size) => dispatch(setMathFontSize(size)),
  setMathFontWeight: (weight) => dispatch(setMathFontWeight(weight)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MathFontSettings)
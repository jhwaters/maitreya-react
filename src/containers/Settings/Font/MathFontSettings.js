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

  setSize(size) {
    this.props.setMathFontSize(size)
  }

  setWeight(weight) {
    this.props.setMathFontWeight(weight)
  }

  onChangeSize = (evt) => {
    this.setSize(evt.target.value + 'em')
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
        <span>Relative Size:</span>
        <input
          type="number"
          onChange={this.onChangeSize}
          value={this.props.currentSize.slice(0,-2)}
          min="0.7"
          max="2.0"
          step="0.1"/>
        <br/>
        <label for="math-font-bold">Bold:</label>
        <input id="math-font-bold"
          ref={this.bold} 
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
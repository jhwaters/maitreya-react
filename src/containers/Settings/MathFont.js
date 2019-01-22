import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setMathFontSize, setMathFontWeight } from '../../actions/document'

class MathFontSettings extends React.Component {
  static propTypes = {
    defaultSize: PropTypes.string,
    defaultWeight: PropTypes.string,
    setMathFontSize: PropTypes.func.isRequired,
    setMathFontWeight: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.size = React.createRef()
    this.bold = React.createRef()
  }

  setSizeCSS(size) {
    document.body.style.setProperty('--doc-math-font-size', size)
  }

  setWeightCSS(weight) {
    document.body.style.setProperty('--doc-math-font-weight', weight)
  }

  setSize(size) {
    this.setSizeCSS(size)
    this.props.setMathFontSize(size)
  }

  setWeight(weight) {
    this.setWeightCSS(weight)
    this.props.setMathFontWeight(weight)
  }

  updateSize = () => {
    const s = this.size.current.value
    this.setSize(s)
  }

  updateWeight = () => {
    if (this.bold.current.checked) {
      this.setWeight('bold')
    } else {
      this.setWeight('normal')
    }
  }

  render() {
    return (
      <>
        Relative Size:
        <select ref={this.size} 
          onChange={this.updateSize}
          defaultValue={this.props.defaultSize}
        >
          <option value='0.6em'>0.6</option>
          <option value='0.7em'>0.7</option>
          <option value='0.8em'>0.8</option>
          <option value='0.9em'>0.9 (default)</option>
          <option value='1em'>1.0</option>
          <option value='1.1em'>1.1</option>
          <option value='1.2em'>1.2</option>
        </select>
        Bold:
        <input ref={this.bold} 
          onChange={this.updateWeight}
          type="checkbox"
          defaultChecked={this.props.defaultWeight === 'bold'}
        />
      </>
    )
  }

}

const mapStateToProps = state => ({
  defaultSize: state.document.settings.mathFontSize,
  defaultWeight: state.document.settings.mathFontWeight,
})

const mapDispatchToProps = dispatch => ({
  setMathFontSize: (size) => dispatch(setMathFontSize(size)),
  setMathFontWeight: (weight) => dispatch(setMathFontWeight(weight)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MathFontSettings)
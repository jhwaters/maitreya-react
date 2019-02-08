import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontSize } from '../../../actions/style'


class FontSizeSelect extends React.Component {

  static propTypes = {
    current: PropTypes.string.isRequired,
    setDocumentFontSize: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  setDocFontSize(size) {
    this.props.setDocumentFontSize(size)
  }

  onChange = (evt) => {
    this.setDocFontSize(evt.target.value)
  }  

  renderSizeOptions() {
    const options = [6, 7, 8, 9, 10, 11, 12]
    return (
      <>
      {options.map((s) => {
        const size = `${s}pt`
        return (
          <option 
            value={size}
            key={s}
          >{size}</option>
        )
      })}
      </>
    )
  }

  render() {
    return (
      <>
        <select 
          value={this.props.current}
          onChange={this.onChange}
        >
          {this.renderSizeOptions()}
        </select>
      </>
    )
  }
}


const mapStateToProps = state => ({
  current: state.style.fontSize,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontSize: (size) => dispatch(setDocumentFontSize(size)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSizeSelect)
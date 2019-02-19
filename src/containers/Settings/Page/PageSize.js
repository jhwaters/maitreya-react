import React from 'react'
import { connect } from 'react-redux'
import { setPageSize } from '../../../actions/style'

class PageSize extends React.Component {

  setPageSize = evt => {
    const pageSize = evt.target.value
    this.props.setPageSize(pageSize)
  }

  render() {
    return (
      <select
        value={this.props.current}
        onChange={this.setPageSize}
      >
      {['A3', 'A4', 'A5', 'legal', 'letter'].map(p => (
        <option key={p} value={p}>{p}</option>
      ))}
      </select>
    )
  }
}

const mapStateToProps = state => ({current: state.style.pageSize})
const mapDispatchToProps = dispatch => ({setPageSize: size => dispatch(setPageSize(size))})

export default connect(mapStateToProps, mapDispatchToProps)(PageSize)
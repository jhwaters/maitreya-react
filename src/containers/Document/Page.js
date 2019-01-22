import React from 'react'
import { connect } from 'react-redux'
import { portrait, landscape } from './pagesize'


class Page extends React.Component {

  getPageSize()  {
    if (this.props.orientation === 'landscape') {
      return landscape[this.props.size]
    } else {
      return portrait[this.props.size]
    }
  }

  getOuterStyle() {
    const {width, height} = this.getPageSize()
    return {
      width: `${width}mm`, 
      height: `${height}mm`,
      padding: '0',
    }
  }

  getInnerStyle() {
    return {
      margin: '0',
      width: '100%',
      height: '100%',
      paddingTop: this.props.margins.top,
      paddingLeft: this.props.margins.left,
      paddingRight: this.props.margins.right,
      paddingBottom: this.props.margins.bottom,
    }
  }

  render() {
    return (
      <div className='page-outer' style={this.getOuterStyle()}>
        <div className='page-inner' style={this.getInnerStyle()}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  size: state.document.settings.pageSize,
  orientation: state.document.settings.pageOrientation,
  margins: state.document.settings.pageMargins,
})

export default connect(mapStateToProps)(Page)
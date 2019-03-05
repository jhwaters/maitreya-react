import React from 'react'
import { connect } from 'react-redux'
import { portrait, landscape } from './pagesize'

const Page = props => {
  const {width, height} = props.orientation === 'landscape'
    ? landscape[props.size]
    : portrait[props.size]
  const outerStyle = {
    width: `${width}mm`, 
    height: `${height}mm`,
    padding: '0',
  }
  const innerStyle = {
    margin: '0',
    height: 'fit-content',
    padding: props.margin,
  }

  return (
    <div className='page-outer' style={outerStyle}>
      <div className='page-inner' style={innerStyle}>
        {props.children}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  size: state.style.pageSize,
  orientation: state.style.pageOrientation,
  margin: state.style.pageMargin,
})

export default connect(mapStateToProps)(Page)
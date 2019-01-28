import React from 'react'
//import Page from './Page'
import MeasuredPage from './MeasuredPage'
import AnswerKey from './AnswerKey'
import { connect } from 'react-redux'
import { MarkerDefs } from '../../renderMethods/primaryTypes/VG'


import Scratch from './scratchpage'


const Document = (props) => {
  const len = props.contentIDs.length
  let prev = 0
  let slices = []
  for (const i of props.pagebreaks) {
    if (i < len) {
      slices.push([prev, i])
      prev = i
    }
  }
  slices.push([prev])
  const pages = slices.map(s => props.contentIDs.slice(...s))

  return (
    <div className='document'>
      <svg height='0' width='0'>
        <defs>
          <MarkerDefs />
        </defs>
      </svg>
      {(
        pages.length > 0 
        ? pages.map((ids,i) => (
          <MeasuredPage key={`page-${i+1}`} 
            pageNumber={i+1}
            contentIDs={ids}
          />
        )) : null
      )}
      {props.showAnswerKey ? <AnswerKey /> : null}
    </div>
  )
}

const mapStateToProps = state => ({
  contentIDs: state.document.order,
  pagebreaks: state.document.pagebreaks,
  showAnswerKey: state.config.showAnswerKey,
  style: state.style,
})

export default connect(mapStateToProps)(Document)
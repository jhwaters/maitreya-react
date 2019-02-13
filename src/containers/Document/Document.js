import React from 'react'
//import Page from './Page'
import MeasuredPage from './MeasuredPage'
import AnswerKey from './AnswerKey'
import { connect } from 'react-redux'


import Scratch from './scratchpage'


const Document = (props) => {
  const len = props.contentIDs.length - props.hidden
  const visibleIDs = props.contentIDs.slice(0,len)
  let prev = 0
  let slices = []
  for (const i of props.pagebreaks) {
    if (i < len) {
      slices.push([prev, i])
      prev = i
    }
  }
  slices.push([prev])
  const pages = slices.map(s => visibleIDs.slice(...s))
  const className = props.debugView ? 'document debug-view' : 'document'

  //return <div className={className}><Scratch/></div>

  return (
    <div className={className}>
      {(
        pages.length > 0 
        ? pages.map((ids,i) => (
          <MeasuredPage key={`page-${i+1}`} 
            pageNumber={i+1}
            contentIDs={ids.map(i => `content.${i}`)}
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
  hidden: state.config.numberHidden,
  debugView: state.config.debugView,
})

export default connect(mapStateToProps)(Document)
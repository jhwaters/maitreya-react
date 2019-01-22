import React from 'react'
import { connect } from 'react-redux'
import Page from './Page'
import { RenderElement } from '../../renderMethods'


const AnswerKey = (props) => {
  return (
    <Page>
      <h3>Answer Key</h3>
      <div className='answerkey'>
        {props.contentIDs.map(id => {
          const element = props.content[id]
          if (element.type === 'question') {
            return (
              <div key={`answer-${id}`} className='answerkey-item'>
                <RenderElement content={{...element, type: 'answer'}} />
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    </Page>
  )
}

const mapStateToProps = state => ({
  contentIDs: state.document.order,
  content: state.document.content
})

export default connect(mapStateToProps)(AnswerKey)
import React from 'react'
import { connect } from 'react-redux'
import Page from './Page'
import { Answer } from '../../renderMethods/secondaryTypes/Question'


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
                <Answer data={element.data} options={element.options} />
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
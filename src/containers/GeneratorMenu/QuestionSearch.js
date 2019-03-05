import React from 'react'
import { connect } from 'react-redux'
import questionbank from './questionbank'
import { includes } from 'lodash'
import styles from './styles.module.css'
import { addToDocument } from '../../actions/document'

function hasKwd(item, kwd) {
  for (const v of [...item.name.split(' '), ...(item.tags || [])].map(t => t.toLowerCase())) {
    if (includes(v, kwd.replace(',', ''))) {
      return true
    }
  }
  return false
}

function checkForKwds(item, kwds=[]) {
  for (const k of kwds.map(k => k.toLowerCase())) {
    if (!hasKwd(item, k)) {
      return false
    }
  }
  // item contains all keywords
  return true
}

function sortByName(a, b) {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}


class QuestionSearch extends React.Component {
  static defaultProps = {
    questionTypes: questionbank
  }

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      kwds: [],
      selection: null
    }
  }

  clearSearch = () => {
    this.setState({ input: '', kwds: [], selection: null})
  }

  updateSearch = evt => {
    const input = evt.target.value
    const kwds = input.split(' ').map(k => k.toLowerCase())
    this.setState({ input, kwds, selection: null })
  }

  setSelection(id) {
    this.setState({selection: id})
  }

  generateAndAdd = () => {
    const questionType = this.state.selection
    if (questionType) {
      console.log(`Generating ${questionType}`)
      try {
        const qtype = this.props.questionTypes[questionType].generator
        const question = new qtype()
        this.props.addToDocument(question.output())
      } catch(e) {
        console.log('failed')
        console.log(e)
      }
    }
  }

  renderResults() {
    //const qtypes = Object.keys(this.props.questionTypes).map(k => ({
    //  id: k, ...this.props.questionTypes[k].register()
    //})).sort(sortByID)
    const results = (
      Object.keys(this.props.questionTypes)
        .map(k => ({id: k, ...this.props.questionTypes[k]}))
        .filter(q => checkForKwds(q, this.state.kwds))
        .sort(sortByName)
    )
    const className = styles.ResultContainer + ' ui-input'
    if (results.length) {
      return (
        <div className={className}>
          {results.map(r => (
            <div key={r.id} 
              className={styles.SearchResult + (r.id === this.state.selection ? ' ' + styles.Selected : '')}
              onClick={() => this.setSelection(r.id)}
              onDoubleClick={this.generateAndAdd}
              title={r.description}
            >
              {r.name}
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className={className}>
          <span className={styles.SearchResultNone + ' ' + styles.SearchResult}>No results</span>
        </div>
      )
    }
  }

  render() {
    return (
      <>
        <input type="search"
          onChange={this.updateSearch}
          value={this.state.input}
          onDoubleClick={this.clearSearch}
          placeholder="filter"
        />
        {this.renderResults()}
        <button onClick={this.generateAndAdd}>Add</button>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addToDocument: q => dispatch(addToDocument(q))
})


export default connect(null, mapDispatchToProps)(QuestionSearch)
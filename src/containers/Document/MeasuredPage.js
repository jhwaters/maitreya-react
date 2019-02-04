import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addPageBreakBefore } from '../../actions/document'
import TopLevelElement from './TopLevelElement'
import { portrait, landscape } from './pagesize'



class MeasuredPage extends React.Component {
  static propTypes = {
    headerID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    footerID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contentIDs: PropTypes.array.isRequired,
    content: PropTypes.object.isRequired,
    pageSize: PropTypes.string.isRequired,
    pageOrientation: PropTypes.string.isRequired,
    pageMargin: PropTypes.string.isRequired,
    addPageBreakBefore: PropTypes.func.isRequired,
    pageNumber: PropTypes.number,
  }

  static defaultProps = {
    contentIDs: [],
    pageSize: 'letter',
    pageOrientation: 'portrait',
    pageMargin: '10mm 10mm 10mm 10mm',
  }

  constructor(props) {
    super(props)
    this.inner = React.createRef()
    this.outer = React.createRef()
    this.state = {overflows: false}
  }

  innerH = () => this.inner.current.clientHeight
  outerH = () => this.outer.current.clientHeight
  overflows = () => this.innerH() > this.outerH()

  componentDidUpdate() {
    const oldstate = this.state.overflows
    const newstate = this.overflows()
    if (oldstate !== newstate) {
      if (newstate) {
        this.onOverflow()
      }
      this.setState({overflows: newstate})
      this.forceUpdate()
    }
  }

  onOverflow() {
    this.props.addPageBreakBefore(+this.props.contentIDs[this.props.contentIDs.length-1].split('.')[1])
  }

  getPageSize()  {
    if (this.props.pageOrientation === 'landscape') {
      return landscape[this.props.pageSize]
    } else {
      return portrait[this.props.pageSize]
    }
  }

  getOuterStyle() {
    const {width, height} = this.getPageSize()
    return {width: `${width}mm`, height: `${height}mm`}
  }

  getInnerStyle() {
    return {
      height: 'fit-content',
      margin: '0',
      padding: this.props.pageMargin,
    }
  }

  getHeaderID() {
    if (this.props.pageNumber in this.props.headers) {
      return this.props.pageNumber
    }
    return 0
  }

  render() {
    let outerclassname = (
      this.state.overflows 
      ? 'page-outer page-overflowing' 
      : 'page-outer'
    )

    const outerstyle = this.getOuterStyle()
    const innerstyle = this.getInnerStyle()
    const headerID = this.getHeaderID()

    return (
      <div className={outerclassname} ref={this.outer} style={outerstyle}>
        <div className='page-inner' ref={this.inner} style={innerstyle}>
          <TopLevelElement key={headerID}
            id={`header.${headerID}`}
            json={this.props.headers[headerID]}
          />
          <div className='page-content'>
            {this.props.contentIDs.map((id) => {
              const contentID = id.split('.')[1]
              const json = this.props.content[+contentID]
              return (
                <TopLevelElement key={id}
                  json={json}
                  id={id}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  headers: state.document.headers,
  footers: state.document.footers,
  content: state.document.content,
  pageSize: state.style.pageSize,
  pageOrientation: state.style.pageOrientation,
  pageMargin: state.style.pageMargin,
})

const mapDispatchToProps = dispatch => ({
  addPageBreakBefore: (id) => dispatch(addPageBreakBefore(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredPage)
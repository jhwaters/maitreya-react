import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addPageBreakBefore } from '../../actions/document'
import TopLevelElement from './TopLevelElement'
import { portrait, landscape } from './pagesize'



class MeasuredPage extends React.Component {
  static propTypes = {
    headerID: PropTypes.string,
    footerID: PropTypes.string,
    contentIDs: PropTypes.array.isRequired,
    content: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    orientation: PropTypes.string.isRequired,
    margins: PropTypes.object.isRequired,
    addPageBreakBefore: PropTypes.func.isRequired,
  }

  static defaultProps = {
    contentIDs: [],
    size: 'letter',
    orientation: 'portrait',
    margins: {
      left: '10mm', right: '10mm',
      top: '10mm', bottom: '10mm',
    }
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
    this.props.addPageBreakBefore(this.props.contentIDs[this.props.contentIDs.length-1])
  }

  getPageSize()  {
    if (this.props.orientation === 'landscape') {
      return landscape[this.props.size]
    } else {
      return portrait[this.props.size]
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
      paddingTop: this.props.margins.top,
      paddingLeft: this.props.margins.left,
      paddingRight: this.props.margins.right,
      paddingBottom: this.props.margins.bottom,
    }
  }

  render() {
    let outerclassname = (
      this.state.overflows 
      ? 'page-outer page-overflowing' 
      : 'page-outer'
    )

    const outerstyle = this.getOuterStyle()
    const innerstyle = this.getInnerStyle()
    return (
      <div className={outerclassname} ref={this.outer} style={outerstyle}>
        <div className='page-inner' ref={this.inner} style={innerstyle}>
          {this.props.headerID 
            ? (
              <TopLevelElement key={`header-${this.props.headerID}`}
                id={`header.${this.props.headerID}`}
                element={this.props.headers[this.props.headerID]}
              />
            ) : null
          }
          {this.props.contentIDs.map((id) => (
            <TopLevelElement key={`contentElement-${id}`}
              element={this.props.content[id]}
              id={id}
            />
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  headers: state.document.headers,
  footers: state.document.footers,
  content: state.document.content,
  size: state.document.settings.pageSize,
  orientation: state.document.settings.pageOrientation,
  margins: state.document.settings.pageMargins,
})

const mapDispatchToProps = dispatch => ({
  addPageBreakBefore: (id) => dispatch(addPageBreakBefore(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredPage)
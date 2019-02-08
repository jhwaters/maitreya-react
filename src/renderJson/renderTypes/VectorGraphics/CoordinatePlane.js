import React from 'react'
import { Clip, Style, Grid, Path } from '.'
import { MarkerSymbols } from './react-svgplot/Style'

function parseSpan(span) {
  if (Array.isArray(span)) {
    const [x1, y1, x2, y2] = span
    return {x1: +x1, y1: +y1, x2: +x2, y2: +y2}
  }
  if (typeof span === 'string') {
    const s1 = span.split(' ')
    if (s1.length === 1) {
      const [x1, y1, x2, y2] = s1[0].split(',')
      return {x1: +x1, y1: +y1, x2: +x2, y2: +y2}
    }
    if (s1.length === 2) {
      const [x1, y1] = s1[0].split(',')
      const [x2, y2] = s1[1].split(',')
      return {x1: +x1, y1: +y1, x2: +x2, y2: +y2}
    } else if (s1.length === 4) {
      const [x1, y1, x2, y2] = s1
      return {x1: +x1, y1: +y1, x2: +x2, y2: +y2}
    }
  }
  return null
}

export default class CoordinatePlane extends React.Component {
  static defaultProps = {
    style: 'primary function',
    clip: true,
  }

  constructor(props) {
    super(props)
    const span = parseSpan(props.span)
    this.state = { span }
    this.svgref = React.createRef()
  }

  checkSize() {
    const {a, b, c, d} = this.svgref.current.getScreenCTM().inverse()
    const xmargin = 10*Math.abs(a + c)
    const ymargin = 10*Math.abs(d + b)
    this.setState({xmargin, ymargin})
  }

  componentDidMount() {
    this.checkSize()
  }

  renderClip() {
    const {x1, y1, x2, y2} = this.state.span
    if (this.props.clip) {
      return (
        <Clip shape="Rect" x={x1} y={y1} width={x2-x1} height={y2-y1}>
          {this.renderStyle()}
        </Clip>
      )
    }
    return this.renderStyle()
  }

  renderStyle() {
    if (this.props.style && this.props.style !== 'none') {
      return (
        <Style name={this.props.style}>
          {this.props.children}
        </Style>
      )
    }
    return this.props.children
  }

  render() {
    if (!this.state.span) {
      return null
    }
    
    const {x1, y1, x2, y2} = this.state.span
    const {height, width, grid=true, axis=true} = this.props
    const xmargin = this.state.xmargin || 0
    const ymargin = this.state.ymargin || 0


    const vb = [
      +x1 - xmargin,
      +y1 - ymargin,
      +x2 - x1 + 2*xmargin,
      +y2 - y1 + 2*ymargin
    ]

    const svgprops = {
      height, width,
      viewBox: vb.join(' '),
      transform: 'scale(1,-1)'
    }

    return (
      <svg className='svgplot-canvas' {...svgprops} ref={this.svgref}>
        <MarkerSymbols />
        {grid ? (
          <Grid span={[x1, y1, x2, y2]} axis={axis}/>
         ) : axis ? (
          <Style exactname="svgplot-axis">
            <Path points={[[0,y1], [0,y2]]} markers="-->"/>
            <Path points={[[x1,0], [x2,0]]} markers="-->"/>
          </Style>
         ) : null}
        {this.renderClip()}
      </svg>
    )
  }
}

import React from 'react'
import { Clip, Style, Grid, Overlay, Path } from '.'
import { MarkerSymbols } from './react-svgplot/Style'
import { Canvas } from './react-svgplot'

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

function convertToMM(val, unit) {
  if (unit === 'mm') return val
  if (unit === 'cm') return val*10
  if (unit === 'in') return (val * 25.4)
  if (unit === 'pt') return convertToMM(val/72, 'in')
  if (unit === 'pc') return convertToMM(val/12, 'pt')
}

function toMM(s) {
  // return in
  const v = +s.slice(0,-2)
  const u = s.slice(-2)
  return convertToMM(v, u)
}


const Clipper = ({x1, y1, x2, y2, clip, children}) => {
  if (clip) {
    return (
      <Clip shape="Rect" x={x1} y={y1} width={x2-x1} height={y2-y1}>
        {children}
      </Clip>
    )
  } else {
    return children
  }
}

const Styler = ({style, children}) => {
  if (style && style !== 'none') {
    return (
      <Style name={style}>
        {children}
      </Style>
    )
  } else {
    return children
  }
}

export const CoordinatePlane = props => {
  
  const span = parseSpan(props.span)
  if (span === null) {
    console.log("CoordinatePlane: span is null")
    return null
  }
  const {x1, y1, x2, y2} = span
  const w = x2 - x1
  const h = y2 - y1
  const {
    preserveAspectRatio=true, 
    margin='2mm',
    grid=true, axis=true, 
    style="primary function", 
    clip=true,
    border=false,
  } = props

  const canvas = { border }

  const clipper = {x1, y1, x2, y2, clip}
  const styler = {style}

  const marg = toMM(margin)

  if (props.preserveAspectRatio === false) {
    // TODO
  } else {
    if (props.width && props.height) {
      console.log('WIDTH AND HEIGHT')
      // TODO 
      /*
      const width = toMM(props.width)
      canvas.width = width + marg*2 + 'mm'
      const vbmarg = w * marg / width
      canvas.x1 = x1 - vbmarg
      canvas.y1 = y1 - vbmarg
      canvas.x2 = x2 + vbmarg
      canvas.y2 = y2 + vbmarg

      const height = toMM(props.height)
      canvas.height = height + marg*2 + 'mm'
      const vbmarg = h * marg / height
      canvas.x1 = x1 - vbmarg
      canvas.y1 = y1 - vbmarg
      canvas.x2 = x2 + vbmarg
      canvas.y2 = y2 + vbmarg
      */

    } else if (props.width) {
      const width = toMM(props.width)
      canvas.width = width + marg*2 + 'mm'
      const vbmarg = w * marg / width
      canvas.x1 = x1 - vbmarg
      canvas.y1 = y1 - vbmarg
      canvas.x2 = x2 + vbmarg
      canvas.y2 = y2 + vbmarg

    } else if (props.height) {
      const height = toMM(props.height)
      canvas.height = height + marg*2 + 'mm'
      const vbmarg = h * marg / height
      canvas.x1 = x1 - vbmarg
      canvas.y1 = y1 - vbmarg
      canvas.x2 = x2 + vbmarg
      canvas.y2 = y2 + vbmarg
    } else {

    }
  }
  
  const children = React.Children.toArray(props.children)
  const svgchildren = children.filter(c => c.type !== Overlay)
  const overlays = children.filter(c => c.type === Overlay)

  return (
    <Canvas {...canvas}>
      <MarkerSymbols />
      {grid ? (
        <Grid span={[x1, y1, x2, y2]} axis={axis}/>
      ) : axis ? (
      <Style exactname="svgplot-axis">
        <Path points={[[0,y1], [0,y2]]} markers="-->"/>
        <Path points={[[x1,0], [x2,0]]} markers="-->"/>
      </Style>
      ) : null}
      <Clipper {...clipper}>
        <Styler {...styler}>
          {svgchildren}
        </Styler>
      </Clipper>
      {overlays}
    </Canvas>
  )

}

export default CoordinatePlane

  

/*
export class CoordinatePlane2 extends React.Component {
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
    let a, b, c, d
    const bbox = this.svgref.current.getBBox()
    console.log(bbox)
    try {
      // Chrome
      ({a, b, c, d} = this.svgref.current.getCTM())
    } catch(e) {
      // Firefox
      ({a, b, c, d} = this.svgref.current.getScreenCTM())
    }
    console.log({a, b, c, d})
    const xmargin = 0.05*Math.abs(a + c)
    const ymargin = 0.05*Math.abs(d + b)
    this.setState({
      xmargin, ymargin, 
      width: bbox.width / (1.1*Math.abs(a)), height: bbox.height / (1.1*Math.abs(d))
    })
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
    const {grid=true, axis=true} = this.props
    const height = this.state.height || this.props.height
    const width = this.state.width || this.props.width
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
      <>
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
      </>
    )
  }
}
*/
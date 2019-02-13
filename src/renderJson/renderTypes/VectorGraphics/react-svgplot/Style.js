import React from 'react'

//const axisArrow = "M 0,0 Q -4,4 -4,12 Q 0,4 6,0 Q 0,-4 -4,-12 Q -4,-4 0,0"
//const axisArrow = "M 0,0 Q -2,-6 -1,-12 Q 2,-3 6,0 Q 2,3 -1,12 Q -2,6 0,0"


export const MarkerSymbols = props => {
  return (
    <defs>
      <symbol id="svgplot-symbol-point" viewBox="-12 -12 24 24" refX="0" refY="0">
        <circle cx="0" cy="0" r="4"/>
      </symbol>
      <symbol id="svgplot-symbol-hole" viewBox="-12 -12 24 24" refX="0" refY="0">
        <circle cx="0" cy="0" r="5"/>
        <circle cx="0" cy="0" r="3"className="svgplot-marker-hole"/>
      </symbol>
      <symbol id="svgplot-symbol-arrow" viewBox="-12 -12 24 24" refX="0" refY="0">
        <path d="M -2,0 L -5,-6 L 6,0 L -5,6 z"/>
      </symbol>
      <symbol id="svgplot-symbol-axisarrow" viewBox="-12 -12 24 24" refX="0" refY="0">
        <polygon points="0,1 1,1 1,-1 0,-1"/>
        <polygon points="0,0 0,2 10,2 10,0" transform="translate(2,0) rotate(120)"/>
        <polygon points="0,0 0,2 10,2 10,0" transform="scale(1,-1) translate(2,0) rotate(120)"/>
      </symbol>
    </defs>
  )
}


const MarkerDefs = ({stylename, markerW, markerH}) => {

  return (
    <>
      <marker id={`${stylename}-marker-arrowfwd`} viewBox="-6 -6 12 12" refX="0" refY="0"
        markerWidth={markerW} markerHeight={markerH}
        markerUnits="strokeWidth"
        orient="auto">
        <use xlinkHref='#svgplot-symbol-arrow' 
          x='-6' y='-6' height='12' width='12' 
          className='svgplot-marker'/>
      </marker>
      <marker id={`${stylename}-marker-arrowrev`} viewBox="-6 -6 12 12" refX="0" refY="0"
        markerWidth={markerW} markerHeight={markerH}
        markerUnits="strokeWidth"
        orient="auto">
        <use xlinkHref='#svgplot-symbol-arrow' 
          x='-6' y='-6' height='12' width='12' 
          transform='scale(-1,1)'
          className='svgplot-marker'/>
      </marker>
      <marker id={`${stylename}-marker-axisarrow`} viewBox="-6 -6 12 12" refX="0" refY="0"
        markerWidth={markerW} markerHeight={markerH}
        markerUnits="strokeWidth"
        orient="auto-start-reverse">
        <use xlinkHref='#svgplot-symbol-axisarrow' 
          x='-6' y='-6' height='12' width='12'
          className='svgplot-marker'/>
      </marker>
      <marker id={`${stylename}-marker-point`} viewBox="-6 -6 12 12" refX="0" refY="0"
        markerWidth={markerW} markerHeight={markerH}
        markerUnits="strokeWidth"
        orient="auto">
        <use xlinkHref='#svgplot-symbol-point' 
          x='-6' y='-6' height='12' width='12' 
          className='svgplot-marker'/>
      </marker>
      <marker id={`${stylename}-marker-hole`} viewBox="-5 -5 10 10" refX="0" refY="0"
        markerWidth={markerW} markerHeight={markerH}
        markerUnits="strokeWidth"
        orient="auto">
        <use xlinkHref='#svgplot-symbol-hole' 
          x='-5' y='-5' height='10' width='10' 
          className='svgplot-marker'/>
      </marker>
    </>
  )
}



const FillPatternDefs = ({stylename, width, height}) => {
  return (
    <>
      <pattern id={`${stylename}-fillpattern-dots1`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternUnits='userSpaceOnUse'>
        <circle cx='3' cy='3' r='3' className='svgplot-fillpattern'/>
        <circle cx='9' cy='9' r='3' className='svgplot-fillpattern'/>
      </pattern>
      <pattern id={`${stylename}-fillpattern-dots2`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternUnits='userSpaceOnUse'>
        <circle cx='3' cy='9' r='3' className='svgplot-fillpattern'/>
        <circle cx='9' cy='3' r='3' className='svgplot-fillpattern'/>
      </pattern>
      <pattern id={`${stylename}-fillpattern-diagonal1`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternUnits='userSpaceOnUse'>
        <polygon points='0,0 6,0 12,6 12,12' className='svgplot-fillpattern' />
        <polygon points='0,6 0,12 6,12' className='svgplot-fillpattern' />
      </pattern>
      <pattern id={`${stylename}-fillpattern-diagonal2`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternTransform='scale(-1,-1)'
        patternUnits='userSpaceOnUse'>
        <polygon points='0,0 6,0 12,6 12,12' className='svgplot-fillpattern'/>
        <polygon points='0,6 0,12 6,12' className='svgplot-fillpattern'/>
      </pattern>
      <pattern id={`${stylename}-fillpattern-zigzag1`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternTransform='scale(-1,-1)'
        patternUnits='userSpaceOnUse'>
        <polygon points='0,0 0,6 3,12 6,12' className='svgplot-fillpattern'/>
        <polygon points='12,0 12,6 9,12 6,12' className='svgplot-fillpattern'/>
        <polygon points='3,0 6,6 9,0' className='svgplot-fillpattern'/>
      </pattern>
      <pattern id={`${stylename}-fillpattern-zigzag2`} 
        viewBox='0 0 12 12' 
        width={width} height={height} 
        patternTransform='scale(-1,-1)'
        patternUnits='userSpaceOnUse'>
        <polygon points='0,6 0,12 3,12' className='svgplot-fillpattern'/>
        <polygon points='12,6 12,12 9,12' className='svgplot-fillpattern'/>
        <polygon points='0,0 6,12 12,0 9,0 6,6 3,0' className='svgplot-fillpattern'/>
      </pattern>
    </>
  )
}

class StyleDefs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.ref = React.createRef()
  }

  checkSize() {
    const CTM = this.ref.current.getCTM()
    this.setState({CTM})
  }

  componentDidMount() {
    this.checkSize()
  }

  render() {
    const { stylename } = this.props

    let w = 12, h = 12

    if (this.state.CTM) {
      const {a, b, c, d} = this.state.CTM
      const s = Math.max(Math.abs(a)+Math.abs(c),Math.abs(b)+Math.abs(d))
      w /= s
      h /= s
    }

    return (
      <defs ref={this.ref}>
        <MarkerDefs stylename={stylename} markerW={w} markerH={h}/>
        <FillPatternDefs stylename={stylename} width={w/3} height={h/3}/>
      </defs>
    )
  }
}



let styleCount = 0

const Style = props => {
  const { name='svgplot-unnamed-style', color } = props
  const uniquename = `styleID-${++styleCount}`
  const style = {}
  for (const shape of ['arrowfwd', 'arrowrev', 'axisarrow', 'point', 'hole']) {
    style[`--svgplot-marker-${shape}`] = `url(#${uniquename}-marker-${shape})`
  }

  for (const pattern of ['dots1', 'dots2', 'diagonal1', 'diagonal2', 'zigzag1', 'zigzag2']) {
    style[`--svgplot-fillpattern-${pattern}`] = `url(#${uniquename}-fillpattern-${pattern})`
  }

  if (color) {
    style['--svgplot-color'] = color
  }

  return (
    <g className={name} style={style} vectorEffect="inherit">
      <StyleDefs stylename={uniquename}/>
      {props.children}
    </g>
  )
}

export default Style
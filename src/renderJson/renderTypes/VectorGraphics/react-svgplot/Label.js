import React from 'react'

export default class Label extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.state = {}
  }

  componentDidMount() {
    const CTM = this.ref.current.getScreenCTM()
    //const BBox = this.ref.current.getBBox()
    this.setState({CTM})
  }

  render() {
    let {x, y, fontSize="1.3em"} = this.props
    let w = 100, h = 100
    let transform
    if (this.state.CTM) {
      const ctm = this.state.CTM
      const inv = ctm.inverse()
      x = ctm.a*x + ctm.c*y + ctm.e
      y = ctm.b*x + ctm.d*y + ctm.f
      const {a, b, c, d, e, f} = inv
      w /= Math.abs(a)
      h /= Math.abs(d)
      transform = `matrix(${[a,b,c,d,e,f].join(',')})`
    }
    const foprops = {x, y, width: w + '%', height: h + '%', position: 'relative', overflow: 'visible'}
    return (
      <g transform={transform}>
        <foreignObject {...foprops} ref={this.ref}>
          <div style={{
            position: 'absolute',
            overflow: 'visible',
            fontSize
          }}>
            {this.props.children}
          </div>
        </foreignObject>
      </g>
    )
  }
}
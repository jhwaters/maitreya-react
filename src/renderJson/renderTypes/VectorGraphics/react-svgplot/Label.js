import React from 'react'


export default class Label extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.state = {}
  }

  componentDidMount() {
    const CTM = this.ref.current.getCTM()
    this.setState({ctm: CTM})
  }

  render() {
    let {x, y, anchor="W", distance, rotate} = this.props

    const anglemap = {
      E: 0,
      NE: 45,
      N: 90,
      NW: 135,
      W: 180,
      SW: 225,
      S: 270,
      SE: 315,
      left: 135,
      right: 0,
    }

    const anchorAngle = anglemap[anchor] ? anglemap[anchor] : +anchor % 360

    const tb = anchorAngle === 0 || anchorAngle === 180 ? 'center' : anchorAngle < 180 ? 'top' : 'bottom'
    const lr = anchorAngle < 90 ? 'right' : anchorAngle <= 270 ? 'left' : 'right'  

    const fobj = {
      x: 0, y: 0,  // Chrome rounds foreignObject coordinates to integers, so it works better to apply them later 
      width: '100%', height: '100%',
      style: {overflow: 'visible'}, 
    }
    const div1 = {
      style: {
        width: '0', height: '0',
        margin: '0',
        padding: '0',
        transformOrigin: lr + ' center',
        position: 'relative',
      }
    }
    const div2 = {
      style: {
        //border: '1px solid orange',
        position: 'absolute',
        [lr]: -Math.abs(Math.sin(anchorAngle * Math.PI / 180) * 0.5) + 'em',
        [tb === 'center' ? 'top' : tb]: -Math.abs(Math.cos(anchorAngle * Math.PI / 180) * 0.7) + 'em',
        textAlign: lr,
        padding: 0,
        transformOrigin: lr + ' center',
      }
    }

    if (distance) {
      const d = parseFloat(distance)
      const units = distance.replace(d, '') 
      const padX = Math.abs(Math.cos(anchorAngle * Math.PI / 180) * d) + units
      const padY = Math.abs(Math.sin(anchorAngle * Math.PI / 180) * d) + units

      if (tb === 'top') {
        div2.style.marginTop = padY
      } else if (tb === 'bottom') {
        div2.style.marginBottom = padY
      }
      if (lr === 'left') {
        div2.style.marginLeft = padX
      } else if (lr === 'right') {
        div2.style.marginRight = padX
      }
    }


    
    if (this.state.ctm) {
      const useragent = navigator.userAgent.toLowerCase()
      if ((/safari/).test(useragent) && !(/firefox/).test(useragent) && !(/chrome/).test(useragent)) {
        // Safari removes SVG CTM upon applying a transformation to foreignObject
        // This fixes it (and also allows labels to overflow the SVG bounds)
        const ctm = this.state.ctm
        const inv = this.state.ctm.inverse()
        const m1 = ctm.multiply(inv)
        m1.e = -x
        m1.f = -y
        inv.e = x
        inv.f = y
        const m2 = m1.multiply(ctm).multiply(inv)
        const {a, b, c, d, e, f} = m2
        const resultmatrix = [a,b,c,d,e,f]
        div1.style.transform = `matrix(${resultmatrix.join(',')})`

      } else {
        const {a, b, c, d} = this.state.ctm.inverse()
        div1.style.transform = `matrix(${[a,b,c,d,x,y].join(',')})`
      }

      if (rotate) {
        const rotateAngle = rotate === 'auto' ? (lr === 'right' ? anchorAngle : (180 + anchorAngle) % 360) : rotate
        div2.style.transform = `rotate(${-rotateAngle}deg)`
      }
    }
    
    console.log({div1, div2})
    
    return (
      <foreignObject {...fobj} ref={this.ref} xmlns="http://www.w3.org/1999/xhtml">
        <div {...div1}>
          <div className="svgplot-label" {...div2} anchor={anchor}>
            {this.props.children}
          </div>
        </div>

      </foreignObject>
    )
  }
}
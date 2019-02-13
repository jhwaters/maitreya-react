import React from 'react'

export default class Label extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.state = {}
  }

  componentDidMount() {
    const CTM = this.ref.current.getCTM()
    const sCTM = this.ref.current.getScreenCTM()
    console.log({CTM})
    console.log({sCTM})
    this.setState({ctm: CTM})
  }

  render() {
    let {x, y, anchor="NW", padding='0', angle} = this.props

    // Chrome only uses integer values for foreignObject coords, so we
    // use integer coords for the foreignObject and fix with a transform
    const [foX, foY] = [Math.floor(x), Math.floor(y)] 
    const [dX, dY] = [x - foX, y - foY]

    const anch = ({
      NW: 'top left',
      NE: 'top right',
      SW: 'bottom left',
      SE: 'bottom right',
    })[anchor]

    const fobj = {
      x: foX, y: foY,
      width: '100%', height: '100%',
      style: {overflow: 'visible'}, 
    }
    const div1 = {
      style: {
        position: 'relative', 
        width: '0', height: '0',
        margin: '0',
        padding: '0',
        transformOrigin: anch,
      },
    }
    
    const [tb, lr] = anch.split(' ')
    const div2 = {
      style: {
        position: 'absolute',
        //transformOrigin: anch,
        [tb]: '0',
        [lr]: '0',
        textAlign: lr,
        padding,
      }
    }
    
    if (this.state.ctm) {
      const {a, b, c, d} = this.state.ctm.inverse()
      div1.style.transform = `matrix(${[a,b,c,d,dX,dY].join(',')})`
    }
    
    if (angle) {
      div1.style.transform += ` rotate(${-angle}deg)`
    }
    
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
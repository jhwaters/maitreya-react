import React from 'react'
import { MarkerSymbols } from './Style'
import Overlay from './Overlay'

function convertToPx(val, unit) {
  if (unit === 'px') return val
  if (unit === 'in') return (val * 96)
  if (unit === 'mm') return convertToPx(val/25.4, 'in')
  if (unit === 'cm') return convertToPx(val/2.54, 'in')
  if (unit === 'pt') return convertToPx(val/72, 'in')
  if (unit === 'pc') return convertToPx(val/12, 'pt')
}



class Canvas extends React.Component {

  render() {
    const props = this.props
    const {
      cartesian=true, x1, x2, y1, y2, 
      width, height, preserveAspectRatio,
      border=false
    } = props


    const wrapperprops = {
      style: {
        display: 'inline-block',
        position: 'relative', 
        padding: 0,
        width, height,
      },
    }

    if (border) {
      wrapperprops.style.border = '1px solid black'
    }

    const svgprops = {  
      width, height, 
      preserveAspectRatio, 
      style: {
        position: 'relative', 
        margin: 0,
        top: 0, left: 0,
      }
    }
    const gprops = {ref: this.ref, vectorEffect: 'non-scaling-stroke'}

    if (cartesian && cartesian !== "false") {
      gprops.transform = 'scale(1,-1)'
      svgprops.viewBox = `${x1} ${-y2} ${x2-x1} ${y2-y1}`
    } else {
      svgprops.viewBox = `${x1} ${y1} ${x2-x1} ${y2-y1}`
    }
  
    const children = React.Children.toArray(props.children)
    const svgchildren = children.filter(c => c.type !== Overlay)
    const overlays = children.filter(c => c.type === Overlay)

    return (
      <div className='svgplot-canvas' {...wrapperprops}>
        <svg {...svgprops}>
          <MarkerSymbols />
          <g {...gprops}>
            {svgchildren}
          </g>
        </svg>
        {overlays.length ? (
          overlays.map((o, i) => (
            <Overlay key={i} cartesian={cartesian} x1={x1} y1={y1} x2={x2} y2={y2} {...o.props} />
          ))
        ) : null}
      </div>
    )
  }
}

export default Canvas
import React from 'react'


export const OverlayPosition = props => {
  const {x, y, x1, y1, x2, y2, cartesian=true} = props
  const xPerc = 100 * (x - x1) / (x2 - x1)
  const yPerc = cartesian ? 100 * (y2 - y) / (y2 - y1) : (y - y1) / (y2 - y1)

  const style = {
    position: 'absolute',
    left: xPerc + '%',
    top: yPerc + '%',
    height: '0px',
    width: '0px',
    overflow: 'visible',
  }

  return (
    <div style={style}>
      {props.children}
    </div>
  )
}

const Overlay = props => {
  const {
    rotate,
    anchor,
    displacement,
  } = props


  const innerstyle = {
    position: 'absolute',
    transformOrigin: 'center center',
    transform: 'translate(-50%,-50%)',
  }

  if (anchor) {
    const [transformOrigin, initialTransform] = {
      E: ['right center', 'translate(-100%,-50%)'],
      NE: ['right top', 'translate(-100%,0)'],
      N: ['center top', 'translate(-50%,0)'],
      NW: ['left top', 'translate(0,0)'],
      W: ['left center', 'translate(0,-50%)'],
      SW: ['left bottom', 'translate(0,-100%)'],
      S: ['center bottom', 'translate(-50%,-100%)'],
      SE: ['right bottom', 'translate(-100%,-100%)'],
      center: ['center center', 'translate(-50%,-50%)'],
    }[anchor]
  
    innerstyle.transformOrigin = transformOrigin
    innerstyle.transform = initialTransform
  }
    
  if (displacement !== undefined) {
    if (displacement.constructor.name === 'Object') {
      if (displacement.x !== undefined || displacement.y !== undefined) {
        const dx = parseFloat(displacement.x) || 0
        const dy = parseFloat(displacement.y) || 0
        const ux = (displacement.x || '').replace(dx, '')
        const uy = (displacement.y || '').replace(dy, '')
        innerstyle.transform += ` translate(${dx}${ux},${-dy}${uy})`
      } else if (displacement.angle && displacement.radius) {
        const r = parseFloat(displacement.radius)
        const u = displacement.radius.replace(r, '')
        const a = parseFloat(displacement.angle)
        const dx = Math.round(Math.cos(a * Math.PI / 180) * r) + u
        const dy = Math.round(-Math.sin(a * Math.PI / 180) * r) + u
        innerstyle.transform += ` translate(${dx},${dy})`
      }
    } else if (anchor) {
      const angles = {
        E: 0, NE: 45, N: 90, NW: 135, 
        W: 180, SW: 225, S: 270, SE: 315,
      }
      if (angles[anchor] !== undefined) {
        const a = ((rotate ? +rotate : 0) + (+angles[anchor] + 180)) % 360
        const r = parseFloat(displacement)
        const u = displacement.replace(r, '')
        const dx = Math.round(Math.cos(a * Math.PI / 180) * r) + u
        const dy = Math.round(-Math.sin(a * Math.PI / 180) * r) + u
        innerstyle.transform += ` translate(${dx},${dy})`
      }
    }
  }

  if (rotate) {
    const rotateAngle = parseFloat(rotate)
    innerstyle.transform += ` rotate(${-rotateAngle}deg)`
  }

  //console.log({innerstyle, outerstyle})
  
  return (
    <div className="svgplot-label" style={innerstyle}>
      {props.children}
    </div>
  )
}

export default Overlay
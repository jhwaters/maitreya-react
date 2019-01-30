import React from 'react'


const ArrowMarker = ({style}) => {
  const id = `vg-${style}-arrow`
  const className = `vg-marker-${style}`
  return (
    <marker id={id} viewBox="0 0 10 10" refX="3" refY="5"
      markerWidth=".4" markerHeight=".4"
      markerUnits="strokeWidth"
      orient="auto-start-reverse">
      <path d="M 2 5 L 0 0 L 10 5 L 0 10 z" className={className} />
    </marker>
  )
}

const PointMarker = ({style}) => {
  const id = `vg-${style}-point`
  const className = `vg-marker-${style}`
  return (
    <marker id={id} viewBox="0 0 10 10" refX="5" refY="5"
      markerWidth=".2" markerHeight=".2"
      markerUnits="strokeWidth">
      <circle cx="5" cy="5" r="5" className={className} />
    </marker>
  )
}

const BigPointMarker = ({style}) => {
  const id = `vg-${style}-bigpoint`
  const className = `vg-marker-${style}`
  return (
    <marker id={id} viewBox="0 0 10 10" refX="5" refY="5"
      markerWidth=".3" markerHeight=".3"
      markerUnits="strokeWidth">
      <circle cx="5" cy="5" r="5" className={className} />
    </marker>
  )
}

const HoleMarker = ({style}) => {
  const id = `vg-${style}-hole`
  const className = `vg-marker-${style}`
  return (
    <marker id={id} viewBox="0 0 10 10" refX="5" refY="5"
      markerWidth=".4" markerHeight=".4"
      markerUnits="strokeWidth">
      <circle cx="5" cy="5" r="5" className={className}/>
      <circle cx="5" cy="5" r="3" className='vg-marker-hole' />
    </marker>
  )
}


export const MarkerDefs = () => {
  const styles = ['axis', 'plot', 'plot-2', 'geom']
  return (
    <>
    {styles.map(s => <ArrowMarker key={`arrow-${s}`} style={s}/> )}
    {styles.map(s => <PointMarker key={`pt-${s}`} style={s}/> )}
    {styles.map(s => <BigPointMarker key={`bigpt-${s}`} style={s}/> )}
    {styles.map(s => <HoleMarker key={`hole-${s}`} style={s}/> )}
    </>
  )
}
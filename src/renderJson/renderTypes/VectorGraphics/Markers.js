import React from 'react'


export const MarkerSymbols = props => {
  return (
    <>
    <symbol id="vg-symbol-point" viewBox="-6 -6 12 12" 
      refX="0" refY="0">
      <circle cx="0" cy="0" r="6" />
    </symbol>
    <symbol id="vg-symbol-arrow" viewBox="-12 -12 24 24" refX="0" refY="0">
      <path d="M -6,0 L -12,-12 L 12,0 L -12,12 z" />
    </symbol>
    <symbol id="vg-symbol-hole" viewBox="-6 -6 12 12" refX="0" refY="0">
      <circle cx='0' cy='0' r='6'/>
      <circle cx='0' cy='0' r='3.5' fill='white'/>
    </symbol>
    <symbol id="vg-symbol-fancyarrow" viewBox="-12 -12 24 24" refX="0" refY="0">
      <path d='M 0,0 Q -2,3 -2,12 Q 1,3 7,0 Q 1,-3 -2,-12 Q -2,-3 0,0' />
    </symbol>
    </>
  )
}

export const MarkerDefs = props => {
  const { stylename='vg' } = props

  return (
    <>
    <marker id={`${stylename}-marker-arrowfwd`} viewBox="0 0 12 12" refX="6" refY="6"
      markerWidth=".4" markerHeight=".4"
      markerUnits="strokeWidth"
      orient="auto">
      <use xlinkHref='#vg-symbol-arrow' 
        x='0' y='0' height='12' width='12' 
        className='vg-marker'/>
    </marker>
    <marker id={`${stylename}-marker-arrowrev`} viewBox="-6 -6 12 12" refX="0" refY="0"
      markerWidth=".45" markerHeight=".45"
      markerUnits="strokeWidth"
      orient="auto">
      <g transform='rotate(180)'>
        <use xlinkHref='#vg-symbol-arrow' 
          x='-6' y='-6' height='12' width='12' 
          className='vg-marker'/>
      </g>
    </marker>
    <marker id={`${stylename}-marker-farrowfwd`} viewBox="0 0 12 12" refX="6" refY="6"
      markerWidth=".7" markerHeight=".7"
      markerUnits="strokeWidth"
      orient="auto">
      <use xlinkHref='#vg-symbol-fancyarrow' 
        x='0' y='0' height='12' width='12' 
        className='vg-marker'/>
    </marker>
    <marker id={`${stylename}-marker-point`} viewBox="0 0 12 12" refX="6" refY="6"
      markerWidth=".25" markerHeight=".25"
      markerUnits="strokeWidth"
      orient="auto">
      <use xlinkHref='#vg-symbol-point' 
        x='0' y='0' height='12' width='12' 
        className='vg-marker'/>
    </marker>
    <marker id={`${stylename}-marker-hole`} viewBox="0 0 12 12" refX="6" refY="6"
      markerWidth=".35" markerHeight=".35"
      markerUnits="strokeWidth"
      orient="auto">
      <use xlinkHref='#vg-symbol-hole' 
        x='0' y='0' height='12' width='12' 
        className='vg-marker'/>
    </marker>
    </>
  )
}


import React from 'react'


const CircleFill1 = ({id}) => {
  return (
    <pattern id={id} viewBox='0 0 8 8' 
      width='2%' height='2%' 
      patternUnits='userSpaceOnUse'>
      <circle cx='2' cy='2' r='2' class='vg-marker' />
      <circle cx='6' cy='6' r='2' class='vg-marker' />
    </pattern>
  )
}

const CircleFill2 = ({id}) => {
  return (
    <pattern id={id} viewBox='0 0 8 8' 
      width='2%' height='2%' 
      patternUnits='userSpaceOnUse'>
      <circle cx='2' cy='6' r='2' class='vg-marker' />
      <circle cx='6' cy='2' r='2' class='vg-marker' />
    </pattern>
  )
}


const DiagonalFill1 = ({id}) => {
  return (
    <pattern id={id} viewBox='0 0 10 10' 
      width='4%' height='4%'
      patternUnits='userSpaceOnUse'>
      <polygon points='0,0 5,0 10,5 10,10' class='vg-marker' />
      <polygon points='0,5 0,10 5,10' class='vg-marker' />
    </pattern>
  )
}

const DiagonalFill2 = ({id}) => {
  return (
    <pattern id={id} viewBox='0 0 10 10' 
      width='4%' height='4%'
      patternTransform='scale(-1,-1)'
      patternUnits='userSpaceOnUse'>
      <polygon points='0,0 5,0 10,5 10,10' class='vg-marker' />
      <polygon points='0,5 0,10 5,10' class='vg-marker' />
    </pattern>
  )
}

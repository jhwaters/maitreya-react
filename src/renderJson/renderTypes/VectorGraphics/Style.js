import React from 'react'
import { Style as SPStyle } from './react-svgplot'

const Style = props => {
  const {name, exactname, color} = props

  let stylenames = []
  if (name) {
    stylenames = stylenames.concat(name.split(' ').map(s => `vg-style-${s}`))
  }
  if (exactname) {
    stylenames = stylenames.concat(exactname.split(' '))
  }

  const styleprops = {}
  if (color) styleprops.color = color
  if (stylenames.length) styleprops.name = stylenames.join(' ')

  return (
    <SPStyle {...styleprops}>
      {props.children}
    </SPStyle>
  )
}

export default Style
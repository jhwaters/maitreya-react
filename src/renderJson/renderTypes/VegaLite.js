import React from 'react'
import ReactVega from 'react-vega'
import ReactVegaLite from 'react-vega-lite'

export const Vega = data => {
  return (
    <ReactVega spec={data} />
  )
}

export const VegaLite = data => {
  return (
    <ReactVegaLite spec={data} />
  )
}
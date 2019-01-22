import React from 'react'
import ReactVega from 'react-vega'
import ReactVegaLite from 'react-vega-lite'

export const Vega = ({data, options}) => {
  return (
    <ReactVega spec={data} />
  )
}

export const VegaLite = ({data, options}) => {
  return (
    <ReactVegaLite spec={data} />
  )
}
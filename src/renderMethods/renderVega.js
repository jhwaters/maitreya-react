import React from 'react'
import Vega from 'react-vega'
import VegaLite from 'react-vega-lite'


const renderVega = function(data, options) {
  return (
    <Vega spec={data} />
  )
}

const renderVegaLite = function(data, options) {
  //const wrapper = options.wrapper || {}
  return <VegaLite spec={data} />
}


export { 
  renderVega,
  renderVegaLite,
}
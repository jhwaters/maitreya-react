import React from 'react'
import VegaLite from 'react-vega-lite'


const renderVegaLite = function(data, options) {
  const wrapper = options.wrapper || {}
  return (
    <div {...wrapper}>
      <VegaLite spec={data} />
    </div>
  )
}


export default renderVegaLite
import React from 'react'
import PageSize from './PageSize'
import PageMargins from './PageMargins'

const PageSettings = props => {
  return (
    <div>
      <h4>Page Size</h4>
      <PageSize/>
      <h4>Margins</h4>
      <PageMargins/>
    </div>
  )
}

export default PageSettings
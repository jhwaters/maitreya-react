import React from 'react'
import UITheme from './UITheme'

class UISettings extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <span>Theme: </span><UITheme/>
      </>
    )
  }
}

export default UISettings
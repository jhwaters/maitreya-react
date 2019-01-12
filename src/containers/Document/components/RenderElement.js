import { defaultsDeep } from 'lodash'
import React from 'react'
import {
  defaultOptions,
  inheritOptions,
  renderElement,
} from './renderMethods'




class RenderElement extends React.Component {
  constructor(props) {
    super(props)
    const type = this.props.type || 'text'
    this.state = {
      data: this.props.data,
      type: type,
      options: defaultsDeep({}, this.props.options, inheritOptions(type, defaultOptions))
    }
  }

  render() {
    const {data, type, options} = this.props
    return <span>{renderElement({data: data, type: type, options: options})}</span>
  }
}


export default RenderElement
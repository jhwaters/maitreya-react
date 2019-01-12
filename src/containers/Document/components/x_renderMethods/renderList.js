import React from 'react'
import { renderJsonML } from './renderJsonML'

export const renderList = function(data, options) {
  const listOptions = options.list
  return renderJsonML(['ol', listOptions, data], options)
}
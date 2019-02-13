import React from 'react'

// just for testing purposes
// use Clip, Style, or Transform instead

const Layer = props => <g {...props}>{props.children}</g>

export default Layer
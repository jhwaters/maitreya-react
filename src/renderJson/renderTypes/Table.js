import React from 'react'

function parseAlignment(align) {
  // latex-style, e.g. r|ccc|l
  const colStyles = []

  const blocks = align.split('|')
  for (const i in blocks) {
    const block = blocks[i]
    for (const j in block) {
      const char = block[j]
      const colStyle = {}
      if (char === 'l') colStyle.textAlign = 'left'
      if (char === 'c') colStyle.textAlign = 'center'
      if (char === 'r') colStyle.textAlign = 'right'
      if (+j === 0 && i > 0) {
        colStyle.borderLeft = '1px solid black'
      }
      if (+j === block.length-1 && i < blocks.length-1) {
        colStyle.borderRight = '1px solid black'
      }
      colStyles.push(colStyle)
    }
  }
  return colStyles
}


export const TRow = props => {
  const { header=false, border=false } = props
  const rowprops = {style: {border: 'none'}}
  if (border) {
    if (border === 'bottom') {
      rowprops.style.borderBottom = '1px solid black'
    } else if (border === 'top') {
      rowprops.style.borderTop = '1px solid black'
    } else if (border === true || border === 'both') {
      rowprops.style.borderTop = '1px solid black'
      rowprops.style.borderBottom = '1px solid black'
    }
  }

  const defaultBorderLeft = i => 'none'
  const defaultBorderRight = i => 'none'
  const defaultTextAlign = i => 'center'

  const elemstyle = i => ({
    border: 'none',
    borderLeft: `var(--table-col-${i}-borderLeft, ${defaultBorderLeft(i)})`,
    borderRight: `var(--table-col-${i}-borderRight, ${defaultBorderRight(i)})`,
    textAlign: `var(--table-col-${i}-textAlign, ${defaultTextAlign(i)})`,
  })

  //console.log(entryprops)
  return (
    <tr {...rowprops}>
      {header ? (
        React.Children.toArray(props.children).map((c,i) => (
          <th key={i} style={elemstyle(+i+1)}>{c}</th>
        ))
      ) : (
        React.Children.toArray(props.children).map((c,i) => (
          <td key={i} style={elemstyle(+i+1)}>{c}</td>
        ))
      )}
    </tr>
  )
}

export const Table = props => {
  const children = React.Children.toArray(props.children)

  let headIndex = 0
  while (headIndex < children.length 
    && children[headIndex].type.name === 'TRow' 
    && children[headIndex].props.header) {
    headIndex += 1
  }

  const tableprops = {style: {borderCollapse: 'collapse'}}
  if (props.border) {
    tableprops.style.border = '1px solid black'
  }
  if (props.align) {
    const alignment = parseAlignment(props.align)
    for (const i in alignment) {
      for (const k in alignment[i]) {
        const cssvar = `--table-col-${+i+1}-${k}`
        const value = alignment[i][k]
        tableprops.style[cssvar] = value
      }
    }
  }

  return (
    <table {...tableprops}>
      {headIndex > 0 ? (
        <thead>
          {children.slice(0,headIndex)}
        </thead>
      ) : null}
      {headIndex < children.length ? (
        <tbody>
          {children.slice(headIndex)}
        </tbody>
      ) : null}
    </table>
  )
}
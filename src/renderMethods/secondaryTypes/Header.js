/**
 * ATM this is not technically a secondary type
 * It's here because I may allow headings to use Markdown,
 * although that will interfere with the auto-blanks
 */

import React from 'react'

const parseHeader = (text) => {
  let result = []
  let current = ''
  let isBlank = false
  let i = 0
  let blankSize = 0
  while (i < text.length) {
    const nextChar = text[i]
    if (isBlank) {
      if (nextChar === '_') {
        blankSize += 1
      } else {
        result.push({type: 'blank', size: blankSize})
        current = nextChar
        isBlank = false
        blankSize = 0
      }
    } else {
      if (nextChar === '_') {
        if (current !== '') {
          result.push({type: 'text', text: current})
          current = ''
        }
        isBlank = true
        blankSize = 1
      } else {
        current += nextChar
      }
    }
    i += 1
  }
  if (isBlank) {
    if (blankSize > 0) {
      result.push({type: 'blank', size: blankSize})
    }
  } else {
    if (current !== '') {
      result.push({type: 'text', text: current})
    }
  }
  return result
}

const renderHeaderElement = (text) => {
  const parts = parseHeader(text)
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'text') {
          return (
            <div key={i} style={{display: 'inline-block'}}>{p.text}</div>
          )
        } else {
          const w = `${1 + 3*(p.size - 1)}cm`
          return (
            <div key={i} className='blank-underline blank-underline-header' style={{width: w}} />
          )
        }
      })}
    </>
  )
}

export const Header = ({data, options}) => {
  /**
   * @param data: array where each entry is {left, right}
   */

  if (data.length === 0) {
    return <div className='header header-empty' />
  } else {
    return (
      <table className='header'>
        <tbody>
          {data.map((row, i) => {
            const {left, right} = row
            return (
              <tr key={i}>
                <td>
                  {renderHeaderElement(left || '')}
                </td>
                <td>
                  {renderHeaderElement(right || '')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
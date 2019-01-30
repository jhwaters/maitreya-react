import React from 'react'
import { renderElement } from '..'

export const Table = ({data, options}) => {
  const {headings=[], rows=[]} = data
  return (
    <table style={{margin: '2mm'}}>
      {headings.length > 0 ? (
        <thead>
          <tr>
            {headings.map((h,i) => <th key={i}>{renderElement(h, options)}</th>)}
          </tr>
        </thead>
      ) : null}
      <tbody>
        {rows.map((r,i) => (
          <tr key={i}>
            {r.map((d,i) => <td key={i}>{renderElement(d, options)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
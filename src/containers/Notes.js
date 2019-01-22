import React from 'react'


const Notes = (props) => {
  const notes = [
    'Double-click the header to edit it.',
    'Make sure the scale is set to 100% when printing.',
    'Create a PDF by selecting "Save to PDF" when printing.',
  ]
  const issues = [
    'In some browsers only the first page prints. Chrome works.',
    'Pagination is really sketchy.',
    "Zooming doesn't work right.",
  ]
  const formatting = [
    'Italic and bold font, as well as superscripts, subscripts, and arrows, can be achieved using markdown.',
    'Text wrapped in $$ ... $$ will be rendered as a math formula using LaTeX.',
    'Use $$$ ... $$$ for display style math.',
  ]
  let i = 0
  return (
    <>
    <span style={{fontWeight: 'bold', fontSize: '1em'}}>
      <span style={{marginRight: '3mm'}}>Notes</span>
      <button onClick={props.onRequestClose}>Close</button>
    </span>
    <div>
      {notes.map(n => <p key={`note-${++i}`}>{n}</p>)}

      <h4>Issues</h4>
      {issues.map(n => <p key={`note-${++i}`}>{n}</p>)}

      <h4>Text formatting for custom questions</h4>
      {formatting.map(n => <p key={`note-${++i}`}>{n}</p>)}

    </div>
    </>
  )
}

export default Notes
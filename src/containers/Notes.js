import React from 'react'


const Notes = (props) => {
  const notes = [
    'Double-click on the document to edit an element.',
    'Make sure the scale is set to 100% when printing.',
    'Create a PDF by selecting "Save to PDF" when printing.',
  ]
  const issues = [
    'Pagination is really sketchy.',
    "Zooming doesn't work right.",
    'In some browsers only the first page prints.',
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

    </div>
    </>
  )
}

export default Notes
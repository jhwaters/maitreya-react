import React from 'react'


const Notes = (props) => {

  return (
    <>
    <span style={{fontWeight: 'bold', fontSize: '1em'}}>
      <span style={{marginRight: '3mm'}}>Notes</span>
      <button onClick={props.onRequestClose}>Close</button>
    </span>
    <div>
      <p>Double-click on the document to edit an element.</p>
      <p>Create a PDF by selecting "Save to PDF" when printing.</p>
      <p>Make sure the scale is set to 100% when printing.</p>
      <p>
        Changing the font size or deleting questions from the middle of the
        document can cause the calculated page breaks to no longer be 
        appropriate. Use the 'Fix Pagination' button to quickly recalculate 
        all page breaks.
      </p>

      <h4>Issues</h4>
      <p>
        In some browsers only the first page prints.
      </p>

    </div>
    </>
  )
}

export default Notes
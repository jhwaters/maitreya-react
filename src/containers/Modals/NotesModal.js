import React from 'react'
import ReactModal from 'react-modal'

const NotesModal = props => (
  <ReactModal
    isOpen={props.isOpen}
    onRequestClose={props.onRequestClose}
    style={{
      content: {
        width: '5in',
        bottom: '.5in',
        left: '.5in',
        right: 'unset',
        top: 'unset',
        color: 'black',
        backgroundColor: 'var(--ui-page, white)',
      }
    }}
  >
    <span style={{fontWeight: 'bold', fontSize: '1em'}} onClick={props.onRequestClose}>
      <span style={{marginRight: '3mm'}}>Notes</span>      
    </span>
    <div onClick={props.onRequestClose}>
      <p>Double-click on the document to edit an element.</p>
      <p>Create a PDF by selecting "Save to PDF" when printing.</p>
      <p>Make sure the scale is set to 100% when printing.</p>
      <p>
        Changing the font size or deleting questions from the middle of the
        document can cause the calculated page breaks to no longer be 
        appropriate. Use the 'Fix Pagination' button to quickly recalculate 
        all page breaks.
      </p>
      <p>
        Using Firefox or Chrome is recommended. 
        Not much testing has been done for other browsers.
      </p>
      <p>The answer key can't be over one page long.</p>
      <p>Printing doesn't always work right with page sizes other than "letter".</p>
      <p>Some inputs do not work in Safari.</p>
      <button onClick={props.onRequestClose}>Close</button>
    </div>
  </ReactModal>
)

export default NotesModal
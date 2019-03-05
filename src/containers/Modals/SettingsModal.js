import React from 'react'
import ReactModal from 'react-modal'
import SettingsPage from '../Settings'

const SettingsModal = props => (
  <ReactModal
    isOpen={props.isOpen}
    onRequestClose={props.onRequestClose}
    style={{
      content: {
        border: 'none',
        top: '0',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 0,
      },
      overlay: {
        background: 'none',
        backgroundColor: 'none',
      }
    }}
  >
    <SettingsPage onRequestClose={props.onRequestClose}/>
  </ReactModal>
)

export default SettingsModal
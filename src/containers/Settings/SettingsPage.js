import React from 'react'
import AddLocalFont from './AddLocalFont'
//import FontFamily from './FontSelect'
//import FontSize from './FontSize'
//import PageMargins from './PageMargins'
//import StartNumbering from './StartNumbering'

import styles from './styles.module.css'


export const SettingsPage = (props) => {
  return (
    <div className={styles.SettingsPage}>
      <h3>Settings </h3>

      <h4>Use Local Font</h4>
      <div>
      Font Name: <AddLocalFont>Add To List</AddLocalFont> (You will then need to select it from the menu)
      </div>
    </div>
  )
  /*
      <h4>Document Font</h4>
      <div>
        <FontSelect />
      </div>

      <h4>Page Margins</h4>
      <div>
        <PageMargins />
      </div>

      <h4>Start Numbering At:</h4>
      <div>
        <StartNumbering />
      </div>
    </div>
  */
}



export default SettingsPage
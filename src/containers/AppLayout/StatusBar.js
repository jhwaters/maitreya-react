import React from 'react'
import styles from './styles.module.css'

const StatusBar = (props) => {
  return (
    <div className={styles.StatusBar}>
      {props.children}
    </div>
  )
}

export default StatusBar
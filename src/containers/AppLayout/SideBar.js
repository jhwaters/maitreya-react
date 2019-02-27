import React from 'react'
import styles from './styles.module.css'

class SideBar extends React.Component {
  render() {
    return (
      <div className={styles.SideBar}>
        {this.props.children}
      </div>
    )
  }
}

export default SideBar
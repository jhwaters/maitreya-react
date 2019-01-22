import React from 'react'
import styles from './styles.module.css'

class Wrapper extends React.Component {
  
  render() {
    let classNames = [styles.Wrapper, styles['Wrapper-TopBar']]

    return (
      <div className={classNames.join(' ')}>
        {this.props.children}
      </div>
    )
  }
}

export default Wrapper
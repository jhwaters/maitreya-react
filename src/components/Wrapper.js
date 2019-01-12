import React from 'react'
import styles from './styles.module.css'

class Wrapper extends React.Component {
  
  render() {
    let classNames = [styles.Wrapper]
    if (this.props.customTitleBar) {
      classNames.push(styles.CustomTitleBar)
    } else {
      classNames.push(styles.NoTitleBar)
    }

    return (
      <div className={classNames.join(' ')}>
        {this.props.children}
      </div>
    )
  }
}

export default Wrapper
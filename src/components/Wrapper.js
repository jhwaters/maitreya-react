import React from 'react'
import styles from './styles.module.css'

class Wrapper extends React.Component {
  
  render() {
    let classNames = [styles.Wrapper]
    if (this.props.customTitleBar) {
      classNames.push(styles.WrapperTitleBar)
    } else {
      classNames.push(styles.WrapperTopBar)
    }

    return (
      <div className={classNames.join(' ')}>
        {this.props.children}
      </div>
    )
  }
}

export default Wrapper
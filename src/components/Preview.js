import React from 'react'
import styles from './styles.module.css'

class Previewer extends React.Component {
  render() {
    

    return (
      <div className={styles.PreviewOuter}>
        <div className={styles.PreviewInner}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Previewer
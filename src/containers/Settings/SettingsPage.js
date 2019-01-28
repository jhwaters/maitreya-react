import React from 'react'
import FontSettings from './Font'
import GraphSettings from './Graph'
import styles from './styles.module.css'


class SettingsPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {showing: 'none'}
  }

  showFontSettings = () => {
    this.setState({showing: 'font'})
  }
  showGraphSettings = () => {
    this.setState({showing: 'graph'})
  }

  renderSettings() {
    switch (this.state.showing) {
      case 'font': return <FontSettings/>
      case 'graph': return <GraphSettings/>
      default: return null
    }
  }

  render() {
    return (
      <div className={styles.SettingPage}>

        <div className={styles.LeftBar}>
          <div>
            <span className={styles.Title}>Settings</span>
          </div>
          
          <div className={styles.NavArea}>
            <button
              className={styles.NavButton}
              onClick={this.showFontSettings}
              disabled={this.state.showing === 'font'}
            >Fonts</button>
            <button
              className={styles.NavButton}
              onClick={this.showGraphSettings}
              disabled={this.state.showing === 'graph'}
            >Graphs</button>
          </div>

          <div>
            <button onClick={this.props.onRequestClose}>Close</button>
          </div>
          
        </div>
        
        <div className={styles.SettingSection}>
          {this.renderSettings()}
        </div>
      </div>
    )
  }
}

export default SettingsPage
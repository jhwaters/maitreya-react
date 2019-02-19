import React from 'react'
import FontSettings from './Font'
import GraphSettings from './Graph'
import PageSettings from './Page'
import UISettings from './UI'
import styles from './styles.module.css'


class SettingsPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {showing: 'font'}
  }

  showFontSettings = () => this.setState({showing: 'font'})
  showGraphSettings = () => this.setState({showing: 'graph'})
  showPageSettings = () => this.setState({showing: 'page'})
  showUISettings = () => this.setState({showing: 'ui'})

  renderSettings() {
    switch (this.state.showing) {
      case 'font': return <FontSettings/>
      case 'graph': return <GraphSettings/>
      case 'page': return <PageSettings/>
      case 'ui': return <UISettings />
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
            <div
              className={styles.NavButton}
              onClick={this.showFontSettings}
              status={this.state.showing === 'font' ? 'active' : undefined}
            >Fonts</div>
            <div
              className={styles.NavButton}
              onClick={this.showGraphSettings}
              status={this.state.showing === 'graph' ? 'active' : undefined}
            >Graphs</div>
            <div
              className={styles.NavButton}
              onClick={this.showUISettings}
              status={this.state.showing === 'ui' ? 'active' : undefined}
            >Interface</div>
            <div
              className={styles.NavButton}
              onClick={this.showPageSettings}
              status={this.state.showing === 'page' ? 'active' : undefined}
            >Page</div>
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
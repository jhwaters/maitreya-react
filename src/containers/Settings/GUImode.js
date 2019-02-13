import React from 'react'

class GUImode extends React.Component {

  constructor(props) {
    super(props)
    this.darkMode = React.createRef()
    this.debugView = React.createRef()
  }

  update = () => {
    const classNames = []
    if (this.darkMode.current.checked) {
      classNames.push('ui-dark-mode')
    }
    if (this.debugView.current.checked) {
      classNames.push('debug-view')
    }
    if (classNames.length) {
      document.body.setAttribute('class', classNames.join(' '))
    } else {
      document.body.removeAttribute('class')
    }
  }

  componentDidMount() {
    this.update()
  }

  render() {
    return (
      <div style={{fontSize: '0.8em'}}>
      <div>
        <input 
          ref={this.darkMode}
          defaultChecked={false}
          type="checkbox"
          onChange={this.update}/>
        Dark Mode
      </div>
      <div>
        <input 
          ref={this.debugView}
          defaultChecked={false}
          type="checkbox"
          onChange={this.update}/>
        Layout on Hover
      </div>
      </div>
    )
  }
}

export default GUImode
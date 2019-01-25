import React from 'react'
import { RenderElement } from '../../renderMethods'
import styles from './styles.module.css'
import { parseFunction, calcParametric } from '../../renderMethods/special/GraphParametric'

class GraphMaker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'standard',
      standard: 'x',
      inverse: 'y',
      parametricX: 't',
      parametricY: 't',
      x0: -10,
      x1: 10,
      y0: -10,
      y1: 10,
      t0: -10,
      t1: 10,
      step: 0.1,
      height: 1.5,
      autoDomain: 'auto',
      autoSize: 'auto',
    }
  }

  updateMode = evt => this.setState({mode: evt.target.value})
  updateStandard = evt => this.setState({standard: evt.target.value})
  updateInverse = evt => this.setState({inverse: evt.target.value})
  updateParametricX = evt => this.setState({parametricX: evt.target.value})
  updateParametricY = evt => this.setState({parametricY: evt.target.value})
  updateX0 = evt => this.setState({x0: +evt.target.value})
  updateX1 = evt => this.setState({x1: +evt.target.value})
  updateY0 = evt => this.setState({y0: +evt.target.value})
  updateY1 = evt => this.setState({y1: +evt.target.value})
  updateT0 = evt => this.setState({t0: +evt.target.value})
  updateT1 = evt => this.setState({t1: +evt.target.value})
  updateStep = evt => this.setState({step: evt.target.value})
  updateHeight = evt => this.setState({height: evt.target.value})
  updateAutoDomain = evt => this.setState({autoDomain: evt.target.value})
  updateAutoSize = evt => this.setState({autoSize: evt.target.value})

  renderMode() {
    return (
      <select value={this.state.mode}
        onChange={this.updateMode}
      >
        <option value='standard' title="y is a function of x">Standard</option>
        <option value='inverse' title="x is a function of y">Inverse</option>
        <option value='parametric' title="x and y are functions of t">Parametric</option>
      </select>
    )
  }

  renderGridInputs() {
    return (
      <>
      <table>
        <tbody>
          <tr>
            <th /><th>Min</th><th>Max</th>
          </tr>
          <tr>
            <td>x</td>
            <td><input type="number" value={this.state.x0} onChange={this.updateX0} /></td>
            <td><input type="number" value={this.state.x1} onChange={this.updateX1} /></td>
          </tr>
          <tr>
            <td>y</td>
            <td><input type="number" value={this.state.y0} onChange={this.updateY0} /></td>
            <td><input type="number" value={this.state.y1} onChange={this.updateY1} /></td>
          </tr>
        </tbody>
      </table>
      </>
    )
  }

  renderInputs() {
    if (this.state.mode === 'standard') {
      return (
        <table>
          <tbody>
            <tr>
              <td>y = </td>
              <td><textarea value={this.state.standard} onChange={this.updateStandard}/></td> 
            </tr>
          </tbody>
        </table>
      )
    }
    if (this.state.mode === 'inverse') {
      return (
        <table>
          <tbody>
            <tr>
              <td>x = </td>
              <td><textarea value={this.state.inverse} onChange={this.updateInverse}/></td> 
            </tr>
          </tbody>
        </table>
      )
    }
    if (this.state.mode === 'parametric') {
      return (
        <table>
          <tbody>
            <tr>
              <td>x = </td>
              <td><textarea value={this.state.parametricX} onChange={this.updateParametricX}/></td>
            </tr>
            <tr>
              <td>y = </td>
              <td><textarea value={this.state.parametricY} onChange={this.updateParametricY}/></td>
            </tr>
          </tbody>
        </table>
      )
    }
  }


  renderDomainInput() {
    return (
      <>
      Step:
      <input type="number" 
        step={0.01}
        value={this.state.step} 
        onChange={this.updateStep}
        min={0}
      /><br/>
        Domain: 
        {this.state.mode !== 'parametric' ? (
          <select value={this.state.autoDomain} onChange={this.updateAutoDomain}>
            <option value='auto'>Auto</option>
            <option value='custom'>Custom</option>
          </select>
        ) : <br/>}
        {(this.state.autoDomain === 'custom' || this.state.mode === 'parametric') ? (
          <div>
          <input type="number" value={this.state.t0} onChange={this.updateT0} />
          to 
          <input type="number" value={this.state.t1} onChange={this.updateT1} />
          </div>
        ) : null }        
      </>
    )
  }

  renderHeightInput() {
    return (
      <>
      Height:
      <select value={this.state.autoSize} onChange={this.updateAutoSize}>
        <option value='auto'>Auto</option>
        <option value='custom'>Custom</option>
      </select>
      {this.state.autoSize === 'custom' ? (
        <>
          <br/>
          Inches:
          <input type="number"
            step={0.1}
            value={this.state.height}
            onChange={this.updateHeight}
            min={0}
          />
        </>
      ) : null}
      </>
    )
  }

  graphSize() {
    return {
      start: [this.state.x0, this.state.y0], 
      stop: [this.state.x1, this.state.y1],
    }
  }

  getDomain() {
    if (this.state.mode === 'parametric' || this.state.autoDomain === 'custom') {
      return [this.state.t0, this.state.t1]
    }
    if (this.state.mode === 'standard') {
      return [this.state.x0, this.state.x1]
    }
    if (this.state.mode === 'inverse') {
      return [this.state.y0, this.state.y1]
    }
  }

  getFunction() {
    const step = this.state.step > 0 ? +this.state.step : 0.002
    const domain = this.getDomain()
    switch(this.state.mode) {
      case 'standard':
        const ymap = parseFunction(this.state.standard)
        if (ymap) {
          const paths = calcParametric(t=>t, x=>ymap({x}), domain, step)
          return paths.map(p => ['Path', {points: p}])
        }
        return null

      case 'inverse':
        const xmap = parseFunction(this.state.inverse)
        if (xmap) {
          const paths = calcParametric(y=>xmap({y}), t=>t, domain, step)
          return paths.map(p => ['Path', {points: p}])
        }
        return null
      case 'parametric':
        const xpmap = parseFunction(this.state.parametricX)
        const ypmap = parseFunction(this.state.parametricY)
        if (xpmap && ypmap) {
          const paths = calcParametric(t=>xpmap({t}), t=>ypmap({t}), domain, step)
          return paths.map(p => ['Path', {points: p}])
        }
        return null
      default:
        return null
    }
  }

  getData() {
    let props = {
      ...this.graphSize(), 
      padding: 0.1, 
    }
    if (this.state.autoSize === 'custom') {
      props.height = this.state.height + 'in'
    }
    const paths = this.getFunction()
    if (paths) {
      return ['CartesianPlane', props, ...paths]
    }
    return ['CartesianPlane', props]
  }

  onSubmit = () => {
    this.props.onSubmit({type: 'graph', data: this.getData()})
    this.props.onRequestClose()
  }

  render() {
    return (
      <div className={styles.GraphMaker}>
        <div className={styles.GraphMakerHeading}>
          <button onClick={this.onSubmit}>Apply</button>
          <button onClick={this.props.onRequestClose}>Cancel</button>
        </div>
        <div className={styles.GraphMakerBody}>
          <div className={styles.GraphMakerInput}>
            <div style={{margin: '3mm'}}>
              Graphing Mode {this.renderMode()}
              {this.renderInputs()}
            </div>
            <div style={{margin: '3mm'}}>
            {this.renderDomainInput()}
            </div>
            <div style={{margin: '3mm'}}>
              {this.renderGridInputs()}
            </div>
            <div>
              {this.renderHeightInput()}
            </div>
          </div>
          <div className={styles.GraphMakerPreview}>
            <div className='document preview-area'>
              <RenderElement content={{type: 'graph', data: this.getData()}} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default GraphMaker
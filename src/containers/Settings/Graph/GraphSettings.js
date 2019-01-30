import React from 'react'
import { connect } from 'react-redux'
import { resetGraphStyle } from '../../../actions/style'
import {
  PlotPathColor, PlotPathWidth, Plot2PathColor, PlotColorSwap,
  GeomPathColor, GeomPathWidth,
  AsymptoteColor, AsymptoteWidth,
  AxisColor, AxisWidth,
  GridColor, GridWidth,
  ShadedRegionOpacity,
} from './GraphStyle'
import { PreviewXYPlot, PreviewGeom } from './GraphPreview'

import styles from './styles.module.css'


class GraphSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {style: 'xy-plot'}
  }

  changeStyle = evt => {
    this.setState({style: evt.target.value})
  }

  resetToDefaults = () => {
   this.props.resetGraphStyle()
  }

  renderPreview() {
    if (this.state.style === 'geom') {
      return <PreviewGeom />
    }
    return <PreviewXYPlot />
  }

  renderStyleSettings() {
    if (this.state.style === 'xy-plot') {
      return (
        <>
          <tr>
            <td>Primary</td>
            <td><PlotPathColor/></td>
            <td><PlotPathWidth/></td>
          </tr>
          <tr>
            <td>Secondary</td>
            <td><Plot2PathColor/></td>
            <td><PlotColorSwap>Swap Colors</PlotColorSwap></td>
          </tr>
          <tr>
            <td>Asymptote</td>
            <td><AsymptoteColor/></td>
            <td><AsymptoteWidth/></td>
          </tr>
          <tr>
            <td colSpan='2'>Fill</td>
            <td><ShadedRegionOpacity /></td>
          </tr>
        </>
      )
    }
    if (this.state.style === 'geom') {
      return (
        <>
          <tr>
            <td>Path</td>
            <td><GeomPathColor/></td>
            <td><GeomPathWidth/></td>
          </tr>
        </>
      )
    }
    return null
  }

  render() {
    return (
      <div className={styles.Layout}>
        <div className={styles.Settings}>
          <h3>Graph Style</h3>
          <button onClick={this.resetToDefaults}>Reset to Defaults</button>
          
          <table className={styles.SettingTable}>

            <thead>
              <tr>
                <th></th>
                <th>Color</th>
                <th>Thickness</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Axis</td>
                <td><AxisColor/></td>
                <td><AxisWidth/></td>
              </tr>

              <tr>
                <td>Grid</td>
                <td><GridColor/></td>
                <td><GridWidth/></td>
              </tr>
              <tr>
                <td colSpan='3' >
                  <div style={{margin: '5mm 0'}}>
                    <span>Editing style for </span>
                    <select onChange={this.changeStyle} value={this.state.style}>
                      <option value='geom'>geometry</option>
                      <option value='xy-plot'>xy-plot</option>
                    </select>
                  </div>
                </td>
              </tr>

              {this.renderStyleSettings()}
            </tbody>

          </table>
        </div>
        <div className={styles.Preview}>
          <div className='document preview-area'>
            {this.renderPreview()}
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  resetGraphStyle: () => dispatch(resetGraphStyle()),
})

export default connect(null, mapDispatchToProps)(GraphSettings)
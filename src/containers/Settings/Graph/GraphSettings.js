import React from 'react'
import { connect } from 'react-redux'
import { resetGraphStyle } from '../../../actions/style'
import {
  PlotPathColor, PlotPathWidth,
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
          <div>
            <div>Graph</div>
            <div><PlotPathColor/></div>
            <div><PlotPathWidth/></div>
          </div>
          <div>
            <div>Asymptote</div>
            <div><AsymptoteColor/></div>
            <div><AsymptoteWidth/></div>
          </div>
          <div>
            <div>Fill Opacity</div>
            <div><ShadedRegionOpacity /></div>
          </div>
        </>
      )
    }
    if (this.state.style === 'geom') {
      return (
        <>
          <div>
            <div>Objects</div>
            <div><GeomPathColor/></div>
            <div><GeomPathWidth/></div>
          </div>
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
          
          <div className={styles.SettingTable}>

            <div>
              <div></div>
              <div>Color</div>
              <div>Thickness</div>
            </div>
            <div>
              <div>Axis</div>
              <div><AxisColor/></div>
              <div><AxisWidth/></div>
            </div>

            <div>
              <div>Grid</div>
              <div><GridColor/></div>
              <div><GridWidth/></div>
            </div>
            <div className={styles.StyleSetting}>
              Style:
              <select onChange={this.changeStyle} value={this.state.style}>
                <option value='xy-plot'>xy-plot</option>
                <option value='geom'>geometry</option>
              </select>
            </div>

            {this.renderStyleSettings()}
          </div>

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
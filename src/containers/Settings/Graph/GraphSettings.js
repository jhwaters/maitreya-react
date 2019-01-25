import React from 'react'
import { connect } from 'react-redux'
import { updateGraphStyle } from '../../../actions/style'
import {
  PathColor, AsymptoteColor, AxisColor, GridColor,
  PathWidth, AxisWidth, GridWidth
} from './GraphStyle'
import GraphPreview from './GraphPreview'


class GraphSettings extends React.Component {

  static defaults = [
    ['pathColor', '--plot-path-color', '#cc0077'],
    ['pathWidth', '--plot-path-width', '0.5mm'],
    ['asymptoteColor', '--plot-asymptote-color', '#555555'],
    ['gridColor', '--plot-grid-color', '#8899aa'],
    ['gridWidth', '--plot-grid-width', '0.2mm'],
    ['axisWidth', '--plot-axis-width', '0.4mm'],
    ['axisColor', '--plot-axis-color', '#222222'],
  ]

  resetToDefaults = () => {
    const updates = {}
    for (const d of this.constructor.defaults) {
      document.body.style.setProperty(d[1], d[2])
      updates[d[0]] = d[2]
    }
    this.props.updateGraphStyle(updates)
  }

  render() {
    return (
      <>
        <button onClick={this.resetToDefaults}>Reset to Defaults</button>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
            
            <div>
              <PathColor/>
              Graph Color
            </div>
            <div>
              <AsymptoteColor/>
              Asymptote Color
            </div>
            <div>
              <AxisColor/>
              Axis Color
            </div>
            <div>
              <GridColor/>
              Grid Color
            </div>
            <div>
              <PathWidth/>
              Graph Thickness
            </div>
            <div>
              <AxisWidth/>
              Axis Thickness
            </div>
            <div>
              <GridWidth/>
              Grid Thickness
            </div>

          </div>
          <div style={{margin: '3mm'}}>
            <GraphPreview />
          </div>
        </div>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updateGraphStyle: (props) => dispatch(updateGraphStyle(props)),
})

export default connect(null, mapDispatchToProps)(GraphSettings)
import { Terminal, NonTerminal } from './renderTypes'
import { JsonRenderer } from './JsonRenderer'
import { parseJson } from './parseJson'
import EditJson from './editJson'

class BaseRenderer extends JsonRenderer {
  handleString(str) {
    return this.unhandled.Text({children: [str]})
  }
}


const Renderer = new BaseRenderer(NonTerminal, Terminal)

const renderJson = json => Renderer.render(json)

const RenderJson = props => renderJson(props.json)

export {
  parseJson, renderJson, 
  RenderJson, EditJson,
}
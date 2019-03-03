import { parseJson, renderJson } from './renderJson'
import EditJson from './editJson'

const RenderJson = props => {
  return renderJson(props.json)
}

export {
  parseJson, 
  renderJson, 
  RenderJson,
  EditJson,
}
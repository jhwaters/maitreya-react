import { parseJson, renderJson } from './renderJson'
import EditJson from './editJson'

export const RenderJson = props => {
  return renderJson(props.json)
}

export {
  parseJson, 
  renderJson, 
  EditJson,
}
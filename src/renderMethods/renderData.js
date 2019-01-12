import renderHtml from './renderHtml'
import renderText from './renderText'
import renderMarkdown from './renderMarkdown'
import renderJsonML from './renderJsonML'
//import renderVega from './renderVega'


const renderData = function(data, type, options={}) {
  switch (type) {
    case 'text': return renderText(data, options)
    case 'jsonml': return renderJsonML(data, options)
    case 'html': return renderHtml(data, options)
    case 'markdown': return renderMarkdown(data, options)
    //case 'vega-lite': return renderVega(data, options)
    default:
      console.log('no rendering method for ', type)
      console.log({type: type, data: data})
      return JSON.stringify(data)   
  }
}


export default renderData
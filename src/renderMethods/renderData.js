import renderHtml from './renderHtml'
import renderText from './renderText'
import renderMarkdown from './renderMarkdown'
import renderJsonML from './renderJsonML'
import { renderVegaLite } from './renderVega'

const renderAnswerChoices = (data, options) => renderJsonML(
  ['ol', {className: 'AnswerChoices', type: 'a'}, 
  ...data.map(d => ['li', {className: 'AnswerChoice'}, d])], 
  options,
);

const renderData = function(data, type, options={}) {
  switch (type) {
    case 'text': return renderText(data, options)
    case 'answerchoices': return renderAnswerChoices(data, options)
    case 'jsonml': return renderJsonML(data, options)
    case 'html': return renderHtml(data, options)
    case 'markdown': return renderMarkdown(data, options)
    case 'vega-lite': return renderVegaLite(data, options['vega-lite'] | {})
    default:
      console.log('no rendering method for ', type)
      console.log({type: type, data: data})
      return JSON.stringify(data)   
  }
}


export default renderData
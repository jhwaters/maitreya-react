export const parseJson = function(json) {
  const [ type, props, ...children ] = json
  if (props) {
    if (props.constructor.name === 'Object') {
      return { type, props, children}
    }
    return { type, props: {}, children: [ props, ...children ] }
  }
  return { type, props: {}, children }
}
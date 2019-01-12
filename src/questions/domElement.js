function tryChild(c) {
  try {
    return jsonml(c)
  } catch(e) {
    return c
  }
}

function jsonml(thing) {
  return [thing._type(), thing._props(), ...thing._children().map(tryChild)]
}

class DomElement {
  constructor(type, props, ...children) {
    this.type = type
    if (props) {
      if (props.constructor === Object) {
        this.props = props
        this.children = []
      } else {
        this.props = {}
        this.children = [props]
      }
    }
    this.children = this.children.concat(children)
  }

  _type() { return this.type }
  _props() { return this.props }
  _children() { return this.children }

  jsonml() {
    return jsonml(this)
  }

  toJsonML() {
    return jsonml(this)
  }
}

export {
  DomElement
}
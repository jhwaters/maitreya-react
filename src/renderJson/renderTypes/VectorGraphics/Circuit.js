const dx = 1, dy = 1

const circuitSwitch = label => ['SWITCH', {w: 1, h: 1}, label]

const circuitAnd = (...args) => {
  let w = dx * (args.length - 1)
  for (const a of args) {
    w += a[1].w
  }
  const h = Math.max(...args.map(a => a[1].h))
  return ['AND', {w, h}, ...args]
}

const circuitOr = (...args) => {
  const w = Math.max(args.map(a => a[1].w)) + 2*dx
  let h = -1
  for (const a of args) {
    h += a[1].h + 1
  }
  return ['OR', {w, h}, ...args]
}

const RenderOr = props => {
  const {x, y, w, h} = props
}
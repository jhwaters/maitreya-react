
const AND = function(...p) {
  if (p.length === 1) {
    return p[0]
  } else {
    return p[0] && AND(p.slice(1))
  }
}

const OR = function(...p) {
  if (p.length === 1) {
    return p[0]
  } else {
    return p[0] || AND(p.slice(1))
  }
}

const NOT = function(p) {
  return !p
}

const IFTHEN = function(p, q) {
  return !p || q
}


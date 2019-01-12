

const test = function(f, x, y) {
  const r = f({x: x, y: y})
  if (r > 0) { return 'gt' }
  if (r < 0) { return 'lt'}
  return 'eq'
}

const contourPresent = function(f, x, y, d) {
  const p = d / 30
  let q, r, s, t
  try {
    q = test(f, x, y)
  } catch(e) {
    q = test(f, x+p, y+p)
  }
  
  try {
    r = test(f, x+d, y)
  } catch(e) {
    r = test(f, x+d-p, y+p)
  }
  if (r !== q) { return true }

  try {
    s = test(f, x+d, y+d)
  } catch(e) {
    s = test(f, x+d-p, y+d-p)
  }
  if (s !== q) { return true }

  try {
    t = test(f, x, y+d)
  } catch(e) {
    t = test(f, x+p, y+d-p)
  }

  return false
}


const subdivide = function(f, x, y, d, depth, searchDepth) {
  const hd = d / 2
  const props = [hd, depth-1, searchDepth-1]
  return [
    ...createTree(f, x, y, ...props),
    ...createTree(f, x+hd, y, ...props),
    ...createTree(f, x+hd, y+hd, ...props),
    ...createTree(f, x, y+hd, ...props)
  ]
}

const createTree = function(f, x, y, d, depth, searchDepth) {
  if (searchDepth > 0) {
    return subdivide(f, x, y, d, depth, searchDepth)
  } else {
    if (contourPresent(f, x, y, d)) {
      if (depth > 0) {
        return subdivide(f, x, y, d, depth, searchDepth)
      } else {
        return [{x: x+d/2, y: y+d/2}]
      }
    } else {
      return []
    }
  }
}


class QuadTree {
	constructor({left, right, x=-10, y=-10, d=20, depth=10, searchDepth=6}) {
    this.f = p => left(p) - right(p)
		this.x = x
		this.y = y
		this.d = d
		this.depth = depth
		this.searchDepth = searchDepth
	}

	calcPoints() {
		return createTree(this.f, this.x, this.y, this.d, this.depth, this.searchDepth)
	}
}

export {
  QuadTree,
  createTree,
}
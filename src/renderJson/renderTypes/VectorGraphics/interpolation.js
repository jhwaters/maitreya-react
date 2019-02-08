class PathMaker {

  constructor(points) {
    if (typeof points === 'string') {
      this.points = points.split(' ').map(p => {
        const [a,b] = p.split(',')
        return {x: +a, y: +b}
      })
    }
    else if (Array.isArray(points)) {
      this.points = points.map(p => ({x: p[0], y: p[1]}))
    }
    else {
      this.points = points
    }
  }

}

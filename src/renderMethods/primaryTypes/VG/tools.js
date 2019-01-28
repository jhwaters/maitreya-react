
export function pathFromPoints(points) {
  const inverse = false
  if (Array.isArray(points[0])) {
    if (inverse) {
      return `M${points.map(p => `${p[1]},${p[0]}`).join('L')}`
    }
    return `M${points.map(p => `${p[0]},${p[1]}`).join('L')}`
  }
  if (inverse) {
    return `M${points.map(p => `${p.y},${p.x}`).join('L')}`
  }
  return `M${points.map(p => `${p.x},${p.y}`).join('L')}`
}
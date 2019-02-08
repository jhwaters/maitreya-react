export function makesrange(min, max, step=1, anchor=0) {
	if (anchor === undefined) {
		anchor = min;
	} else if (anchor < min) {
		anchor = min;
	} else if (anchor > max) {
		anchor = max;
	}
	let r = [anchor,];
	let v = anchor - step;
	while (v >= min) {
			r.splice(0, 0, v);
			v -= step;
	}
	v = anchor + step;
	while (v <= max) {
			r.push(v);
			v += step;
	}
	return r;
}

export function polylineFromPoints(points) {
	if (typeof points === 'string') {
		return points
	}
	if (Array.isArray(points[0])) {
    return points.map(p => `${p[0]},${p[1]}`).join(' ')
  }
  return points.map(p => `${p.x},${p.y}`).join(' ')
}

export function pathFromPoints(points) {
  if (Array.isArray(points[0])) {
    return `M${points.map(p => `${p[0]},${p[1]}`).join('L')}`
  }
  return `M${points.map(p => `${p.x},${p.y}`).join('L')}`
}

export function interpolatePathCubicH(points) {
  const pts = Array.isArray(points[0]) ? points.map(p => ({x: p[0], y: p[1]})) : points
  let d = `${pts[0].x},${pts[0].y}`
  let prev = pts[0]
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    const x1 = (2*prev.x + p.x) / 3
    const x2 = (prev.x + 2*p.x) / 3
    d += ` C ${x1},${prev.y} ${x2},${p.y} ${p.x},${p.y}`
    prev = p
  }
  return d
}
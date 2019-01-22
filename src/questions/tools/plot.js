import { DomElement } from './domElement'
import { createTree } from './QuadTree'


function makesrange(min, max, step=1, anchor) {
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


export class SvgElement extends DomElement {
	add(elem) {
		this.children.push(elem)
	}
}

export class Canvas extends SvgElement {
	constructor(x0, y0, x1, y1, props={}, ...children) {
		super('svg', props, ...children)
		this.x0 = x0
		this.x1 = x1
		this.y0 = y0
		this.y1 = y1
		this.extra = 0.2
	}

	w() { return this.x1 - this.x0 }

	h() { return this.y1 - this.y0 }

	viewBox() {
		const a = this.x0 - this.extra
		const b = this.y0 - this.extra
		const c = this.w() + 2*this.extra
		const d = this.h() + 2*this.extra
		return `${a} ${b} ${c} ${d}`
	}

	_props() {
		return {...this.props, viewBox: this.viewBox()}
	}
}

export class Layer extends SvgElement {
	constructor(props={}, children=[]) {
		super('g', props, ...children)
	}
}

export class CartesianPlane extends Canvas {

	viewBox() {
		const a = this.x0 - this.extra
		const b = -this.y1 - this.extra
		const c = this.w() + 2*this.extra
		const d = this.h() + 2*this.extra
		return `${a} ${b} ${c} ${d}`
	}

	_children() {
		return [new SvgElement('g', {transform: 'scale(1,-1)'}, ...this.children)]
	}

	addGrid() {
		this.children = [makeGrid(this.x0, this.y0, this.x1, this.y1), ...this.children]
	}
}

class Grid extends SvgElement {
	constructor(values, span=[-10,10], axisAt=0, gridStyle={}, axisStyle={}, props={}) {
		super('g', props)
		this.values = values
		this.span = span
		this.axisAt = axisAt
		this.gridStyle = Object.assign({}, {
			stroke: 'blue', 
			strokeWidth: '0.05',
			strokeOpacity: '0.3',
		}, gridStyle)
		this.axisStyle = Object.assign({}, {
			stroke: 'black',
			strokeWidth: '0.1',
			strokeOpacity: '1',
		}, axisStyle)
	}

	makeLine(v) {
		let props = {d: this.linePath(v)}
		if (v === this.axisAt) {
			props['style'] = this.axisStyle
		}
		return ['path', props, []]
	}

	_props() {
		return {...this.props, style: this.gridStyle}
	}

	_children() {
		return this.values.map(v => this.makeLine(v))
	}
}

class GridX extends Grid {
	linePath(v) {
		const y0 = this.span[0]
		const y1 = this.span[1]
		return `M${v},${y0}V${y1}`
	}
}

class GridY extends Grid {
	linePath(v) {
		const x0 = this.span[0]
		const x1 = this.span[1]
		return `M${x0},${v}H${x1}`
	}
}

function makeGrid(x0, y0, x1, y1) {
	return new Layer({}, [
		new GridX(makesrange(x0, x1, 1, 0), [y0, y1]),
		new GridY(makesrange(y0, x1, 1, 0), [x0, x1])
	])
}

export class Path extends SvgElement {
	constructor(points, props={}, roundTo=6) {
		super('path', props, [])
		this.points = points
		this.children = []
		this.roundTo = roundTo
	}

	d() {
		return 'M' + this.points.map(p => `${p[0]},${p[1]}`).join('L')
	}

	_props() {
		return {...this.props, d: this.d()}
	}
}


class Plot extends SvgElement {
	constructor({
		xRange=[-10,10],
		yRange=[-10,10],
		step=0.05,
		maxD2=0.06,
		roundTo=6,
		style={
			stroke: 'rgb(200,0,100)',
			strokeOpacity: '0.8',
			strokeWidth: '0.2',
			fill: 'none',
		}
	}={}) {
		super('g', {}, [])
		this.xRange = xRange
		this.yRange = yRange
		this.step = step
		this.maxD2 = maxD2
		this.roundTo = roundTo
		this.style = style
	}

	_props() {
		return {style: this.style}
	}
}

export class Parametric extends Plot {
	constructor({ymap = t => t, xmap = t => t, domain=[-10, 10]}={}, props={}) {
		super(props)
		this.ymap = ymap
		this.xmap = xmap
		this.domain = domain
	}

	inRange(pt) {
		return (
			this.xRange[0] <= pt[0] 
			&& this.xRange[1] >= pt[0]
			&& this.yRange[0] <= pt[1]
			&& this.yRange[1] >= pt[1]
		)
	}

	tryEval(t) {
		try {
			const y = this.ymap(t)
			const x = this.xmap(t)
			return [x, y]
		} catch(e) {
			return 'undefined'
		}
	}

	fill(t0, p0, t1, p1) {
		if (p0 === 'undefined') {
			if (p1 === 'undefined') {
				return []
			} else {
				let p = 'undefined'
				let t = t0
				while (p === 'undefined' && t < t1) {
					t += 0.000001
					p = this.tryEval(t)
				}
				if (p !== 'undefined' && t < t1) {
					return [p, ...this.fill(t, p, t1, p1)]
				} else {
					return []
				}
			}
		} else if (p1 === 'undefined') {
			let p = 'undefined'
			let t = t1
			while (p === 'undefined' && t > t0) {
				t -= 0.000001
				p = this.tryEval(t)
			}
			if (p !== 'undefined' && t > t0) {
				return [...this.fill(t0, p0, t, p), p]
			} else {
				return []
			}
		} else {
			const dx = p1[0] - p0[0]
			const dy = p1[1] - p0[1]
			if (dx * dx + dy * dy > this.maxD2) {
				const t = (t0 + t1) * 0.5
				const p = this.tryEval(t)
				return [...this.fill(t0, p0, t, p), ...this.fill(t, p, t1, p1)]
			} else {
				return []
			}
		}
	} 

	calculatePaths() {

		let t = this.domain[0]
		let p = this.tryEval(t)

		while (p === 'undefined' && t <= this.domain[1]) {
			t += this.step
			p = this.tryEval(t)
		}

		
		let points = [p]
		let t0 = t
		let p0 = p
		t += this.step

		while (t <= this.domain[1]) {
			p = this.tryEval(t)
			points = [...points, p0, ...this.fill(t0, p0, t, p)]
			t0 = t
			p0 = p
			t += this.step
		}

		let paths = []
		
		let i = 0
		let l = points.length

		while (i < l) {
			while (points[i] === 'undefined') {
				i += 1
				if (i >= l) { break }
			}
			if (i >= l) { break }
			let start = i
			while (points[i] !== 'undefined') {
				i += 1
				if (i >= l) { break }
			}
			let path = points.slice(start, i)
			paths.push(path)
		}

		return paths
	}

	_children() {
		const paths = this.calculatePaths()
		let result = []
		for (const pts of paths) {
			if (pts.length > 0) {
				result.push(new Path(pts, this.roundTo))
			}
		}
		return result
	}
}


export class Piecewise extends Plot {
	constructor(pieces, props) {
		/*
			pieces should be objects with ymap and domain, e.g. 
			pieces = [
				{ ymap: x => x^2, domain: [-10,1] },
				{ ymap: x => 3*(x-1) + 1, domain: [1,10] }
			]
		*/
		super(props)
		this.pieces = pieces		
	}

	_children() {
		let children = []
		for (const {ymap, domain} of this.pieces) {
			const pieceprops = Object.assign({}, 
				this.props, 
				{ ymap: ymap, domain: domain }
			)
			children.push(new Parametric(pieceprops, {style: {}}))
		}
		return children
	}
}


export class Rational extends Plot {
	constructor(rationalProps, props={}) {
		super(props)
		this.roots = rationalProps.roots || []
		this.holes = rationalProps.holes || []
		this.vas = rationalProps.vas || []
		this.domain = rationalProps.domain || [-10,10]
	}

	f(x) {
		let den = 1
		for (const r of this.vas) {
			if (r === x) {
				return 'undefined'
			}
			den *= (x - r)
		}
		let num = 1
		for (const r of this.roots) {
			num *= (x - r)
		}
		return num / den
	}

	_plotFunction() {
		let sortedDiscontinuities = []
		const start = this.domain[0]
		const stop = this.domain[1]
		for (const v of [...this.vas].sort((a, b) => a - b)) {
			if (v > this.domain[0] && v < this.domain[1]) {
				sortedDiscontinuities.push(v)
			}
		}

		const xvals = [start, ...sortedDiscontinuities, stop]

		let domains = []
		for (let i = 1; i < xvals.length; i++) {
			domains.push( [xvals[i-1]+0.00001, xvals[i]-0.00001] )
		}
		
		const piecemap = d => ({ ymap: x => this.f(x), domain: d })
		return [new Piecewise(domains.map(piecemap), this.props)]
	}

	_plotVerticalAsymptotes() {
		
		const asymptoteStyle = {
			stroke: '#555',
			strokeOpacity: '0.5',
			strokeWidth: '0.2',
			strokeDasharray: "0.7 0.2",
		}

		let asyms = []
		for (const v of this.vas) {
			if (v >= this.xRange[0] && v <= this.xRange[1]) {
				asyms.push(new Path([[v, this.yRange[0]], [v, this.yRange[1]]]))
			}
		}

		return [new Layer({style: asymptoteStyle}, asyms)]
	}

	_plotHoles() {
		const holeStyle = {
			fill: 'white',
		}

		let holes = []
		const r = 0.25
		for (const x of this.holes) {
			const y = this.f(x)
			holes.push(new SvgElement('circle', {cx: x, cy: y, r: r, style: holeStyle}))
		}
		return holes
	}

	_plotRoots() {
		//const rootStyle = {}
		let roots = []
		const r = 0.1
		for (const x of this.roots) {
			const y = this.f(x)
			roots.push(new SvgElement('circle', {cx: x, cy: y, r: r}))
		}
		return roots
	}

	_children() {
		return [
			...this._plotVerticalAsymptotes(), 
			...this._plotFunction(), 
			...this._plotRoots(), 
			...this._plotHoles(),
		]
	}
}

const defaultMarker = (p) => new SvgElement('circle', {cx: p.x, cy: p.y, r: '0.1'})

export class QuadTreePlot extends SvgElement {
	constructor(quadtreeprops, {marker=defaultMarker, style={fill: 'rgba(200,0,100,0.6)'}}={}) {
		super('g', {style: style})
		this.marker = marker
		this.quadtreeprops = quadtreeprops
	}

	_type() { return 'g' }
	_props() { return this.props }
	_children() {
		const {f, x, y, d, depth, searchDepth} = this.quadtreeprops
		const points = createTree(f, x, y, d, depth, searchDepth)
		console.log(points)
		return [...points.map(p => this.marker(p))]
	}
}

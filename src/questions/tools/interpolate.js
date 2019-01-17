
export function createInterpolant(points) {
  let pts = [...points]
  pts.sort((a, b) => +a.x < +b.x)
  const xs = pts.map(p => +p.x)
  const ys = pts.map(p => +p.y)
  let dxs = []
  let dys = []
  let ms = []
  for (let i = 1; i < xs.length; i++) {
    const dx = xs[i] - xs[i-1]
    const dy = ys[i] - ys[i-1]
    dxs.push(dx)
    dys.push(dy)
    ms.push(dy / dx)
  }

  let cls = [ms[0]]
  for (let i = 0; i < dxs.length - 1; i++) {
    const m = ms[i]
    const mNext = ms[i+1]
    if (m*mNext <= 0) {
      cls.push(0)
    } else {
      const dx_ = dxs[i]
      const dxNext = dxs[i+1]
      const common = dx_ + dxNext
      cls.push(3*common / ((common + dxNext)/m + (common + dx_)/mNext))
    }
  }
  cls.push(ms[ms.length-1])

  let c2s = [], c3s = []
  for (let i = 0; i < cls.length-1; i++) {
    let cl = cls[i], m_ = ms[i], invDx = 1/dxs[i], common_ = cl + cls[i+1] - m_ - m_
    c2s.push((m_ - cl - common_)*invDx)
    c3s.push(common_*invDx*invDx)
  }

  const f = function(x) {
    let i = xs.length - 1;
    if (x === xs[i]) {
      return ys[i];
    }
    let low = 0, mid, high = c3s.length - 1;
    while (low < high) {
      mid = Math.floor(0.5 * (low + high))
      let xHere = xs[mid];
      if (xHere < x) {
        low = mid+1;
      } else if (xHere > x) {
        high = mid - 1;
      } else {
        return ys[mid];
      }
      i = Math.max(0, high);
      let diff = x - xs[i], diffSq = diff * diff;
      return ys[i] + cls[i]*diff + c2s[i]*diffSq + c3s[i]*diff*diffSq
    }
  }
  return f
}
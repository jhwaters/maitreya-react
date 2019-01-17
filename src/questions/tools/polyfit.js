import math from 'mathjs'

function polyfit3(a, b) {
  // both a and b are both length-3 arrays
  // a = [x1, f(x1), f'(x1)]
  // b = [x2, f(x2), f'(x2)]
  const x1 = a[0]
  const x2 = b[0]
  const m = [
    [1, x1, x1*x1, x1*x1*x1]
    [1, x2, x2*x2, x2*x2*x2],
    [0, 1, 2*x1, 3*x1*x1],
    [0, 1, 2*x2, 3*x2*x2],
  ]
  const c = [a[1], b[1], a[2], b[2]]
  return math.usolve(m, c)
}


/* python code
def fit_polynomial3(constraint1, constraint2):
    a, fa, f1a = constraint1
    b, fb, f1b = constraint2
    m = matrix([
        [1, a, a^2, a^3],
        [1, b, b^2, b^3],
        [0, 1, 2*a, 3*a^2],
        [0, 1, 2*b, 3*b^2],
    ])
    c = matrix([
        [fa],
        [fb],
        [f1a],
        [f1b]
    ])
    r = m.inverse() * c
    f(x) = sum(r[i][0]*x^i for i in xrange(4))
    return f

*/
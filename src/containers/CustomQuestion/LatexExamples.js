import React from 'react'
import { RenderElement } from '../../renderMethods'
import { TextPreview } from '../Settings/Font'
import styles from './styles.module.css'

const latexfmt = (...a) => String.raw(...a).replace('\\`', '`');

const examples = [
  'Text can be _italic_, __bold__, or ___both___.',
  'Or, *asterisks* will **accomplish** the ***same thing***.',
  latexfmt`f: x --> x^3^ - 3x^2^ + 9x - 8 doesn't look as nice as $$f: x \mapsto x^3 - 3x^2 + 9x - 8$$`,
  latexfmt`**Markdown:** a~n~ = a~n-1~ + 2n - 1 , **LaTeX:** $$a_n = a_{n-1} + 2n - 1$$`,
  latexfmt`There are two ways to write a fraction: $$\frac{24}{18} = {4 \over 3}$$`,
  latexfmt`$$V = \frac{4}{3}\pi r^3$$`,
  latexfmt`Use the quadratic formula to solve for $$x$$: $$$x = { -b \pm \sqrt{b^2 - 4ac} \over 2a }$$$`,
  latexfmt`Determine the measure of $$\angle{ABC}$$.`,
  latexfmt`$$\overline{AB}$$ is a line segment. $$\overleftrightarrow{CD}$$ is a line. $$\overrightarrow{EF}$$ is a ray.`,
  latexfmt`Prove that $$\triangle{ABC} \cong \triangle{DEF}$$.`,
  latexfmt`Given $$\vec{u} = \langle 3,5 \rangle$$ and $$\vec{v} = \langle -4, 9 \rangle$$, calculate $$\vec{u} \cdot \vec{v}$$.`,
  latexfmt`Remember that $$re^{i\theta} = r(\cos\theta + i\sin\theta)$$`,
  latexfmt`$$$\int_a^b f'(x)dx = f(b) - f(a)$$$`,
  latexfmt`$$$\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n$$$`,
  latexfmt`$$\lnot (p \land q) \iff (\lnot p \lor \lnot q)$$`,

  latexfmt`$$$
a_{n+1} = \left\{\begin{array}{r l}
  3a_n + 1 & \text{if $a_n$ is odd} \\
  a_n \div 2 & \text{if $a_n$ is even} \\
\end{array}\right.
$$$`,

  latexfmt`$$$
\left[\begin{array}{r r r}
   1 &   4 &  -9 \\
  16 & -25 &  66 \\
  49 &  64 & -81 \\
\end{array}\right]
$$$`,

  latexfmt`$$\forall\ \epsilon > 0, x \in \mathbb{R},\ \exists\ \delta > 0 \text{ such that } 0 < |x-c| < \delta \implies |f(x) - L| < \epsilon$$`,

]

/*
const RenderExample = ({text}) => {
  return (
    <>
    <pre style={{
      backgroundColor: 'rgba(255,255,200,0.5)',
      border: '1px solid black',
      padding: '0.5rem',
      overflowX: 'scroll',
    }}>{text}</pre>
    <span className='document' 
      style={{
      paddingLeft: '0.5rem',
      fontSize: '1em',
    }}>
      <RenderElement content={{type: 'text', data: text}}/>
    </span>
    </>
  )
}
*/

const RenderExample = ({text}) => (
  <tr>
    <TextPreview wrapperElement='td' defaultValue={text} />
  </tr>
)

const LatexExamples = (props) => {
  return (
    <div style={{padding: '3mm 0 3mm 0'}}>
    <div>
      <span>Examples:</span>
      <button onClick={props.onRequestClose}>Close</button>
    </div>
    <table className={styles.LatexExamples}>
      <tbody>
      {examples.map((s, i) => (
          <RenderExample key={`render-example-${i}`} text={s} />
      ))}
      </tbody>
    </table>
    <div>
      <button onClick={props.onRequestClose}>Close</button>
    </div>
    </div>
  )
}

export default LatexExamples
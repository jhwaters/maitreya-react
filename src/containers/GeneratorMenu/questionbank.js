import * as questionTypes from '../../questions'
const modules = questionTypes.modules

let questionBank = {}
for (const set of Object.keys(modules)) {
  for (const q in modules[set]) {
    const k = `${set}.${q}.${modules[set][q].register().name}`
    questionBank[k] = modules[set][q]
  }
}

for (const set of ['examples', 'tests']) {
  for (const q in questionTypes[set]) {
    const k = `_${set}.${q}.${questionTypes[set][q].register().name}`
    questionBank[k] = questionTypes[set][q]
  }
}

export default questionBank
import * as questionTypes from '../../questions'
const modules = questionTypes.modules


let questionBank = {}
for (const set of Object.keys(modules)) {
  for (const q in modules[set]) {
    const generator = modules[set][q]
    const k = `${set}.${q}`
    const {name, tags, description} = generator.register()
    questionBank[k] = {name, tags, description, generator}
  }
}

for (const set of ['examples', 'tests']) {
  for (const q in questionTypes[set]) {
    const generator = questionTypes[set][q]
    const k = `${set}.${q}`
    const {name, tags, description} = generator.register()
    questionBank[k] = {name: `_${set}:${name}`, tags, description, generator}
  }
}

export default questionBank
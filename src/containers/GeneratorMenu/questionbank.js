import * as questiontypes from '../../questions'

let questionBank = {}
for (const set of ['examplequestions', 'transformations', 'trigonometry', 'geometry']) {
  for (const q in questiontypes[set]) {
    const n = questiontypes[set][q].register().name
    questionBank[n] = questiontypes[set][q]
  }
}


for (const set of ['generatortests', 'picofermi']) {
  for (const q in questiontypes[set]) {
    const n = '_' + questiontypes[set][q].register().name
    questionBank[n] = questiontypes[set][q]
  }
}


export default questionBank
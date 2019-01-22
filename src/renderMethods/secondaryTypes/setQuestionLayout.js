import { includes, intersection, partition } from 'lodash'


function isStandardArea(areaName) {
  for (const a of ['instructions', 'question', 'diagram', 'answer']) {
    if (a === areaName) {
      return true
    }
  }
  return false
}

export const setGridAreas = function(areas) {
  const [standard, others] = partition(areas, isStandardArea)
  let rows

  if (standard.length === 4) {
    rows = [
      ['instructions', 'instructions'],
      ['question', 'question'],
    ]
    for (const a of others.sort()) {
      rows.push([a, a])
    }
    rows.push(['answer', 'diagram'])
  }

  else if (standard.length === 3) {
    rows = []
    if (intersection(standard, ['diagram', 'answer']).length === 2) {
      for (const a of ['instructions', 'question', ...others.sort()]) {
        if (includes(standard, a)) {
          rows.push([a, a])
        }
      }
      rows.push(['answer', 'diagram'])
    } else {
      if (others.length === 0) {
        for (const a of ['instructions', 'question', 'diagram', 'answer']) {
          if (includes(standard, a)) {
            rows.push([a])
          }
        }
      } else {
        for (const a of ['instructions', 'question']) {
          if (includes(standard, a)) {
            rows.push([a, a])
          }
        }
        if (includes(standard, 'diagram')) {
          for (const a of others.sort()) {
            rows.push([a, 'diagram'])
          }
        } else {
          for (const a of others.sort()) {
            rows.push([a, 'answer'])
          }
        }
      }
    }  
  } 

  else if (standard.length === 2) {
    rows = []
    if (intersection(standard, ['diagram', 'answer']).length === 2) {
      for (const a of others.sort()) {
        rows.push([a, a])
      }
      rows.push(['answerChoices', 'diagram'])
    } else if (intersection(standard, ['diagram', 'answer']).length === 1) {
      for (const a of ['instructions', 'question']) {
        if (includes(standard, a)) {
          rows.push([a, a])
        }
      }
      if (others.length > 0) {
        if (includes(standard, 'diagram')) {
          for (const a of others.sort()) {
            rows.push([a, 'diagram'])
          }
        } else {
          for (const a of others.sort()) {
            rows.push([a, 'answer'])
          }
        }
      } else {
        if (includes(standard, 'diagram')) {
          rows.push(['diagram', 'diagram'])
        } else {
          rows.push(['answer', 'answer'])
        }
      }
    } else {
      for (const a of ['instructions', 'question', ...others.sort()]) {
        rows.push([a])
      }
    }
  }

  else if (standard.length <= 1) {
    rows = []
    for (const a of ['intersection', 'question', ...others.sort(), 'diagram', 'answer']) {
      if (includes(standard, a)) {
        rows.push([a])
      }
    }
  }

  return rows.map(l => `"${l.join(' ')}"`).join(' ')
}
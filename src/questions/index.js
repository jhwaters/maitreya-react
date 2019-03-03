import * as geometry from './geometry'
import * as picofermi from './picofermi'
import * as polynomials from './polynomials'
import * as transformations from './transformations'
import * as trigonometry from './trigonometry'
import * as othergenerators from './othergenerators'

import * as simpleexamples from './simpleexamples'

import * as generatortests from './generatortests'


export const modules = {
  geometry, 
  picofermi,
  polynomials,
  othergenerators, 
  transformations,
  trigonometry,
}

export const tests = generatortests

export const examples = simpleexamples

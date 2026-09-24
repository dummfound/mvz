import fs from 'fs'
import path from 'path'

const dir = path.resolve('public/images/services')
const extract = (file) => fs.readFileSync(path.join(dir, file), 'utf8').match(/<path[^>]*>/)[0]

const pink1 = extract('brows-pink-1.svg')
const pink2 = extract('brows-pink-2.svg')
const main = extract('brows-main.svg')

const svg = [
  '<svg width="216" height="275" viewBox="0 0 216 275" fill="none" xmlns="http://www.w3.org/2000/svg">',
  `  <svg x="0" y="0" width="96" height="275" viewBox="0 0 96 275">${pink1}</svg>`,
  `  <svg x="64" y="93" width="152" height="182" viewBox="0 0 152 182">${pink2}</svg>`,
  `  <svg x="0" y="23" width="216" height="229" viewBox="0 0 216 229">${main}</svg>`,
  '</svg>',
].join('\n')

fs.writeFileSync(path.join(dir, 'brows-composite.svg'), svg)
console.log('brows-composite.svg written')

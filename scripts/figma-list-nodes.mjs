/**
 * Помогает найти node id для figma-export.config.js
 * FIGMA_ACCESS_TOKEN=... node scripts/figma-list-nodes.mjs
 */
import { FIGMA_FILE_KEY } from './figma-export.config.js'

const token = process.env.FIGMA_ACCESS_TOKEN
if (!token) {
  console.error('Задай FIGMA_ACCESS_TOKEN')
  process.exit(1)
}

const res = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}?depth=4`, {
  headers: { 'X-Figma-Token': token },
})

if (!res.ok) {
  console.error(await res.text())
  process.exit(1)
}

const data = await res.json()
const hits = []

function walk(node, path = '') {
  const name = node.name || ''
  const next = path ? `${path} / ${name}` : name
  const hasImage =
    node.fills?.some((f) => f.type === 'IMAGE') ||
    node.background?.some((f) => f.type === 'IMAGE')

  if (hasImage || /фото|photo|hero|команда|услуг|фон|bg|image/i.test(name)) {
    hits.push({ id: node.id, name: next, type: node.type })
  }

  node.children?.forEach((child) => walk(child, next))
}

walk(data.document)
hits.slice(0, 80).forEach((h) => console.log(`${h.id}\t[${h.type}]\t${h.name}`))
console.log(`\nВсего подходящих слоёв: ${hits.length}`)

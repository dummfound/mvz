import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FIGMA_EXPORTS, FIGMA_FILE_KEY } from './figma-export.config.js'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')
const token = process.env.FIGMA_ACCESS_TOKEN

if (!token) {
  console.error(`
Нужен токен Figma:
  1. Figma → Settings → Security → Personal access tokens
  2. PowerShell:
     $env:FIGMA_ACCESS_TOKEN="figd_..."
     npm run figma:export
`)
  process.exit(1)
}

const ids = FIGMA_EXPORTS.map((item) => item.nodeId).join(',')
const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`

const res = await fetch(url, {
  headers: { 'X-Figma-Token': token },
})

if (!res.ok) {
  console.error('Figma API error:', res.status, await res.text())
  process.exit(1)
}

const { images, err } = await res.json()
if (err) console.warn('Figma warnings:', err)

let ok = 0
for (const item of FIGMA_EXPORTS) {
  const imageUrl = images?.[item.nodeId]
  if (!imageUrl) {
    console.warn(`✗ ${item.label}: нет URL для ${item.nodeId}`)
    continue
  }

  const outPath = join(imagesDir, item.file)
  await mkdir(dirname(outPath), { recursive: true })

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) {
    console.warn(`✗ ${item.file}: download failed`)
    continue
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer())
  await writeFile(outPath, buffer)
  console.log(`✓ ${item.file} ← ${item.nodeId}`)
  ok += 1
}

console.log(`\nГотово: ${ok}/${FIGMA_EXPORTS.length} файлов в public/images/`)

import { glob } from "glob"
import path from 'path'
import fs from 'fs'

const ROOT_DIR = process.cwd()
const INDEX = path.join(ROOT_DIR, 'index.ts')

const interfaces = await glob('./types/**/*.interface.ts', {cwd: process.cwd()})
const enums = await glob('./types/**/*.enum.ts', {cwd: process.cwd()})
const constants = await glob('./types/**/*.constant.ts', {cwd: process.cwd()})


function exportCode(p) {
  const name = path.basename(p, '.ts')
  const dir = path.dirname(p)
  const relative = path.relative(ROOT_DIR, dir)
  const importPath = path.join(relative, name).replaceAll('\\', '/')
  return `export * from './${importPath}'`
}
function filter(p) {
  const name = path.basename(p, '.ts')
  if (name.startsWith("_")) return false
  return true
}
function sort(a, b) {
  return a.length - b.length
}

const enumImports = enums.filter(filter).map(exportCode).sort(sort)
const interfaceImports = interfaces.filter(filter).map(exportCode).sort(sort)
const constantImports = constants.filter(filter).map(exportCode).sort(sort)

const imports = [
  "/** ",
  " * This file is auto generated, do not modify directly.",
  " * @author CatsJuice",
  " */",
  "",
  "// Enums",
  ...enumImports, 
  "", 
  "// Interfaces",
  ...interfaceImports,
  "",
  "// Constants",
  ...constantImports,
]

fs.writeFileSync(INDEX, imports.join('\n'))
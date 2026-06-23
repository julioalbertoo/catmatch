// Genera lib/version.ts a partir de la versión de package.json.
// Se ejecuta automáticamente antes de `dev` y `build` (ver package.json).
const fs = require('fs')
const path = require('path')

const pkg = require(path.join(__dirname, '..', 'package.json'))
const out = path.join(__dirname, '..', 'lib', 'version.ts')

const content = `// Auto-generado por scripts/generate-version.js desde package.json
// NO editar manualmente

export const VERSION = 'v${pkg.version}';
`

fs.writeFileSync(out, content)
console.log(`lib/version.ts → v${pkg.version}`)

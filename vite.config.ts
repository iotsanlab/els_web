import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        try {

          const htaccessContent = fs.readFileSync('.htaccess', 'utf-8')
          fs.writeFileSync(path.resolve(__dirname, 'dist/.htaccess'), htaccessContent)
        } catch (error) {
          console.error('Error copying .htaccess file:', error)
        }
      }
    }
  ],
})

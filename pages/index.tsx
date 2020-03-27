import { promises as fs } from 'fs'
import { join } from 'path'

import App from '../src/app'

export async function getStaticProps () {
  const path = join(process.cwd(), 'public', 'api', 'supermarkets.json')
  const fileContents = await fs.readFile(path, 'utf8')
  const supermarkets = JSON.parse(fileContents)

  return {
    props: {
      supermarkets
    }
  }
}

export default App

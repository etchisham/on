import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID must be set before starting or building Sanity Studio')
}

export default defineConfig({
  name: 'enterprise-content-platform',
  title: 'Northstar Content Studio',
  projectId,
  dataset,
  basePath: '/',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})

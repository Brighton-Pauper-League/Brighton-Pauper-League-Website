import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {importDecklistAction} from './documentActions/importDecklist'
import {archetypeExportTool} from './tools/archetypeExport'

export default defineConfig({
  name: 'default',
  title: 'Brighton Pauper League',

  projectId: 'sdzciglo',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  tools: (prev) => [...prev, archetypeExportTool],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, ctx) =>
      ctx.schemaType === 'loanerDeck'
        ? [prev[0], importDecklistAction, ...prev.slice(1)]
        : prev,
  },
})

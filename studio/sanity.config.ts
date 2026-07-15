import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {importDecklistAction} from './documentActions/importDecklist'
import {exportEventResultsAction} from './documentActions/exportEventResults'
import {archetypeExportTool} from './tools/archetypeExport'
import {adminGuideTool} from './tools/adminGuide'

export default defineConfig({
  name: 'default',
  title: 'Brighton Pauper League',

  projectId: 'sdzciglo',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  tools: (prev) => [...prev, adminGuideTool, archetypeExportTool],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, ctx) => {
      if (ctx.schemaType === 'loanerDeck') {
        return [prev[0], importDecklistAction, ...prev.slice(1)]
      }
      if (ctx.schemaType === 'event') {
        return [prev[0], exportEventResultsAction, ...prev.slice(1)]
      }
      return prev
    },
  },
})

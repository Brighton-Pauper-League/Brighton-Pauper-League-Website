import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'sdzciglo',
    dataset: 'production'
  },
  deployment: {
    /**
     * Auto-updates are disabled deliberately. They make the deployed Studio load its
     * modules through a runtime import map, which older Safari (< 16.4) cannot resolve —
     * the Studio then renders nothing at all on those devices. Building without them
     * produces a self-contained bundle served from our own origin. Trade-off: Studio
     * updates now require bumping the `sanity` package and redeploying.
     */
    autoUpdates: false,
  }
})

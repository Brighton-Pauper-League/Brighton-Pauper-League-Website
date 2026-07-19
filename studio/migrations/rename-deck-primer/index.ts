import {defineMigration, at, setIfMissing, unset} from 'sanity/migrate'

// The old `primer` field became `introText` when the deck page gained a
// separate, longer-form `deckPrimer` section below the card images.
const from = 'primer'
const to = 'introText'

export default defineMigration({
  title: 'Rename loaner deck primer to introText',
  documentTypes: ['loanerDeck'],

  migrate: {
    document(doc) {
      if (!doc[from]) return []
      return [at(to, setIfMissing(doc[from])), at(from, unset())]
    },
  },
})

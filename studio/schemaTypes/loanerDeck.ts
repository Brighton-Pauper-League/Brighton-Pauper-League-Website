import {defineType, defineField, defineArrayMember} from 'sanity'
import {StackIcon} from '@sanity/icons'

// Shared rich-text shape used by both Intro Text and the Deck Primer.
const richTextMembers = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
      {title: 'Quote', value: 'blockquote'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
        {title: 'Code', value: 'code'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({name: 'alt', type: 'string', title: 'Alternative Text'}),
      defineField({name: 'caption', type: 'string', title: 'Caption'}),
    ],
  }),
]

export const loanerDeck = defineType({
  name: 'loanerDeck',
  title: 'Loaner Deck',
  type: 'document',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Deck Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isHidden',
      title: 'Hidden',
      type: 'boolean',
      description: 'Hide this deck from the public site without deleting it.',
      initialValue: false,
    }),
    defineField({
      name: 'deckOwner',
      title: 'Deck Owner',
      type: 'string',
      description:
        'If this deck has an owner, it is currently on loan to Brighton Pauper League. Leave blank if the club owns this deck outright.',
    }),
    defineField({
      name: 'featuredCard',
      title: 'Featured Card',
      type: 'string',
      description:
        'Card name used as the cover image on the decks list page. Falls back to the first mainboard card if left empty.',
      validation: (rule) =>
        rule.custom(async (value: string | undefined) => {
          if (!value) return true
          try {
            const res = await fetch(
              `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(value)}`,
              {headers: {Accept: 'application/json'}},
            )
            if (res.status === 404) return 'Card not found on Scryfall — check the spelling.'
            return true
          } catch {
            return true // Do not block saving on network failures
          }
        }),
    }),
    defineField({
      name: 'featuredCardImageUri',
      title: 'Featured Card Image URI',
      type: 'url',
      description: 'Populated automatically when the deck is published. Do not edit manually.',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'resolvedNamesHash',
      title: 'Resolved Names Hash',
      type: 'string',
      description:
        'Internal bookkeeping — fingerprint of the card names Scryfall was last resolved for. Do not edit manually.',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      description: 'Short introduction to this deck. Displayed at the top of the deck page.',
      of: richTextMembers,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description:
        'Add cards manually or use the "Import Decklist" button to paste a list from Moxfield or Archidekt. The same card can appear twice — once for the mainboard and once for the sideboard.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'cardName',
              title: 'Card Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity Needed',
              type: 'number',
              description: 'Total copies required for a complete deck.',
              validation: (rule) => rule.required().min(1).integer(),
              initialValue: 1,
            }),
            defineField({
              name: 'quantityOwned',
              title: 'Quantity Owned',
              type: 'number',
              description: 'Copies physically in the collection. If less than Quantity Needed, the deck is marked incomplete.',
              validation: (rule) => rule.required().min(0).integer(),
              initialValue: 1,
            }),
            defineField({
              name: 'isSideboard',
              title: 'Sideboard Card',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'imageUri',
              title: 'Image URI',
              type: 'url',
              description: 'Populated automatically when the deck is published. Do not edit manually.',
              readOnly: true,
              hidden: true,
            }),
            defineField({
              name: 'imageUriBack',
              title: 'Back Face Image URI',
              type: 'url',
              description: 'Back face for double-faced cards. Populated automatically on publish.',
              readOnly: true,
              hidden: true,
            }),
            defineField({
              name: 'typeLine',
              title: 'Type Line',
              type: 'string',
              description: 'Card type from Scryfall (e.g. "Creature — Wizard"). Populated automatically on publish.',
              readOnly: true,
              hidden: true,
            }),
          ],
          preview: {
            select: {
              cardName: 'cardName',
              quantity: 'quantity',
              quantityOwned: 'quantityOwned',
              isSideboard: 'isSideboard',
            },
            prepare({cardName, quantity, quantityOwned, isSideboard}) {
              const zone = isSideboard ? 'SB' : 'MB'
              const missing = quantity - quantityOwned
              const subtitle =
                missing > 0
                  ? `${zone} · ${quantityOwned}/${quantity} — Missing ${missing}`
                  : `${zone} · ×${quantity}`
              return {title: cardName ?? 'Unnamed card', subtitle}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'deckPrimer',
      title: 'Deck Primer / Sideboard Guide',
      type: 'array',
      description:
        'Guide to playing and sideboarding with this deck. Displayed below the card images. Omitted from the deck page if left empty.',
      of: richTextMembers,
    }),
    defineField({
      name: 'donors',
      title: 'Special Thanks',
      type: 'array',
      description: 'Names of people who donated cards for this deck. If empty, the Special Thanks section is omitted from the deck page.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      isHidden: 'isHidden',
      cards: 'cards',
    },
    prepare({name, isHidden, cards}) {
      const incomplete =
        Array.isArray(cards) && cards.some((c) => (c.quantityOwned ?? 0) < (c.quantity ?? 1))
      const flags = [isHidden && 'Hidden', incomplete && 'Incomplete'].filter(Boolean)
      return {
        title: name ?? 'Untitled deck',
        subtitle: flags.length ? flags.join(' · ') : 'Complete',
      }
    },
  },
  orderings: [
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})

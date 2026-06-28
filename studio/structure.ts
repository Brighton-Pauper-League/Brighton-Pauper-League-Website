import { StructureBuilder } from 'sanity/structure'
import {
  CaseIcon,
  UserIcon,
  ChartUpwardIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
  StackIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── League Management ─────────────────────────────────────────────
      S.listItem()
        .title('League Management')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('League Management')
            .items([
              S.listItem()
                .title('Seasons')
                .icon(CaseIcon)
                .child(S.documentTypeList('season').title('Seasons')),

              S.listItem()
                .title('Players')
                .icon(UserIcon)
                .child(S.documentTypeList('player').title('Players')),

              S.divider(),

              S.listItem()
                .title('Player Season Stats')
                .icon(ChartUpwardIcon)
                .child(
                  S.documentTypeList('playerSeasonStats').title(
                    'Player Season Stats',
                  ),
                ),
            ]),
        ),

      S.divider(),

      // ── Website Content ───────────────────────────────────────────────
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(S.documentTypeList('event').title('Events')),

      S.listItem()
        .title('Blog Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.listItem()
        .title('Loaner Decks')
        .icon(StackIcon)
        .child(S.documentTypeList('loanerDeck').title('Loaner Decks')),

      S.divider(),

      // ── Settings ──────────────────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
    ])

import { StructureBuilder } from 'sanity/structure'
import {
  CaseIcon,
  UserIcon,
  ChartUpwardIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
  StackIcon,
  TagIcon,
  LinkIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) => {
  // Boundary between "upcoming" and "past", fixed at Studio load time (a reload
  // recomputes it). Passed as a param so the filters don't depend on GROQ now().
  const now = new Date().toISOString()

  return S.list()
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

              S.listItem()
                .title('Archetypes')
                .icon(TagIcon)
                .child(S.documentTypeList('archetype').title('Archetypes')),

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
        .child(
          S.list()
            .title('Events')
            .items([
              // Upcoming: not cancelled, dated today or later — oldest first so
              // the next event to happen sits at the top.
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Upcoming Events')
                    .filter(
                      '_type == "event" && isCancelled != true && dateTime(eventDate) >= dateTime($now)',
                    )
                    .params({ now })
                    .defaultOrdering([{ field: 'eventDate', direction: 'asc' }]),
                ),

              // Past: not cancelled, already happened — newest first. Completed
              // events live here, out of the way but still editable for results.
              S.listItem()
                .title('Past')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Past Events')
                    .filter(
                      '_type == "event" && isCancelled != true && dateTime(eventDate) < dateTime($now)',
                    )
                    .params({ now })
                    .defaultOrdering([{ field: 'eventDate', direction: 'desc' }]),
                ),

              // Cancelled: flagged regardless of date.
              S.listItem()
                .title('Cancelled')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Cancelled Events')
                    .filter('_type == "event" && isCancelled == true')
                    .defaultOrdering([{ field: 'eventDate', direction: 'desc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Blog Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.listItem()
        .title('Loaner Decks')
        .icon(StackIcon)
        .child(S.documentTypeList('loanerDeck').title('Loaner Decks')),

      S.listItem()
        .title('Resources')
        .icon(LinkIcon)
        .child(
          S.documentTypeList('resource')
            .title('Resources')
            .defaultOrdering([{ field: 'title', direction: 'asc' }]),
        ),

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
}

# Brighton Pauper League — Admin Guide

This Studio is where **everything** on the website is managed: seasons, players,
events, results, standings, loaner decks, blog posts, and site settings. If it
appears on the public site, it lives here.

Use the left-hand menu to move between content types. This guide (the **Guide**
tab in the top bar) is always available.

---

## The golden rule: Publish

Nothing is live until you **Publish** it.

- The public website and the standings only read **published** documents.
- Unpublished edits are **drafts** — visible to you in the Studio, invisible to
  visitors.
- After editing anything, click **Publish** (bottom-right). An orange dot next to
  a document means it has unpublished changes.

If a change isn't showing on the site, the first thing to check is whether it was
published.

---

## Seasons

**League Management → Seasons.**

A season groups a run of events into one league table.

| Field | What it does |
| ----- | ------------ |
| Season Name | Display name, e.g. "Spring 2026". |
| Season Number | Ordering. Higher = newer. |
| Start Date | When the season begins. |
| End Date | When the season ends — **this drives the standings** (see below). |
| Description | Optional blurb. |

**Why the End Date matters:** while today is on or before the End Date the season
is *active* and standings show the live running total. Once the End Date has
passed the season is *complete* and the standings switch to the **final table**
with the "drop worst two" rule applied. So set the End Date correctly — it's the
switch that finalises a season.

---

## Players

**League Management → Players.**

| Field | What it does |
| ----- | ------------ |
| Name | The player's real name. |
| Nickname | If set, shown on the site instead of the real name. |
| Pseudonym | Alternate public name used when *Anonymised* is on. |
| Anonymised | Hides the real identity — the player shows as their pseudonym and their profile is not linked. |
| Public | Turn **off** to hide the player from the site entirely. |
| Active | Marks a current vs former regular. |
| Slug | The profile page URL. |
| Image / Bio / Join date | Profile content. |

Add a player once; you then reference them from event results.

---

## Events

**Events** (in the main menu). Covers league nights, casual nights, and specials.

| Field | What it does |
| ----- | ------------ |
| Event Title | Name of the night. |
| Event Date | Date and time. |
| Location | Venue. |
| Description | Optional details. |
| Featured Image | Optional cover image. |
| Season | Link to a season — **this makes the event a league stage** that counts towards standings. Leave blank for a non-scoring event. |
| Registration / Info Link | Optional external link. |
| Cancelled | Marks the event cancelled without deleting it. |
| Event Results | Per-player results — see below. |

**Slug:** generated automatically on publish (hidden). Don't edit it. **Duplicating
an event is safe** — the copy gets its own unique slug when you publish.

---

## Entering results (the important part)

On an event, fill in **Event Results** — one entry per attendee.

For each player:

| Field | Notes |
| ----- | ----- |
| Player | Pick the player. |
| Deck Archetype | The deck they ran. Pick an existing archetype or **create a new one inline**. Optional. |
| Wins / Draws / Losses | Their record for the night. |
| OMW% / GW% / OGW% | Copy these from the **MTG Companion** app — used for tiebreakers. |

Then **Publish the event**. Publishing automatically recalculates that season's
**Player Season Stats**.

Notes:

- **Points are automatic** — Win = 3, Draw = 1, Loss = 0. You never type points.
- **A player who didn't attend:** just leave them out. At season end a missed
  stage counts as a **0** for them (see Standings).
- Enter results as accurately as you can, then publish — the standings update
  from there.

---

## How standings work

- **During a season:** the table is the live running total of every stage played
  so far.
- **After the End Date:** the table becomes the **final** version — each player's
  stage scores with their **worst two dropped**, and any stage they missed counts
  as **0**. In practice: you can miss up to two nights with no penalty; a third
  missed night starts costing you points.
- **Ties** are broken by OMW%, then GW%, then OGW% (standard MTG tiebreakers).
- **Player Season Stats** documents are generated automatically. **Do not edit
  them by hand** — they are overwritten whenever an event is published.

---

## Archetypes

**League Management → Archetypes.**

The managed list of deck archetypes used in results.

- Add archetypes here, or create one inline from a result's **Deck Archetype**
  field.
- Keep names **consistent** — one canonical name per deck (e.g. always "Dimir
  Faeries", not sometimes "UB Faeries") so the data stays clean and easy to
  analyse later.

### Archetype Export (CSV)

Top bar → **Archetype Export** → **Export CSV**.

Downloads one row per player per event: `season, event, date, player, archetype,
W, D, L`. Opens straight in Excel or Google Sheets. It reflects **published**
data only and is not shown anywhere public.

---

## Loaner Decks

**Loaner Decks** (main menu).

| Field | What it does |
| ----- | ------------ |
| Deck Name / Slug | Name and page URL. |
| Hidden | Hide from the public decks page without deleting. |
| Deck Owner | Name if the deck is on loan; blank if the club owns it. |
| Featured Card | Card used as the cover image. |
| Deck Primer | Optional how-to-play guide shown on the deck page. |
| Cards | The decklist. |

Use the **Import Decklist** button (top of a loaner deck) to paste a list from
Moxfield or Archidekt instead of adding cards one by one. Card images and the
featured-card image populate automatically when you publish.

---

## Blog Posts

**Blog Posts** (main menu). Standard fields: Title, Slug, Author, Published date,
Excerpt, Featured Image, Tags, and Body. Publish to make a post live.

---

## Site Settings

**Site Settings** (bottom of the menu). Global values such as social links.

---

## Extras

- **Vision** (top bar): an advanced, read-only query tool for exploring the data.
  Safe to browse; it does not change anything.
- **When changes go live:** after you publish, the site refreshes itself
  automatically. If something still looks old, give it a minute and reload.

---

*Questions or something not covered here? Note it down so this guide can be
updated.*

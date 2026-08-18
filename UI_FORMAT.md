# Ethiopidia UI Format

**Scope:** Destinations, destination details, Things to Do, categories, galleries, and guides.

## 1. Admin navigation

```text
┌──────────────────────────────┐
│ ETHIOPIDIA                   │
│ Admin Studio                 │
├──────────────────────────────┤
│ Dashboard                    │
│ Destinations                 │
│ Things to Do                 │
│ Categories                   │
│ Media Library                │
│ Reviews                      │
│ Settings                     │
├──────────────────────────────┤
│ View Public Website          │
│ Admin Profile / Sign Out     │
└──────────────────────────────┘
```

Desktop uses a fixed left sidebar. Mobile uses a menu button that opens the navigation as a drawer.

## 2. Destinations list page

**Route:** `/admin/destinations`

```text
┌────────────────────────────────────────────────────────────────────┐
│ CONTENT LIBRARY                                                    │
│ Cities & Destinations                          [ + Create City ]   │
│ Create and manage destinations travelers can discover.            │
├────────────────────────────────────────────────────────────────────┤
│ [ Search cities...                      ] [ All ] [ Iconic only ]  │
│ Showing 12 of 12 cities                                           │
├──────────────────────┬──────────────────────┬──────────────────────┤
│ [ HERO IMAGE       ] │ [ HERO IMAGE       ] │ [ HERO IMAGE       ] │
│ [ICONIC]     [Delete]│              [Delete]│ [ICONIC]     [Delete]│
│ Addis Ababa          │ Lalibela             │ Gondar               │
│ አዲስ አበባ              │ ላሊበላ                 │ ጎንደር                │
│ Short description... │ Short description... │ Short description... │
│ [ Edit ] [ Preview ] │ [ Edit ] [ Preview ] │ [ Edit ] [ Preview ]│
├──────────────────────┼──────────────────────┼──────────────────────┤
│ More cards...                                                       │
├────────────────────────────────────────────────────────────────────┤
│ Previous                Page 1 of 3                    Next        │
└────────────────────────────────────────────────────────────────────┘
```

### Destination card content

- Hero or card image
- Iconic badge when enabled
- Delete icon
- English destination name
- Amharic destination name
- Short description in the active language
- Edit button
- Preview button

### Destination list actions

- Search by English or Amharic name and description
- Filter by all, iconic, draft, published, or archived
- Sort by display order, name, newest, or recently updated
- Create destination
- Edit destination
- Preview destination
- Delete destination with confirmation
- Pagination

## 3. Create destination modal

Use a modal only for quickly creating the basic destination record. After creation, open the full destination editor.

```text
┌──────────────────────────────────────────────────────────┐
│ Create City or Destination                         [ X ] │
│ Add the basic content shown to travelers.                │
├──────────────────────────────────────────────────────────┤
│ English name *             Amharic name *                │
│ [ Addis Ababa           ]  [ አዲስ አበባ              ]   │
│                                                          │
│ English short description *                              │
│ [ Capital city of Ethiopia...                        ]   │
│                                                          │
│ Amharic short description *                              │
│ [ የኢትዮጵያ ዋና ከተማ...                              ]   │
│                                                          │
│ Hero image URL *                                         │
│ [ https://example.com/city.jpg                       ]   │
│                                                          │
│ [✓] Mark this destination as iconic                      │
├──────────────────────────────────────────────────────────┤
│                             [ Cancel ] [ Create City ]   │
└──────────────────────────────────────────────────────────┘
```

### Create destination fields

| Label | Control | Required |
|---|---|---:|
| English name | Text input | Yes |
| Amharic name | Text input | Yes |
| English short description | Textarea | Yes |
| Amharic short description | Textarea | Yes |
| Hero image URL | URL input with preview | Yes |
| Iconic destination | Checkbox/switch | No |

## 4. Full destination editor

**Route:** `/admin/destinations/{id}/edit`

```text
┌────────────────────────────────────────────────────────────────────┐
│ ← Destinations                                                     │
│ Edit: Addis Ababa                         Draft saved 2 min ago     │
│                                           [ Preview ] [ Publish ]   │
├────────────────────────────────────────────────────────────────────┤
│ Basic │ Descriptions │ Media │ Guide │ Travel Info │ SEO          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                 ACTIVE TAB CONTENT                                 │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                      [ Cancel ] [ Save Draft ] [ Publish ]         │
└────────────────────────────────────────────────────────────────────┘
```

The header and bottom action bar remain visible while scrolling.

## 5. Destination editor — Basic tab

```text
┌────────────────────────────────────────────────────────────────────┐
│ Basic Information                                                  │
│                                                                    │
│ English name *                   Amharic name *                    │
│ [ Addis Ababa                 ]  [ አዲስ አበባ                   ]   │
│                                                                    │
│ URL slug *                       Status                            │
│ [ addis-ababa                 ]  [ Draft                     ▼ ]   │
│                                                                    │
│ English region                  Amharic region                     │
│ [ Addis Ababa                 ]  [ አዲስ አበባ                   ]   │
│                                                                    │
│ English tagline                 Amharic tagline                    │
│ [ Africa's diplomatic...     ]  [ የአፍሪካ ዲፕሎማሲያዊ...       ]   │
│                                                                    │
│ [✓] Iconic destination          Display order [ 1 ]               │
└────────────────────────────────────────────────────────────────────┘
```

### Basic tab fields

- English name
- Amharic name
- URL slug
- English region
- Amharic region
- English tagline
- Amharic tagline
- Iconic switch
- Publication status
- Display order

## 6. Destination editor — Descriptions tab

```text
┌────────────────────────────────────────────────────────────────────┐
│ Descriptions                                                       │
│                                                                    │
│ [ English ] [ Amharic ]                                            │
│                                                                    │
│ Short description *                                                │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Used on cards and at the top of the detail page.               │ │
│ └────────────────────────────────────────────────────────────────┘ │
│ 124 / 220 characters                                               │
│                                                                    │
│ Long description *                                                 │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ B  I  H2  H3  • List  Link                                    │ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │ Full detailed destination introduction...                     │ │
│ │                                                                │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

Desktop may show English and Amharic side by side. Mobile uses language tabs to avoid narrow text areas.

### Description fields

- English short description
- Amharic short description
- English long description
- Amharic long description

The long-description editor supports headings, paragraphs, lists, bold text, italic text, and safe links.

## 7. Destination editor — Media tab

```text
┌────────────────────────────────────────────────────────────────────┐
│ Hero Image                                                         │
│ ┌────────────────────────────┐                                     │
│ │                            │  [ Upload Image ]                   │
│ │       HERO PREVIEW         │  [ Enter Image URL ]               │
│ │                            │  [ Replace ] [ Remove ]             │
│ └────────────────────────────┘                                     │
│                                                                    │
│ English alt text *            [ Addis Ababa skyline...         ]   │
│ Amharic alt text *            [ የአዲስ አበባ ከተማ እይታ...       ]   │
├────────────────────────────────────────────────────────────────────┤
│ Gallery                                      [ + Add Images ]      │
│ Drag images to change their display order.                         │
│                                                                    │
│ [≡] [IMAGE] Meskel Square                         [Edit] [Delete] │
│     መስቀል አደባባይ                                                │
│     A central gathering place...                                   │
│                                                                    │
│ [≡] [IMAGE] Unity Park                            [Edit] [Delete] │
│     አንድነት ፓርክ                                                   │
└────────────────────────────────────────────────────────────────────┘
```

### Gallery image drawer/modal

```text
┌──────────────────────────────────────────────────────────┐
│ Add Gallery Image                                  [ X ] │
├──────────────────────────────────────────────────────────┤
│ Image URL or Upload *                                    │
│ [ Choose image ] [ https://...                       ]   │
│                                                          │
│ English title              Amharic title                 │
│ [ Meskel Square         ]  [ መስቀል አደባባይ          ]   │
│                                                          │
│ English subtitle                                         │
│ [ A central gathering place...                       ]   │
│                                                          │
│ Amharic subtitle                                         │
│ [ ዋና የሕዝብ መሰብሰቢያ...                            ]   │
│                                                          │
│ English alt text *         Amharic alt text *            │
│ [ People at the square ]   [ በአደባባዩ ያሉ ሰዎች     ]   │
│                                                          │
│ Image credit                                             │
│ [ Photographer or source                             ]   │
├──────────────────────────────────────────────────────────┤
│                                  [ Cancel ] [ Add Image ]│
└──────────────────────────────────────────────────────────┘
```

## 8. Destination editor — Guide tab

Guide sections are repeatable blocks. Administrators can add, edit, delete, collapse, expand, and reorder them.

```text
┌────────────────────────────────────────────────────────────────────┐
│ Destination Guide                            [ + Add Guide Section ]│
│                                                                    │
│ [≡] 1. History                                      [Edit] [Delete]│
│     A short preview of the English guide content...                │
│                                                                    │
│ [≡] 2. Getting Around                               [Edit] [Delete]│
│     A short preview of the English guide content...                │
│                                                                    │
│ [≡] 3. Local Food                                  [Edit] [Delete]│
│     A short preview of the English guide content...                │
└────────────────────────────────────────────────────────────────────┘
```

### Add/edit guide section

```text
┌────────────────────────────────────────────────────────────────────┐
│ Edit Guide Section                                           [ X ]│
├────────────────────────────────────────────────────────────────────┤
│ English title *               Amharic title *                      │
│ [ Getting Around           ]  [ መጓጓዣ                         ]    │
│                                                                    │
│ English subtitle              Amharic subtitle                     │
│ [ Moving around the city   ]  [ በከተማዋ ውስጥ መጓዝ           ]    │
│                                                                    │
│ English long content *         Amharic long content *              │
│ [ Rich text editor...       ]  [ Rich text editor...           ]   │
│                                                                    │
│ Supporting image              Image position                      │
│ [ Upload / URL             ]  [ Right                        ▼ ]   │
│                                                                    │
│ English image alt             Amharic image alt                   │
│ [ Light rail              ]  [ ቀላል ባቡር                    ]    │
├────────────────────────────────────────────────────────────────────┤
│                            [ Cancel ] [ Save Guide Section ]       │
└────────────────────────────────────────────────────────────────────┘
```

Suggested guide-section titles:

- Overview
- History
- Culture
- Getting Around
- Local Food
- Travel Tips
- Safety and Etiquette
- What to Pack

## 9. Destination editor — Travel Information tab

```text
┌────────────────────────────────────────────────────────────────────┐
│ Best Time to Visit                                                 │
│                                                                    │
│ English                                                            │
│ [ October to February offers dry and mild weather...           ]   │
│                                                                    │
│ Amharic                                                            │
│ [ ከጥቅምት እስከ የካቲት...                                     ]   │
├────────────────────────────────────────────────────────────────────┤
│ Location                                                           │
│                                                                    │
│ Latitude [ 9.030000 ]       Longitude [ 38.740000 ]               │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │                         MAP PREVIEW                            │ │
│ │                              ●                                 │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## 10. Destination editor — SEO tab

### Fields

- English SEO title
- Amharic SEO title
- English meta description
- Amharic meta description
- Social sharing image
- Search preview
- Social sharing preview

Recommended limits are shown below each field: 70 characters for titles and 170 characters for descriptions.

## 11. Destination delete confirmation

```text
┌──────────────────────────────────────────────────────────┐
│ Delete Addis Ababa?                                [ X ] │
│                                                          │
│ This action permanently deletes the destination, its     │
│ gallery, and guide content. It cannot be undone.         │
│                                                          │
│ Type DELETE to confirm                                   │
│ [                                                      ] │
├──────────────────────────────────────────────────────────┤
│                         [ Cancel ] [ Delete Destination ]│
└──────────────────────────────────────────────────────────┘
```

If linked Things to Do exist, show:

```text
This destination has 14 linked activities. Reassign or delete them before deleting this destination.
[ View Linked Activities ]
```

## 12. Public destinations page

**Route:** `/destinations`

```text
┌────────────────────────────────────────────────────────────────────┐
│ Explore Ethiopia                                                   │
│ Discover cities, heritage places, and natural destinations.       │
│                                                                    │
│ [ Search destinations...                         ] [ Search ]      │
├────────────────────────────────────────────────────────────────────┤
│ Iconic Destinations                                                │
│ [ Large featured destination cards ]                              │
├────────────────────────────────────────────────────────────────────┤
│ All Destinations                                                   │
│ [ Filter by region ] [ Sort: Recommended ]                        │
│                                                                    │
│ [CARD] [CARD] [CARD]                                               │
│ [CARD] [CARD] [CARD]                                               │
└────────────────────────────────────────────────────────────────────┘
```

## 13. Public destination detail page

**Route:** `/destinations/{slug}`

```text
┌────────────────────────────────────────────────────────────────────┐
│ HOME / DESTINATIONS / ADDIS ABABA                                  │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │                         HERO IMAGE                             │ │
│ │                                                                │ │
│ │  Addis Ababa                                                   │ │
│ │  Africa's diplomatic capital                                  │ │
│ └────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────┤
│ Short introduction                                                 │
│ Long destination description...                                    │
├────────────────────────────────────────────────────────────────────┤
│ Photo Gallery                                                      │
│ [ LARGE IMAGE ] [IMAGE] [IMAGE]                                    │
│ Image title and subtitle appear in the lightbox.                   │
├────────────────────────────────────────────────────────────────────┤
│ Destination Guide                                                  │
│                                                                    │
│ History                                                            │
│ [IMAGE] Long guide content...                                      │
│                                                                    │
│ Getting Around                                                     │
│ Long guide content... [IMAGE]                                      │
├────────────────────────────────────────────────────────────────────┤
│ Best Time to Visit                                                 │
│ [ Season information ]                                             │
├────────────────────────────────────────────────────────────────────┤
│ Things to Do in Addis Ababa                                        │
│ [ ACTIVITY ] [ ACTIVITY ] [ ACTIVITY ]            [ View All ]    │
├────────────────────────────────────────────────────────────────────┤
│ Location                                                           │
│ [ MAP ]                                                            │
└────────────────────────────────────────────────────────────────────┘
```

## 14. Categories list page

**Route:** `/admin/categories`

```text
┌────────────────────────────────────────────────────────────────────┐
│ Things-to-Do Categories                       [ + New Category ]   │
├────────────────────────────────────────────────────────────────────┤
│ [ Search categories... ]                      10 categories        │
├───────────────┬─────────────────┬───────────┬─────────┬────────────┤
│ Category      │ Amharic         │ Icon      │ Status  │ Actions    │
├───────────────┼─────────────────┼───────────┼─────────┼────────────┤
│ Culture       │ ባህል            │ Landmark  │ Active  │ Edit Delete│
│ Nature        │ ተፈጥሮ          │ Mountain  │ Active  │ Edit Delete│
│ Food & Drink  │ ምግብና መጠጥ     │ Utensils  │ Active  │ Edit Delete│
└───────────────┴─────────────────┴───────────┴─────────┴────────────┘
```

### Category form fields

- English name
- Amharic name
- URL slug
- English description
- Amharic description
- Icon selector
- Cover image
- Display order
- Active switch

## 15. Things-to-Do list page

**Route:** `/admin/things-to-do`

```text
┌────────────────────────────────────────────────────────────────────┐
│ THINGS TO DO CATALOG                         [ + New Activity ]    │
│ Manage activities, places, food, culture, and local experiences.  │
├────────────────────────────────────────────────────────────────────┤
│ [ Search things to do... ] [ Destination ▼ ] [ Status ▼ ]        │
│                                                                    │
│ [All] [Culture] [History] [Nature] [Food] [Tours] [Wellness] ... │
├────────────────────────────────────────────────────────────────────┤
│ [IMAGE]  National Museum of Ethiopia       [Culture] [Published]  │
│          Addis Ababa                                               │
│          Short description...                  [Edit] [Preview] [⋮]│
├────────────────────────────────────────────────────────────────────┤
│ [IMAGE]  Entoto Natural Park               [Nature]  [Draft]      │
│          Addis Ababa                                               │
│          Short description...                  [Edit] [Preview] [⋮]│
├────────────────────────────────────────────────────────────────────┤
│ Previous                Page 1 of 4                    Next        │
└────────────────────────────────────────────────────────────────────┘
```

### List filters

- Search
- Destination
- Category
- Status
- Featured
- Free/paid
- Sort order
- Pagination

## 16. Create Thing to Do

The first step creates the basic activity, then opens the full editor.

```text
┌──────────────────────────────────────────────────────────┐
│ Create Thing to Do                                 [ X ] │
├──────────────────────────────────────────────────────────┤
│ Destination *                                            │
│ [ Select destination                               ▼ ]   │
│                                                          │
│ Category *                                               │
│ [ Select category                                  ▼ ]   │
│                                                          │
│ English title *             Amharic title *              │
│ [                         ]  [                         ]   │
│                                                          │
│ English short description *                              │
│ [                                                     ]  │
│                                                          │
│ Amharic short description *                              │
│ [                                                     ]  │
│                                                          │
│ Hero image *                                             │
│ [ Upload image or enter URL                          ]   │
├──────────────────────────────────────────────────────────┤
│                          [ Cancel ] [ Create Activity ]  │
└──────────────────────────────────────────────────────────┘
```

## 17. Full Things-to-Do editor

**Route:** `/admin/things-to-do/{id}/edit`

Tabs:

```text
Basic │ Descriptions │ Media │ Guide │ Practical Info │ Extra Content │ SEO
```

### Basic tab

- Destination selector
- Category selector
- English title
- Amharic title
- English subtitle
- Amharic subtitle
- URL slug
- Featured switch
- Free activity switch
- Publication status
- Display order

### Descriptions tab

- English short description
- Amharic short description
- English long description with rich-text editor
- Amharic long description with rich-text editor

### Media tab

- Hero image
- English and Amharic hero alternative text
- Ordered gallery
- Image titles
- Image subtitles/captions
- English and Amharic alternative text
- Image credits

This uses the same media components as the destination editor.

### Guide tab

- Ordered repeatable guide sections
- English and Amharic titles
- English and Amharic subtitles
- English and Amharic long content
- Supporting image and image position

### Practical Information tab

```text
┌────────────────────────────────────────────────────────────────────┐
│ Location                                                           │
│ English address             Amharic address                        │
│ [                         ] [                                    ] │
│ Latitude [          ]       Longitude [                         ]  │
│ [ MAP PREVIEW ]                                                    │
├────────────────────────────────────────────────────────────────────┤
│ Visitor Information                                                │
│ Duration [ 120 ] minutes    Starting price [ 200 ] ETB            │
│ [ ] Free activity                                                  │
│                                                                    │
│ Opening hours                                                      │
│ Monday     [09:00] to [17:00]  [ Closed ]                         │
│ Tuesday    [09:00] to [17:00]  [ Closed ]                         │
│ ...                                                                │
│                                                                    │
│ Contact phone [                ] Email [                         ]  │
│ Website [                                                         ]│
│ Booking website name [       ] URL [                            ]  │
│                                                                    │
│ English practical tips                                             │
│ [                                                                ]│
│ Amharic practical tips                                             │
│ [                                                                ]│
└────────────────────────────────────────────────────────────────────┘
```

## 18. Extra Content tab by category

Only show the content type relevant to the selected category. The editor may manually enable additional blocks.

### Food and Drink — Menu

```text
Menu Items                                           [ + Add Item ]
[≡] Doro Wat / ዶሮ ወጥ     350 ETB              [Edit] [Delete]
[≡] Shiro / ሽሮ             180 ETB              [Edit] [Delete]
```

Menu item fields:

- English and Amharic name
- English and Amharic description
- Image
- Price
- Dietary labels
- Available switch
- Display order

### Wellness — Services

```text
Services                                           [ + Add Service ]
[≡] Traditional Massage     60 min     800 ETB  [Edit] [Delete]
```

Service fields:

- English and Amharic name
- English and Amharic description
- Image
- Duration
- Starting price
- Available switch
- Display order

### Events and Nightlife — Schedule

```text
Schedule                                            [ + Add Event ]
Friday  8:00 PM–11:00 PM  Live Ethiopian Jazz  [Edit] [Delete]
```

Schedule fields:

- English and Amharic event title
- English and Amharic description
- Frequency
- Day or date
- Start and end time
- Ticket price
- Booking link
- Active switch

### Tours — Itinerary

```text
Tour Itinerary                                      [ + Add Stop ]
[≡] 1. Museum entrance       30 min              [Edit] [Delete]
[≡] 2. Main collection       60 min              [Edit] [Delete]
[≡] 3. Garden                30 min              [Edit] [Delete]
```

Itinerary stop fields:

- Stop number
- English and Amharic title
- English and Amharic description
- Image
- Duration
- Location coordinates

## 19. Public Things-to-Do page

**Route:** `/things-to-do`

```text
┌────────────────────────────────────────────────────────────────────┐
│ Things to Do in Ethiopia                                           │
│ Find culture, nature, food, tours, and local experiences.         │
│ [ Search experiences... ] [ Destination ▼ ] [ Search ]           │
├────────────────────────────────────────────────────────────────────┤
│ Browse by Category                                                 │
│ [Culture] [History] [Nature] [Food] [Tours] [Wellness] [...]      │
├────────────────────────────────────────────────────────────────────┤
│ [ Filter ] [ Featured ] [ Free ]            [ Sort ▼ ]           │
│                                                                    │
│ [ACTIVITY CARD] [ACTIVITY CARD] [ACTIVITY CARD]                   │
│ [ACTIVITY CARD] [ACTIVITY CARD] [ACTIVITY CARD]                   │
└────────────────────────────────────────────────────────────────────┘
```

## 20. Public Thing-to-Do detail page

**Route:** `/things-to-do/{slug}`

```text
┌────────────────────────────────────────────────────────────────────┐
│ DESTINATION / CATEGORY / ACTIVITY                                  │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │                         HERO IMAGE                             │ │
│ │  [Category]                                                    │ │
│ │  National Museum of Ethiopia                                  │ │
│ │  Addis Ababa                                                   │ │
│ └────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────┬─────────────────────────┤
│ Short and long description               │ VISITOR INFORMATION     │
│                                          │ Open today 9–5          │
│                                          │ Duration: 2 hours       │
│                                          │ From 200 ETB            │
│                                          │ [ Visit Website ]       │
├──────────────────────────────────────────┴─────────────────────────┤
│ Photo Gallery                                                      │
│ [ LARGE IMAGE ] [IMAGE] [IMAGE]                                    │
├────────────────────────────────────────────────────────────────────┤
│ Guide Sections                                                     │
│ [ Alternating text and image blocks ]                              │
├────────────────────────────────────────────────────────────────────┤
│ Menu / Services / Schedule / Itinerary when available              │
├────────────────────────────────────────────────────────────────────┤
│ Location and Practical Information                                 │
│ [ ADDRESS ] [ MAP ]                                                │
├────────────────────────────────────────────────────────────────────┤
│ Related Things to Do                                               │
│ [CARD] [CARD] [CARD]                                               │
└────────────────────────────────────────────────────────────────────┘
```

## 21. Shared UI states

### Loading

- Use skeleton cards for list pages.
- Use skeleton title, hero, and content blocks for detail pages.
- Buttons show a spinner and action text such as “Creating…” or “Deleting…”.
- Prevent repeated submissions while a request is running.

### Empty

```text
No destinations yet
Create your first destination to get started.
[ + Create Destination ]
```

Filtered empty state:

```text
No results match your search
Try a different search or clear the selected filters.
[ Clear Filters ]
```

### Error

```text
Could not load destinations
The server returned an error. Please try again.
[ Try Again ]
```

### Success

Use a temporary toast message:

```text
✓ Addis Ababa was created successfully.
✓ Changes saved.
✓ Activity deleted.
```

### Validation

- Show field errors directly below the related control.
- Move focus to the first invalid field after submit.
- Keep entered content when saving fails.
- Show a missing-content summary when publication validation fails.

## 22. Responsive behavior

### Desktop

- Fixed sidebar
- Three-column destination cards
- Two-column English/Amharic fields
- Editor tabs in one horizontal row
- Detail page may use a sticky information sidebar

### Tablet

- Collapsible sidebar
- Two-column cards
- Two-column fields where space allows
- Horizontally scrollable editor tabs

### Mobile

- Drawer navigation
- One-column cards
- Full-width fields
- English/Amharic language tabs
- Sticky bottom Save button
- Full-screen form drawers/modals
- Horizontally scrollable category chips
- Detail information sidebar becomes a normal content section

## 23. Accessibility format

- Every input has a visible label.
- Required fields use both an asterisk and screen-reader description.
- Keyboard focus is clearly visible.
- Modals trap focus and close with Escape.
- Icon-only buttons have accessible names.
- Images use meaningful English and Amharic alternative text.
- Amharic content uses `lang="am"`.
- Status is communicated through text as well as color.
- Drag-and-drop ordering also provides Move Up and Move Down buttons.

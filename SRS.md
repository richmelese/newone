# Ethiopidia Software Requirements Specification (SRS)

**Document version:** 1.0  
**Product:** Ethiopidia travel discovery platform  
**Primary languages:** English (`en`) and Amharic (`am`)

## 1. Purpose

Ethiopidia is a bilingual travel discovery platform for Ethiopia. It allows travelers to browse destinations, things to do, hotels, guides, images, and reviews. Administrators manage all public content from a modular content-management area.

This specification defines the required public pages, admin modules, content fields, relationships, API contracts, validation, security, and acceptance criteria.

## 2. Product structure

The system shall be divided into these modules:

1. Destinations / Cities
2. Things to Do
3. Things-to-Do Categories
4. Hotels / Properties
5. Media and Galleries
6. Destination Guides
7. Reviews and Ratings
8. Users and Authentication
9. Favorites and Viewed History
10. Search and Discovery
11. Admin Dashboard and Content Publishing

### 2.1 Main content relationship

```text
Destination / City
├── Destination detail content
├── Gallery images
├── Guide sections
├── Things to do
│   ├── Category
│   ├── Gallery images
│   └── Practical information
└── Hotels
    ├── Gallery images
    ├── Amenities
    ├── Room types
    └── Policies
```

A Thing to Do or Hotel must belong to one Destination. Deleting a Destination that has linked published content must be blocked until that content is reassigned or deleted.

## 3. User roles

| Role | Permissions |
|---|---|
| Visitor | Browse, search, filter, change language, and view details |
| Traveler | Visitor permissions plus favorites, history, and review submission |
| Property owner | Manage assigned property content and respond to requests |
| Editor | Create and update destinations, activities, hotels, guides, and media |
| Admin | Full content, user, review, publishing, and deletion permissions |

## 4. Common content rules

- Public content shall support English and Amharic.
- Required bilingual fields must contain both languages before publication.
- Every public record shall use `draft`, `published`, or `archived` status.
- Public list and detail endpoints shall return only published records unless an authorized admin requests drafts.
- Every managed record shall store `id`, `created_at`, and `updated_at`.
- Public records shall have a unique, URL-safe `slug` where detail URLs require it.
- All images shall support English and Amharic alternative text.
- Repeatable records such as gallery images and guide sections shall support `sort_order`.
- Destructive admin actions shall require confirmation.
- URLs must use HTTPS in production.

## 5. Module A: Destinations / Cities

### 5.1 Purpose

The Destination module manages cities, regions, heritage areas, parks, and other locations travelers can explore. The words “city” and “destination” refer to the same primary entity in the API and admin interface.

### 5.2 Destination fields

| Field | Type | Required | Rules / purpose |
|---|---|---:|---|
| `id` | UUID | System | Primary identifier |
| `slug` | string | Yes for publish | Unique; generated from English name but editable |
| `name_en` | string(160) | Yes | English destination title |
| `name_am` | string(160) | Yes | Amharic destination title |
| `region_en` | string(160) | No | English region/state name |
| `region_am` | string(160) | No | Amharic region/state name |
| `short_description_en` | text | Yes | List-card and summary text; recommended 80–220 characters |
| `short_description_am` | text | Yes | Amharic summary |
| `long_description_en` | rich text | Yes for publish | Full destination introduction |
| `long_description_am` | rich text | Yes for publish | Full Amharic introduction |
| `hero_image` | URL | Yes | Main detail-page image |
| `hero_alt_en` | string | Yes for publish | Accessible English image description |
| `hero_alt_am` | string | Yes for publish | Accessible Amharic image description |
| `card_image` | URL | No | Optional optimized list image; fallback to hero image |
| `tagline_en` | string(220) | No | Short marketing subtitle |
| `tagline_am` | string(220) | No | Amharic subtitle |
| `best_time_en` | text | No | Recommended season/time to visit |
| `best_time_am` | text | No | Amharic recommendation |
| `latitude` | decimal | No | Between -90 and 90 |
| `longitude` | decimal | No | Between -180 and 180 |
| `is_iconic` | boolean | Yes | Default `false`; features city in iconic sections |
| `status` | enum | Yes | `draft`, `published`, or `archived` |
| `sort_order` | integer | Yes | Default `0` |

### 5.3 Destination list page

**Public route:** `/destinations`  
**Admin route:** `/admin/destinations`

Each destination card shall show:

- Card or hero image
- English or Amharic title based on selected language
- Region when available
- Short description
- Iconic label when `is_iconic = true`
- Link to the destination detail page

The page shall support text search, iconic filtering, pagination, loading state, empty state, and API error retry.

### 5.4 Destination detail page

**Public route:** `/destinations/{slug}`

The detail page shall contain, in order:

1. Hero image with destination title, tagline, and region
2. Short introduction
3. Long description
4. Image gallery
5. Destination guide sections
6. Best time to visit
7. Map/location when coordinates exist
8. Things to Do in this destination
9. Hotels in this destination
10. Related or nearby destinations
11. Structured SEO data and social sharing metadata

### 5.5 Destination gallery fields

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `id` | UUID | System | Gallery image identifier |
| `destination_id` | UUID | Yes | Parent destination |
| `image_url` | URL | Yes | Full image URL |
| `title_en` | string | No | Optional image heading |
| `title_am` | string | No | Optional Amharic heading |
| `subtitle_en` | string | No | Caption shown under image |
| `subtitle_am` | string | No | Amharic caption |
| `alt_en` | string | Yes for publish | Accessibility text |
| `alt_am` | string | Yes for publish | Amharic accessibility text |
| `credit` | string | No | Photographer/source |
| `sort_order` | integer | Yes | Display position |

### 5.6 Destination guide section fields

Guide sections are repeatable content blocks. Examples include “History,” “Culture,” “Getting Around,” “Local Food,” “Travel Tips,” and “What to Know.”

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `id` | UUID | System | Section identifier |
| `destination_id` | UUID | Yes | Parent destination |
| `title_en` | string | Yes | English section title |
| `title_am` | string | Yes | Amharic section title |
| `subtitle_en` | string | No | English section subtitle |
| `subtitle_am` | string | No | Amharic section subtitle |
| `body_en` | rich text | Yes | Long guide content |
| `body_am` | rich text | Yes | Long Amharic content |
| `image_url` | URL | No | Supporting section image |
| `image_position` | enum | No | `left`, `right`, or `full`; default `right` |
| `sort_order` | integer | Yes | Section order |

### 5.7 Current city API

#### Create city

`POST /cities`

```json
{
  "name_en": "Addis Ababa",
  "name_am": "አዲስ አበባ",
  "description_en": "Capital city of Ethiopia",
  "description_am": "የኢትዮጵያ ዋና ከተማ",
  "hero_image": "https://example.com/city.jpg",
  "is_iconic": true
}
```

#### List cities

`GET /cities`

#### Get one city

`GET /cities/{id}`

#### Update city

`PUT /cities/{id}` or `PATCH /cities/{id}`

#### Delete city

`DELETE /cities/{id}`

Expected success status: `204 No Content`. Return `409 Conflict` when linked published Things to Do or Hotels prevent deletion.

### 5.8 Recommended expanded destination payload

The current city payload remains valid for the basic form. The detail editor should progressively add the following fields:

```json
{
  "name_en": "Addis Ababa",
  "name_am": "አዲስ አበባ",
  "slug": "addis-ababa",
  "region_en": "Addis Ababa",
  "region_am": "አዲስ አበባ",
  "short_description_en": "Capital city of Ethiopia",
  "short_description_am": "የኢትዮጵያ ዋና ከተማ",
  "long_description_en": "A complete destination introduction...",
  "long_description_am": "ሙሉ የመዳረሻ መግለጫ...",
  "hero_image": "https://example.com/addis-hero.jpg",
  "hero_alt_en": "Addis Ababa skyline",
  "hero_alt_am": "የአዲስ አበባ ከተማ እይታ",
  "tagline_en": "Africa's diplomatic capital",
  "tagline_am": "የአፍሪካ ዲፕሎማሲያዊ ዋና ከተማ",
  "best_time_en": "October to February",
  "best_time_am": "ከጥቅምት እስከ የካቲት",
  "latitude": 9.03,
  "longitude": 38.74,
  "is_iconic": true,
  "status": "published"
}
```

## 6. Module B: Things to Do

### 6.1 Purpose

This module manages attractions, landmarks, cultural experiences, restaurants, tours, wellness services, nightlife, nature activities, shopping, and events linked to a destination.

### 6.2 Categories

Categories must be separate managed records rather than hard-coded text.

Initial categories:

- Culture
- History and Heritage
- Nature and Outdoors
- Food and Drink
- Tours and Experiences
- Wellness and Beauty
- Nightlife and Entertainment
- Shopping and Markets
- Family Activities
- Events and Festivals

Category fields: `id`, `slug`, `name_en`, `name_am`, `description_en`, `description_am`, `icon`, `cover_image`, `sort_order`, and `is_active`.

### 6.3 Thing-to-Do fields

| Field | Type | Required | Rules / purpose |
|---|---|---:|---|
| `id` | UUID | System | Primary identifier |
| `destination_id` | UUID | Yes | Parent destination |
| `category_id` | UUID | Yes | Managed category |
| `slug` | string | Yes | Globally unique detail URL |
| `title_en` | string(180) | Yes | English title |
| `title_am` | string(180) | Yes | Amharic title |
| `short_description_en` | text | Yes | List-card summary |
| `short_description_am` | text | Yes | Amharic summary |
| `long_description_en` | rich text | Yes for publish | Full detail description |
| `long_description_am` | rich text | Yes for publish | Full Amharic detail |
| `hero_image` | URL | Yes | Cover/hero image |
| `hero_alt_en` | string | Yes for publish | English alt text |
| `hero_alt_am` | string | Yes for publish | Amharic alt text |
| `address_en` | string | No | English address |
| `address_am` | string | No | Amharic address |
| `latitude` | decimal | No | Map location |
| `longitude` | decimal | No | Map location |
| `opening_hours` | JSON | No | Opening times per weekday |
| `duration_minutes` | integer | No | Positive integer |
| `price_from_etb` | decimal | No | Must be non-negative |
| `contact_phone` | string | No | Public contact |
| `website_url` | URL | No | Official website |
| `booking_url` | URL | No | External booking link |
| `is_free` | boolean | Yes | Default `false` |
| `is_featured` | boolean | Yes | Default `false` |
| `status` | enum | Yes | Draft/published/archived |

### 6.4 Thing-to-Do detail page

**Public route:** `/things-to-do/{slug}` or the existing `/experiences/{slug}`

The page shall show:

1. Breadcrumb: Destination → Category → Activity
2. Hero image, title, category, and destination
3. Short and long descriptions
4. Image gallery with subtitles/captions
5. Address and map
6. Opening hours, duration, price, and practical tips
7. Category-specific content such as menu, services, or schedule
8. External booking action when available
9. Ratings and reviews
10. Related activities in the same destination/category

### 6.5 Category-specific child content

**Food and Drink – menu items:** name EN/AM, description EN/AM, image, price, dietary labels, sort order.

**Wellness – services:** name EN/AM, description EN/AM, image, duration, price, sort order.

**Nightlife/Events – schedule:** day/date, start time, end time, title EN/AM, ticket price, booking URL.

**Tours – itinerary:** stop number, title EN/AM, description EN/AM, image, duration, coordinates.

### 6.6 Things-to-Do API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/things-to-do` | List with filters and pagination |
| POST | `/things-to-do` | Create activity |
| GET | `/things-to-do/{id}` | Get one activity |
| PATCH | `/things-to-do/{id}` | Update activity |
| DELETE | `/things-to-do/{id}` | Delete activity |
| GET | `/cities/{cityId}/things-to-do` | Activities for a destination |
| GET | `/thing-to-do-categories` | List categories |
| POST | `/thing-to-do-categories` | Create category |

Supported query parameters: `city_id`, `category_id`, `q`, `featured`, `free`, `status`, `page`, `page_size`, and `sort`.

## 7. Module C: Hotels / Properties

### 7.1 Core fields

Hotel fields shall include destination, property type, name, slug, neighborhood EN/AM, short description EN/AM, long description EN/AM, cover image, gallery, star rating, guest rating, price from ETB, amenities, coordinates, booking URL, featured flags, and publishing status.

### 7.2 Child records

- Room types: title, description, photo, capacity, bed type, room size, starting price, and features.
- Policies: check-in, check-out, cancellation EN/AM, and breakfast EN/AM.
- Gallery: images, captions, alt text, cover flag, and sort order.
- Amenities: bilingual label, code, and icon.

### 7.3 Public pages and API

- `/hotels` or `/search`: hotel discovery and filters
- `/hotels/{slug}`: full property detail
- `GET/POST /hotels`
- `GET/PATCH/DELETE /hotels/{id}`
- `GET /cities/{cityId}/hotels`

Booking always redirects to the hotel or partner website; Ethiopidia does not process payment or availability.

## 8. Module D: Media and galleries

- Admins shall be able to add, remove, reorder, preview, and caption images.
- Supported formats: JPEG, PNG, WebP, and AVIF.
- Maximum recommended source size: 10 MB.
- The backend shall validate MIME type instead of trusting file extension.
- Images shall be served in responsive sizes.
- One image may be marked as the cover where applicable.
- Deleting a cover image requires choosing a replacement or confirming fallback behavior.
- API may accept uploaded media IDs or HTTPS image URLs.

Recommended endpoints:

- `POST /media`
- `DELETE /media/{id}`
- `POST /cities/{id}/gallery`
- `PATCH /cities/{id}/gallery/reorder`
- `POST /things-to-do/{id}/gallery`
- `PATCH /things-to-do/{id}/gallery/reorder`

## 9. Module E: Reviews and ratings

- Travelers may submit a 1–5 overall rating, title, review text, trip type, visit date, and photos.
- Reviews initially enter `pending` status unless automatic moderation is enabled.
- Editors/admins may publish, reject, or remove reviews.
- Average rating and review count shall be calculated from published reviews only.
- A user may mark a review helpful once.
- Review pages must indicate verified contributions when applicable.

## 10. Module F: Search and discovery

Global search shall search bilingual destination, activity, hotel, category, and description fields. Search results shall indicate content type.

Required filters:

- Destination/city
- Content category
- Price range
- Hotel star rating
- Guest rating
- Amenities
- Property type
- Free activities
- Featured/iconic content

Required sorting: recommended, newest, rating, price low-to-high, and price high-to-low where applicable.

## 11. Module G: Admin content management

### 11.1 Navigation

The admin area shall contain:

- Overview
- Destinations
- Things to Do
- Categories
- Hotels / Properties
- Reviews
- Property Requests
- Media Library
- FAQs
- Users and Roles
- Settings

### 11.2 Destination editor tabs

1. **Basic information:** titles, slug, region, tagline, iconic status, publish status
2. **Descriptions:** short and long descriptions in both languages
3. **Hero and gallery:** hero image, alt text, gallery, captions, ordering
4. **Guide:** repeatable title/subtitle/body/image blocks
5. **Travel information:** best time, coordinates, map
6. **Related content:** linked Things to Do and Hotels
7. **SEO:** meta title, meta description, sharing image

### 11.3 Things-to-Do editor tabs

1. Basic information
2. Destination and category
3. Descriptions
4. Hero and gallery
5. Location and practical information
6. Category-specific content
7. Booking
8. SEO and publishing

### 11.4 Admin behavior

- Forms shall show required fields and inline validation.
- Unsaved changes shall trigger a navigation warning.
- Save Draft and Publish shall be separate actions.
- Publish shall fail with a clear list of missing requirements.
- List screens shall support search, filter, pagination, preview, edit, archive, and delete.
- Delete shall require confirmation and display backend conflict messages.
- Successful creates, updates, and deletes shall update the visible list without a full reload.

## 12. API standards

### 12.1 Base and authentication

- Base URL is configured by `NEXT_PUBLIC_API_BASE_URL`.
- Protected calls use `Authorization: Bearer {access_token}`.
- All request and response bodies use JSON except binary media upload.

### 12.2 Recommended list response

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 0,
  "page_count": 0
}
```

### 12.3 Recommended error response

```json
{
  "code": "VALIDATION_ERROR",
  "message": "The submitted data is invalid.",
  "fields": {
    "name_am": "Amharic name is required."
  }
}
```

### 12.4 HTTP statuses

| Status | Meaning |
|---:|---|
| 200 | Successful read/update |
| 201 | Record created |
| 204 | Successful deletion |
| 400 | Malformed request |
| 401 | Authentication required/expired |
| 403 | Insufficient permission |
| 404 | Record not found |
| 409 | Duplicate or relationship conflict |
| 422 | Field validation error |
| 500 | Unexpected server error |

## 13. Functional requirements

- **FR-001:** The system shall list published destinations from the API.
- **FR-002:** Authorized users shall create, edit, archive, and delete destinations.
- **FR-003:** A destination detail shall support hero content, long descriptions, galleries, and ordered guide sections.
- **FR-004:** The system shall list Things to Do by destination and category.
- **FR-005:** Authorized users shall manage activity categories and activities.
- **FR-006:** Each Thing to Do shall link to exactly one destination and one category.
- **FR-007:** The system shall display hotels associated with a destination.
- **FR-008:** The system shall provide bilingual content switching without changing the selected page.
- **FR-009:** Travelers shall search and filter available content.
- **FR-010:** Authenticated travelers shall manage favorites and submit reviews.
- **FR-011:** Editors shall moderate review publication.
- **FR-012:** Admin operations shall provide loading, success, empty, and error feedback.
- **FR-013:** Public pages shall expose SEO metadata and structured data.
- **FR-014:** The system shall prevent unauthorized content mutation.
- **FR-015:** Referential integrity shall prevent unsafe parent deletion.

## 14. Non-functional requirements

### 14.1 Performance

- Public pages should achieve Largest Contentful Paint under 2.5 seconds on a typical 4G connection.
- List endpoints should respond within 500 ms at the 95th percentile under normal load.
- Images must be lazy-loaded below the fold and delivered responsively.
- Public API lists must use server-side pagination.

### 14.2 Accessibility

- Target WCAG 2.2 Level AA.
- All interactive controls must be keyboard accessible.
- Focus states must be visible.
- Dialogs must trap focus and close with Escape.
- Images require meaningful alternative text.
- Language-specific content must include the correct `lang` attribute.

### 14.3 Security

- Passwords must be strongly hashed and never returned by the API.
- Authorization must be checked on the server for every mutation.
- Rich text must be sanitized before storage or rendering.
- Uploads must be type-checked, size-limited, and stored under generated names.
- API inputs must be validated and parameterized database queries used.
- Login and mutation endpoints must be rate-limited.
- Audit logs should record admin create, update, publish, archive, and delete actions.

### 14.4 Reliability and compatibility

- The UI shall work on current Chrome, Edge, Firefox, and Safari.
- Layouts shall support mobile widths from 320 px and desktop widths above 1440 px.
- Failed API calls shall show retryable messages without losing entered form data.
- Database backups and restore procedures shall be defined for production.

## 15. Acceptance criteria

### Destination acceptance

1. Admin creates Addis Ababa using both languages, hero image, description, and iconic status.
2. The record appears on the admin city list immediately.
3. When published, it appears on `/destinations`.
4. Its detail page displays hero, title, descriptions, gallery captions, guide blocks, related Things to Do, and hotels.
5. Admin can reorder gallery and guide items.
6. Delete calls `DELETE /cities/{id}` and removes the card after success.
7. Deletion with dependent published content returns and displays a conflict message.

### Things-to-Do acceptance

1. Admin selects a destination and category before publishing an activity.
2. The activity supports bilingual title, summary, long description, hero, and gallery.
3. It appears under its destination and category after publication.
4. Its detail page shows practical and category-specific content.
5. Search and filters return the activity correctly.

### General acceptance

1. English/Amharic switching displays the corresponding available content.
2. Unauthorized users cannot access mutation endpoints.
3. All forms show API validation errors at the relevant field.
4. Mobile and desktop pages are usable and accessible.
5. Loading, empty, success, and failure states are present on all API-driven modules.

## 16. Recommended implementation phases

### Phase 1 — Core destination CMS

- Complete city CRUD
- Expand destination fields
- Add destination detail editor
- Add gallery and guide-section management
- Replace public destination mock data with APIs

### Phase 2 — Things to Do

- Category CRUD
- Thing-to-Do CRUD
- Destination/category linking
- Detail pages, gallery, practical information, and category-specific fields

### Phase 3 — Hotels and reviews

- Connect hotel CRUD and property child records
- Connect public filters and details
- Add review submission and moderation APIs

### Phase 4 — Production readiness

- Media upload pipeline
- SEO and structured data
- Audit logs, rate limits, monitoring, backups, accessibility, and performance testing

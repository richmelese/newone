-- Ethiopidia PostgreSQL schema
-- PostgreSQL 15+

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('traveler', 'property_owner', 'editor', 'admin');
CREATE TYPE identity_provider AS ENUM ('google');
CREATE TYPE property_member_role AS ENUM ('owner', 'manager', 'editor');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE property_type AS ENUM ('hotel', 'resort', 'guesthouse', 'lodge', 'boutique', 'serviced_apartment');
CREATE TYPE listing_request_status AS ENUM ('pending', 'reviewing', 'approved', 'rejected', 'onboarding', 'completed');
CREATE TYPE contact_message_status AS ENUM ('new', 'in_progress', 'resolved', 'spam');
CREATE TYPE media_kind AS ENUM ('image', 'video');
CREATE TYPE service_type AS ENUM ('hotel', 'restaurant', 'thing_to_do', 'tour', 'wellness', 'nightlife');
CREATE TYPE trip_type AS ENUM ('solo', 'couple', 'family', 'friends', 'business');
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Accounts

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL,
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'traveler',
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_normalized CHECK (email = LOWER(BTRIM(email)))
);

CREATE UNIQUE INDEX users_email_unique ON users (LOWER(email));

-- Public account data is kept separate from credentials so profile updates do
-- not touch authentication rows. Contributions and achievements are derived
-- from reviews/favorites rather than duplicated here.
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(120) NOT NULL,
  username VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  bio VARCHAR(500),
  city VARCHAR(120),
  country_code CHAR(2) NOT NULL DEFAULT 'ET',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_profiles_username_format CHECK (username ~ '^[a-z0-9][a-z0-9._-]{2,49}$'),
  CONSTRAINT user_profiles_country_uppercase CHECK (country_code = UPPER(country_code))
);

CREATE UNIQUE INDEX user_profiles_username_unique ON user_profiles (LOWER(username));

-- OAuth provider subjects are stable identifiers; provider email is metadata
-- and must not be used as the identity key.
CREATE TABLE user_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider identity_provider NOT NULL,
  provider_subject VARCHAR(255) NOT NULL,
  provider_email VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_subject),
  UNIQUE (user_id, provider)
);

-- Store only hashes of bearer tokens. Raw session/reset tokens must never be
-- persisted in the database.
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash BYTEA NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_sessions_expiry_after_creation CHECK (expires_at > created_at)
);

CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash BYTEA NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT email_verification_expiry_after_creation CHECK (expires_at > created_at)
);

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash BYTEA NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT password_reset_expiry_after_creation CHECK (expires_at > created_at)
);

-- Destinations and guides

CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  region VARCHAR(160) NOT NULL,
  hero_photo_url TEXT NOT NULL,
  card_photo_url TEXT NOT NULL,
  tagline_en TEXT NOT NULL,
  tagline_am TEXT NOT NULL,
  guide_en TEXT NOT NULL,
  guide_am TEXT NOT NULL,
  best_time_en TEXT NOT NULL,
  best_time_am TEXT NOT NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  map_x NUMERIC(8, 3),
  map_y NUMERIC(8, 3),
  status content_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT destinations_latitude_range CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CONSTRAINT destinations_longitude_range CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE TABLE destination_guide_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_am TEXT NOT NULL,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE destination_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_en TEXT,
  alt_am TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hotels

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(80) NOT NULL UNIQUE,
  icon VARCHAR(80) NOT NULL,
  label_en VARCHAR(160) NOT NULL,
  label_am VARCHAR(160) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  property_type property_type NOT NULL,
  star_rating SMALLINT,
  guest_rating NUMERIC(3, 2),
  review_count INTEGER NOT NULL DEFAULT 0,
  price_from_etb NUMERIC(12, 2),
  neighborhood_en VARCHAR(200) NOT NULL,
  neighborhood_am VARCHAR(200) NOT NULL,
  short_description_en TEXT NOT NULL,
  short_description_am TEXT NOT NULL,
  long_description_en TEXT NOT NULL,
  long_description_am TEXT NOT NULL,
  booking_active BOOLEAN NOT NULL DEFAULT FALSE,
  external_booking_url TEXT,
  external_site_name VARCHAR(160),
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  map_x NUMERIC(8, 3),
  map_y NUMERIC(8, 3),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hotels_star_rating_range CHECK (star_rating IS NULL OR star_rating BETWEEN 1 AND 5),
  CONSTRAINT hotels_guest_rating_range CHECK (guest_rating IS NULL OR guest_rating BETWEEN 0 AND 5),
  CONSTRAINT hotels_review_count_nonnegative CHECK (review_count >= 0),
  CONSTRAINT hotels_price_nonnegative CHECK (price_from_etb IS NULL OR price_from_etb >= 0),
  CONSTRAINT hotels_latitude_range CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CONSTRAINT hotels_longitude_range CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CONSTRAINT hotels_external_booking_complete CHECK (
    booking_active = FALSE OR (external_booking_url IS NOT NULL AND external_site_name IS NOT NULL)
  )
);

-- A property can have multiple authorized people without overloading the
-- global user role. Authorization checks use this membership table.
CREATE TABLE property_memberships (
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role property_member_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (hotel_id, user_id)
);

CREATE TABLE hotel_amenities (
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE RESTRICT,
  PRIMARY KEY (hotel_id, amenity_id)
);

CREATE TABLE hotel_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_en TEXT,
  alt_am TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX hotel_one_cover_photo
  ON hotel_photos (hotel_id)
  WHERE is_cover = TRUE;

CREATE TABLE hotel_policies (
  hotel_id UUID PRIMARY KEY REFERENCES hotels(id) ON DELETE CASCADE,
  check_in TIME NOT NULL,
  check_out TIME NOT NULL,
  cancellation_en TEXT NOT NULL,
  cancellation_am TEXT NOT NULL,
  breakfast_en TEXT NOT NULL,
  breakfast_am TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE room_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(80) NOT NULL UNIQUE,
  label_en VARCHAR(160) NOT NULL,
  label_am VARCHAR(160) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name_en VARCHAR(180) NOT NULL,
  name_am VARCHAR(180) NOT NULL,
  description_en TEXT NOT NULL,
  description_am TEXT NOT NULL,
  bed_type_en VARCHAR(160) NOT NULL,
  bed_type_am VARCHAR(160) NOT NULL,
  photo_url TEXT,
  capacity SMALLINT NOT NULL,
  size_sqm NUMERIC(8, 2),
  price_from_etb NUMERIC(12, 2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT room_types_capacity_positive CHECK (capacity > 0),
  CONSTRAINT room_types_size_positive CHECK (size_sqm IS NULL OR size_sqm > 0),
  CONSTRAINT room_types_price_nonnegative CHECK (price_from_etb >= 0)
);

CREATE TABLE room_type_features (
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  room_feature_id UUID NOT NULL REFERENCES room_features(id) ON DELETE RESTRICT,
  PRIMARY KEY (room_type_id, room_feature_id)
);

-- Experiences

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name_en VARCHAR(180) NOT NULL,
  name_am VARCHAR(180) NOT NULL,
  description_en TEXT NOT NULL,
  description_am TEXT NOT NULL,
  long_description_en TEXT,
  long_description_am TEXT,
  address_en TEXT,
  address_am TEXT,
  category VARCHAR(100) NOT NULL,
  cover_photo_url TEXT NOT NULL,
  guest_rating NUMERIC(3, 2),
  review_count INTEGER NOT NULL DEFAULT 0,
  bookable BOOLEAN NOT NULL DEFAULT FALSE,
  external_booking_url TEXT,
  external_site_name VARCHAR(160),
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT experiences_external_booking_complete CHECK (
    bookable = FALSE OR (external_booking_url IS NOT NULL AND external_site_name IS NOT NULL)
  ),
  CONSTRAINT experiences_guest_rating_range CHECK (guest_rating IS NULL OR guest_rating BETWEEN 0 AND 5),
  CONSTRAINT experiences_review_count_nonnegative CHECK (review_count >= 0)
);

CREATE TABLE experience_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_en TEXT,
  alt_am TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE experience_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  name_en VARCHAR(180) NOT NULL,
  name_am VARCHAR(180) NOT NULL,
  description_en TEXT,
  description_am TEXT,
  price_from_etb NUMERIC(12, 2),
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT experience_menu_price_nonnegative CHECK (price_from_etb IS NULL OR price_from_etb >= 0)
);

CREATE TABLE experience_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  name_en VARCHAR(180) NOT NULL,
  name_am VARCHAR(180) NOT NULL,
  photo_url TEXT,
  duration_minutes INTEGER,
  price_from_etb NUMERIC(12, 2),
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT experience_service_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT experience_service_price_nonnegative CHECK (price_from_etb IS NULL OR price_from_etb >= 0)
);

CREATE TABLE experience_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  day_en VARCHAR(80) NOT NULL,
  day_am VARCHAR(80) NOT NULL,
  starts_at TIME NOT NULL,
  title_en VARCHAR(180),
  title_am VARCHAR(180),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Reviews. A review subject gives the application one stable identifier for
-- every reviewable service while preserving real foreign keys to the concrete
-- hotel or experience record.

CREATE TABLE review_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type service_type NOT NULL,
  hotel_id UUID REFERENCES hotels(id) ON DELETE RESTRICT,
  experience_id UUID REFERENCES experiences(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT review_subject_exactly_one_entity CHECK (num_nonnulls(hotel_id, experience_id) = 1),
  CONSTRAINT review_subject_type_matches_entity CHECK (
    (hotel_id IS NOT NULL AND service_type = 'hotel') OR
    (experience_id IS NOT NULL AND service_type <> 'hotel')
  )
);

CREATE UNIQUE INDEX review_subjects_hotel_unique
  ON review_subjects (hotel_id) WHERE hotel_id IS NOT NULL;
CREATE UNIQUE INDEX review_subjects_experience_unique
  ON review_subjects (experience_id) WHERE experience_id IS NOT NULL;

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_subject_id UUID NOT NULL REFERENCES review_subjects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL,
  author_email VARCHAR(320) NOT NULL,
  rating SMALLINT NOT NULL,
  title_en TEXT,
  title_am TEXT,
  text_en TEXT,
  text_am TEXT,
  trip_type trip_type NOT NULL,
  visited_on DATE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  status review_status NOT NULL DEFAULT 'pending',
  moderation_reason TEXT,
  moderated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
  moderated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_author_email_normalized CHECK (author_email = LOWER(BTRIM(author_email))),
  CONSTRAINT reviews_has_title CHECK (NULLIF(BTRIM(title_en), '') IS NOT NULL OR NULLIF(BTRIM(title_am), '') IS NOT NULL),
  CONSTRAINT reviews_has_text CHECK (NULLIF(BTRIM(text_en), '') IS NOT NULL OR NULLIF(BTRIM(text_am), '') IS NOT NULL),
  CONSTRAINT reviews_visit_not_future CHECK (visited_on <= CURRENT_DATE),
  CONSTRAINT reviews_publish_timestamp CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT reviews_moderation_complete CHECK (
    status = 'pending' OR (moderated_by IS NOT NULL AND moderated_at IS NOT NULL)
  )
);

CREATE TABLE review_subratings (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  rating_key VARCHAR(60) NOT NULL,
  rating SMALLINT NOT NULL,
  PRIMARY KEY (review_id, rating_key),
  CONSTRAINT review_subratings_key_format CHECK (rating_key ~ '^[a-z][a-z0-9_]{0,59}$'),
  CONSTRAINT review_subratings_rating_range CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE review_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT review_photos_sort_nonnegative CHECK (sort_order >= 0)
);

CREATE TABLE review_helpful_votes (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_id, user_id)
);

CREATE TABLE review_moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  moderator_user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  from_status review_status NOT NULL,
  to_status review_status NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT review_moderation_status_changed CHECK (from_status <> to_status)
);

-- Interests and editorial content

CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(160) NOT NULL UNIQUE,
  name_en VARCHAR(180) NOT NULL,
  name_am VARCHAR(180) NOT NULL,
  tagline_en TEXT NOT NULL,
  tagline_am TEXT NOT NULL,
  guide_en TEXT NOT NULL,
  guide_am TEXT NOT NULL,
  hero_photo_url TEXT NOT NULL,
  card_photo_url TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE interest_destinations (
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  PRIMARY KEY (interest_id, destination_id)
);

CREATE TABLE interest_experience_categories (
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  PRIMARY KEY (interest_id, category)
);

CREATE TABLE interest_highlight_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  subtitle_en TEXT NOT NULL,
  subtitle_am TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE interest_highlight_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES interest_highlight_sections(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_am TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT highlight_item_has_target CHECK (experience_id IS NOT NULL OR destination_id IS NOT NULL)
);

CREATE TABLE local_flavor_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interest_id UUID NOT NULL UNIQUE REFERENCES interests(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  subtitle_en TEXT NOT NULL,
  subtitle_am TEXT NOT NULL
);

CREATE TABLE local_flavor_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES local_flavor_sections(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  author VARCHAR(120) NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT local_flavor_moment_has_target CHECK (experience_id IS NOT NULL OR destination_id IS NOT NULL)
);

CREATE UNIQUE INDEX local_flavor_one_featured
  ON local_flavor_moments (section_id)
  WHERE is_featured = TRUE;

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  slug VARCHAR(160) NOT NULL UNIQUE,
  photo_url TEXT NOT NULL,
  badge_en VARCHAR(160) NOT NULL,
  badge_am VARCHAR(160) NOT NULL,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  subtitle_en TEXT NOT NULL,
  subtitle_am TEXT NOT NULL,
  discount_en VARCHAR(160) NOT NULL,
  discount_am VARCHAR(160) NOT NULL,
  cta_en VARCHAR(180) NOT NULL,
  cta_am VARCHAR(180) NOT NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT promotions_date_order CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en TEXT NOT NULL,
  question_am TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_am TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A deliberately single-row table for the controls in /admin/settings.
CREATE TABLE site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  site_name VARCHAR(120) NOT NULL DEFAULT 'Ethiopidia',
  support_email VARCHAR(320) NOT NULL DEFAULT 'hello@ethiopidia.com',
  description TEXT NOT NULL DEFAULT '',
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  reviews_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  external_booking_links_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  amharic_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  default_language VARCHAR(5) NOT NULL DEFAULT 'en',
  currency_code CHAR(3) NOT NULL DEFAULT 'ETB',
  timezone VARCHAR(80) NOT NULL DEFAULT 'Africa/Addis_Ababa',
  weekly_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_settings_singleton CHECK (id = 1),
  CONSTRAINT site_settings_default_language CHECK (default_language IN ('en', 'am')),
  CONSTRAINT site_settings_currency_uppercase CHECK (currency_code = UPPER(currency_code))
);

INSERT INTO site_settings (id) VALUES (1);

-- Traveler activity

CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, hotel_id)
);

CREATE TABLE viewed_history (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, hotel_id)
);

-- Records the hand-off only; Ethiopidia does not own carts, availability, or
-- payments. anonymous_session_hash is an application-generated opaque hash.
CREATE TABLE outbound_booking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE RESTRICT,
  experience_id UUID REFERENCES experiences(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_session_hash BYTEA,
  destination_url TEXT NOT NULL,
  referrer_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT outbound_booking_exactly_one_entity CHECK (num_nonnulls(hotel_id, experience_id) = 1)
);

-- Leads and support

CREATE TABLE property_listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resulting_hotel_id UUID UNIQUE REFERENCES hotels(id) ON DELETE SET NULL,
  contact_name VARCHAR(120) NOT NULL,
  contact_role VARCHAR(100),
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  property_name VARCHAR(180) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  star_class SMALLINT,
  room_count INTEGER,
  description TEXT,
  city_region VARCHAR(160) NOT NULL,
  address TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  consented_at TIMESTAMPTZ NOT NULL,
  status listing_request_status NOT NULL DEFAULT 'pending',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT listing_request_star_range CHECK (star_class IS NULL OR star_class BETWEEN 1 AND 5),
  CONSTRAINT listing_request_rooms_positive CHECK (room_count IS NULL OR room_count > 0)
);

CREATE TABLE property_listing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES property_listing_requests(id) ON DELETE CASCADE,
  kind media_kind NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  original_filename TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE property_listing_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES property_listing_requests(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  from_status listing_request_status NOT NULL,
  to_status listing_request_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT listing_status_changed CHECK (from_status <> to_status)
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT NOT NULL,
  status contact_message_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Append-only administrative audit trail. Application permissions should
-- allow INSERT/SELECT but not UPDATE/DELETE for this table.
CREATE TABLE audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id TEXT,
  before_data JSONB,
  after_data JSONB,
  request_id UUID,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT audit_log_action_format CHECK (action ~ '^[a-z][a-z0-9_.-]{1,99}$'),
  CONSTRAINT audit_log_resource_format CHECK (resource_type ~ '^[a-z][a-z0-9_.-]{1,99}$')
);

-- Query indexes

CREATE INDEX destinations_status_sort_idx ON destinations (status, sort_order);
CREATE INDEX user_sessions_user_expiry_idx ON user_sessions (user_id, expires_at DESC);
CREATE INDEX user_identities_user_idx ON user_identities (user_id);
CREATE INDEX user_sessions_expiry_idx ON user_sessions (expires_at);
CREATE INDEX email_verification_tokens_user_idx ON email_verification_tokens (user_id, expires_at DESC);
CREATE INDEX password_reset_tokens_user_idx ON password_reset_tokens (user_id, expires_at DESC);
CREATE INDEX hotels_destination_status_idx ON hotels (destination_id, status);
CREATE INDEX hotels_search_filter_idx ON hotels (property_type, star_rating, guest_rating, price_from_etb);
CREATE INDEX hotels_featured_idx ON hotels (is_featured) WHERE is_featured = TRUE;
CREATE INDEX property_memberships_user_idx ON property_memberships (user_id, created_at DESC);
CREATE INDEX hotel_amenities_amenity_idx ON hotel_amenities (amenity_id, hotel_id);
CREATE INDEX room_types_hotel_active_idx ON room_types (hotel_id, active, sort_order);
CREATE INDEX experiences_destination_status_idx ON experiences (destination_id, status);
CREATE INDEX experiences_category_idx ON experiences (category);
CREATE INDEX reviews_subject_published_idx ON reviews (review_subject_id, published_at DESC) WHERE status = 'published';
CREATE INDEX reviews_author_email_idx ON reviews (author_email, created_at DESC);
CREATE INDEX reviews_user_created_idx ON reviews (user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX reviews_moderation_queue_idx ON reviews (created_at) WHERE status = 'pending';
CREATE INDEX review_helpful_votes_user_idx ON review_helpful_votes (user_id, created_at DESC);
CREATE INDEX review_moderation_events_review_idx ON review_moderation_events (review_id, created_at DESC);
CREATE INDEX favorites_user_added_idx ON favorites (user_id, added_at DESC);
CREATE INDEX viewed_history_user_viewed_idx ON viewed_history (user_id, viewed_at DESC);
CREATE INDEX faqs_status_sort_idx ON faqs (status, sort_order);
CREATE INDEX outbound_booking_events_hotel_idx ON outbound_booking_events (hotel_id, created_at DESC) WHERE hotel_id IS NOT NULL;
CREATE INDEX outbound_booking_events_experience_idx ON outbound_booking_events (experience_id, created_at DESC) WHERE experience_id IS NOT NULL;
CREATE INDEX listing_requests_status_created_idx ON property_listing_requests (status, created_at DESC);
CREATE INDEX listing_requests_submitter_idx ON property_listing_requests (submitted_by, created_at DESC) WHERE submitted_by IS NOT NULL;
CREATE INDEX listing_request_events_request_idx ON property_listing_status_events (request_id, created_at DESC);
CREATE INDEX contact_messages_status_created_idx ON contact_messages (status, created_at DESC);
CREATE INDEX audit_log_resource_idx ON audit_log (resource_type, resource_id, created_at DESC);
CREATE INDEX audit_log_actor_idx ON audit_log (actor_user_id, created_at DESC) WHERE actor_user_id IS NOT NULL;

-- Keep the denormalized card/search rating fields in sync with published
-- reviews. They are caches; reviews remain the source of truth.
CREATE OR REPLACE FUNCTION refresh_review_subject_stats(subject_id UUID)
RETURNS VOID AS $$
DECLARE
  target_hotel_id UUID;
  target_experience_id UUID;
  average_rating NUMERIC(3, 2);
  total_reviews INTEGER;
BEGIN
  SELECT hotel_id, experience_id
  INTO target_hotel_id, target_experience_id
  FROM review_subjects
  WHERE id = subject_id;

  SELECT ROUND(AVG(rating)::NUMERIC, 2), COUNT(*)::INTEGER
  INTO average_rating, total_reviews
  FROM reviews
  WHERE review_subject_id = subject_id AND status = 'published';

  IF target_hotel_id IS NOT NULL THEN
    UPDATE hotels
    SET guest_rating = average_rating, review_count = total_reviews
    WHERE id = target_hotel_id;
  ELSIF target_experience_id IS NOT NULL THEN
    UPDATE experiences
    SET guest_rating = average_rating, review_count = total_reviews
    WHERE id = target_experience_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reviews_after_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_review_subject_stats(OLD.review_subject_id);
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.review_subject_id <> NEW.review_subject_id THEN
    PERFORM refresh_review_subject_stats(OLD.review_subject_id);
  END IF;

  PERFORM refresh_review_subject_stats(NEW.review_subject_id);

  IF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
    INSERT INTO review_moderation_events (
      review_id, moderator_user_id, from_status, to_status, reason
    ) VALUES (
      NEW.id, NEW.moderated_by, OLD.status, NEW.status, NEW.moderation_reason
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Keep updated_at reliable regardless of which API client writes data.

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER user_profiles_set_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER user_identities_set_updated_at BEFORE UPDATE ON user_identities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER destinations_set_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER destination_guide_sections_set_updated_at BEFORE UPDATE ON destination_guide_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER amenities_set_updated_at BEFORE UPDATE ON amenities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hotels_set_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER property_memberships_set_updated_at BEFORE UPDATE ON property_memberships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hotel_policies_set_updated_at BEFORE UPDATE ON hotel_policies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER room_types_set_updated_at BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER experiences_set_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER interests_set_updated_at BEFORE UPDATE ON interests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER promotions_set_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER faqs_set_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER property_listing_requests_set_updated_at BEFORE UPDATE ON property_listing_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER contact_messages_set_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reviews_refresh_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION reviews_after_change();

COMMIT;

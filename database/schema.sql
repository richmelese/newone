-- Ethiopidia PostgreSQL schema
-- PostgreSQL 15+

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('traveler', 'property_owner', 'editor', 'admin');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE property_type AS ENUM ('hotel', 'resort', 'guesthouse', 'lodge', 'boutique', 'serviced_apartment');
CREATE TYPE listing_request_status AS ENUM ('new', 'reviewing', 'approved', 'rejected', 'onboarding', 'completed');
CREATE TYPE contact_message_status AS ENUM ('new', 'in_progress', 'resolved', 'spam');
CREATE TYPE media_kind AS ENUM ('image', 'video');

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
  name VARCHAR(120) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'traveler',
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_normalized CHECK (email = LOWER(BTRIM(email)))
);

CREATE UNIQUE INDEX users_email_unique ON users (LOWER(email));

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
  owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  property_type property_type NOT NULL,
  star_rating SMALLINT,
  guest_rating NUMERIC(3, 2),
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
  CONSTRAINT hotels_guest_rating_range CHECK (guest_rating IS NULL OR guest_rating BETWEEN 0 AND 10),
  CONSTRAINT hotels_price_nonnegative CHECK (price_from_etb IS NULL OR price_from_etb >= 0),
  CONSTRAINT hotels_latitude_range CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CONSTRAINT hotels_longitude_range CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CONSTRAINT hotels_external_booking_complete CHECK (
    booking_active = FALSE OR (external_booking_url IS NOT NULL AND external_site_name IS NOT NULL)
  )
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

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  comment_en TEXT NOT NULL,
  comment_am TEXT,
  visited_on DATE,
  published_at TIMESTAMPTZ,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
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
  bookable BOOLEAN NOT NULL DEFAULT FALSE,
  external_booking_url TEXT,
  external_site_name VARCHAR(160),
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT experiences_external_booking_complete CHECK (
    bookable = FALSE OR (external_booking_url IS NOT NULL AND external_site_name IS NOT NULL)
  )
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

-- Leads and support

CREATE TABLE property_listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
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
  status listing_request_status NOT NULL DEFAULT 'new',
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

-- Query indexes

CREATE INDEX destinations_status_sort_idx ON destinations (status, sort_order);
CREATE INDEX hotels_destination_status_idx ON hotels (destination_id, status);
CREATE INDEX hotels_search_filter_idx ON hotels (property_type, star_rating, guest_rating, price_from_etb);
CREATE INDEX hotels_featured_idx ON hotels (is_featured) WHERE is_featured = TRUE;
CREATE INDEX hotel_amenities_amenity_idx ON hotel_amenities (amenity_id, hotel_id);
CREATE INDEX room_types_hotel_active_idx ON room_types (hotel_id, active, sort_order);
CREATE INDEX reviews_hotel_published_idx ON reviews (hotel_id, published_at DESC) WHERE status = 'published';
CREATE INDEX experiences_destination_status_idx ON experiences (destination_id, status);
CREATE INDEX experiences_category_idx ON experiences (category);
CREATE INDEX favorites_user_added_idx ON favorites (user_id, added_at DESC);
CREATE INDEX viewed_history_user_viewed_idx ON viewed_history (user_id, viewed_at DESC);
CREATE INDEX listing_requests_status_created_idx ON property_listing_requests (status, created_at DESC);
CREATE INDEX contact_messages_status_created_idx ON contact_messages (status, created_at DESC);

-- Keep updated_at reliable regardless of which API client writes data.

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER destinations_set_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER destination_guide_sections_set_updated_at BEFORE UPDATE ON destination_guide_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER amenities_set_updated_at BEFORE UPDATE ON amenities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hotels_set_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hotel_policies_set_updated_at BEFORE UPDATE ON hotel_policies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER room_types_set_updated_at BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER experiences_set_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER interests_set_updated_at BEFORE UPDATE ON interests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER promotions_set_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER property_listing_requests_set_updated_at BEFORE UPDATE ON property_listing_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER contact_messages_set_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;

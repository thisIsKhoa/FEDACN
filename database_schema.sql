-- Standardized relational schema (PostgreSQL)
-- Notes:
-- 1) Avoid reserved names like USER by using users table.
-- 2) Use snake_case for consistency.
-- 3) Password is stored as password_hash, never plain text.

CREATE EXTENSION
IF NOT EXISTS pgcrypto;

-- =========================
-- ENUM TYPES
-- =========================
CREATE TYPE user_role AS ENUM
('CUSTOMER', 'STAFF', 'ADMIN');
CREATE TYPE tag_category AS ENUM
('SKILL', 'DOMAIN', 'INTEREST', 'KEYWORD');
CREATE TYPE room_type AS ENUM
('DESK', 'ROOM', 'MEETINGROOM');
CREATE TYPE space_status AS ENUM
('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');
CREATE TYPE booking_unit AS ENUM
('HOUR', 'DAY', 'WEEK', 'MONTH');
CREATE TYPE package_duration_type AS ENUM
('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE booking_status AS ENUM
('ACTIVE', 'CANCELLED', 'COMPLETED');
CREATE TYPE payment_status AS ENUM
('PENDING', 'CONFIRMED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM
('CASH', 'BANK_TRANSFER', 'CARD');
CREATE TYPE contract_status AS ENUM
('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');
CREATE TYPE connection_status AS ENUM
('PENDING', 'ACCEPTED', 'DECLINED');
CREATE TYPE suggestion_status AS ENUM
('PENDING', 'DISMISSED', 'CONNECTED');

-- =========================
-- CORE USER TABLES
-- =========================
CREATE TABLE users
(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE customer_profiles
(
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    linkedin_url TEXT,
    domain VARCHAR(255),
    expertise TEXT,
    loyalty_points INT NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0)
);

CREATE TABLE staff_profiles
(
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    employee_code VARCHAR(100) UNIQUE,
    department VARCHAR(255)
);

CREATE TABLE admin_profiles
(
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- TAGS
-- =========================
CREATE TABLE tags
(
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_name VARCHAR(100) NOT NULL UNIQUE,
    category tag_category NOT NULL
);

CREATE TABLE user_tags
(
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, tag_id)
);

CREATE INDEX idx_user_tags_tag_id ON user_tags(tag_id);

-- =========================
-- SPACES AND FLOORS
-- =========================
CREATE TABLE floors
(
    floor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    floor_number INT NOT NULL,
    description TEXT,
    UNIQUE (floor_number)
);

CREATE TABLE spaces (
    space_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_id UUID NOT NULL REFERENCES floors(floor_id) ON DELETE RESTRICT,
    name VARCHAR
(150) NOT NULL,
    room_type room_type NOT NULL,
    space_status space_status NOT NULL DEFAULT 'AVAILABLE',
    amenities TEXT,
    min_booking_unit booking_unit NOT NULL,
    capacity INT CHECK
(capacity IS NULL OR capacity > 0),
    space_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now
(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now
(),
    UNIQUE
(floor_id, name)
);

CREATE INDEX idx_spaces_floor_id ON spaces(floor_id);
CREATE INDEX idx_spaces_room_type ON spaces(room_type);
CREATE INDEX idx_spaces_space_status ON spaces(space_status);

-- =========================
-- SERVICE PACKAGES
-- =========================
CREATE TABLE service_packages
(
    package_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    duration_type package_duration_type NOT NULL,
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    description TEXT,
    max_bookings_per_period INT CHECK (max_bookings_per_period IS NULL OR max_bookings_per_period > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_packages_is_active ON service_packages(is_active);

-- =========================
-- BOOKINGS
-- =========================
CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    space_id UUID NOT NULL REFERENCES spaces
(space_id) ON
DELETE RESTRICT,
    package_id UUID
NOT NULL REFERENCES service_packages
(package_id) ON
DELETE RESTRICT,
    start_time TIMESTAMPTZ
NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_price NUMERIC
(12,2) NOT NULL CHECK
(total_price >= 0),
    booking_status booking_status NOT NULL DEFAULT 'ACTIVE',
    is_walk_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now
(),
    CHECK
(end_time > start_time)
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_space_id ON bookings(space_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);

-- Optional (PostgreSQL advanced): prevent overlapping ACTIVE bookings per space.
-- Requires extension btree_gist.
-- CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ALTER TABLE bookings
--   ADD CONSTRAINT no_overlap_active_booking
--   EXCLUDE USING gist (
--       space_id WITH =,
--       tstzrange(start_time, end_time, '[)') WITH &&
--   ) WHERE (booking_status = 'ACTIVE');

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    confirmed_by UUID REFERENCES users
(user_id) ON
DELETE
SET NULL
,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    amount NUMERIC
(12,2) NOT NULL CHECK
(amount >= 0),
    payment_method payment_method,
    paid_at TIMESTAMPTZ,
    transaction_id VARCHAR
(255),
    gateway_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now
()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- =========================
-- CANCELLATION
-- =========================
CREATE TABLE cancellation_policies
(
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(150) NOT NULL,
    min_days INT NOT NULL CHECK (min_days >= 0),
    max_days INT NOT NULL CHECK (max_days >= min_days),
    refund_percent NUMERIC(5,2) NOT NULL CHECK (refund_percent >= 0 AND refund_percent <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (min_days, max_days)
);

CREATE TABLE booking_cancellations (
    cancellation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    policy_id UUID NOT NULL REFERENCES cancellation_policies
(policy_id) ON
DELETE RESTRICT,
    refund_amount NUMERIC(12,2)
NOT NULL CHECK
(refund_amount >= 0),
    reason TEXT,
    cancelled_at TIMESTAMPTZ NOT NULL DEFAULT now
()
);

-- =========================
-- CONTRACTS
-- =========================
CREATE TABLE contracts (
    contract_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(user_id) ON DELETE RESTRICT,
    package_id UUID NOT NULL REFERENCES service_packages
(package_id) ON
DELETE RESTRICT,
    space_id UUID
NOT NULL REFERENCES spaces
(space_id) ON
DELETE RESTRICT,
    start_date DATE
NOT NULL,
    end_date DATE NOT NULL,
    total_value NUMERIC
(14,2) NOT NULL CHECK
(total_value >= 0),
    status contract_status NOT NULL DEFAULT 'DRAFT',
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now
(),
    CHECK
(end_date >= start_date)
);

CREATE INDEX idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- =========================
-- CONNECTIONS
-- =========================
CREATE TABLE connections
(
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status connection_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (requester_id <> receiver_id)
);

-- Prevent duplicate pair regardless of request direction.
CREATE UNIQUE INDEX uq_connections_pair
ON connections (
    LEAST
(requester_id, receiver_id),
    GREATEST
(requester_id, receiver_id)
);

CREATE INDEX idx_connections_status ON connections(status);

-- =========================
-- SUGGESTIONS
-- =========================
CREATE TABLE suggestions
(
    suggestion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    suggested_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    match_score NUMERIC(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    match_reasons JSONB,
    status suggestion_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (user_id <> suggested_user_id),
    UNIQUE (user_id, suggested_user_id)
);

CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);

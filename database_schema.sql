-- ==========================================
-- 0. EXTENSIONS SETUP
-- ==========================================
CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
-- Extension này cần thiết cho tính năng EXCLUDE chống overlap thời gian booking
CREATE EXTENSION
IF NOT EXISTS "btree_gist";

-- ==========================================
-- 1. ENUMS (Kiểu dữ liệu)
-- ==========================================
CREATE TYPE user_status AS ENUM
('active', 'suspended');
CREATE TYPE user_role AS ENUM
('admin', 'staff', 'customer');
CREATE TYPE membership_tier AS ENUM
('standard', 'premium');
CREATE TYPE branch_status AS ENUM
('active', 'inactive');
CREATE TYPE workspace_status AS ENUM
('active', 'maintenance', 'inactive');
CREATE TYPE maintenance_status AS ENUM
('scheduled', 'active', 'done', 'canceled');
CREATE TYPE duration_unit AS ENUM
('hour', 'day', 'week', 'month');
CREATE TYPE booking_status AS ENUM
('pending_payment', 'confirmed', 'checked_in', 'completed', 'canceled', 'expired');
CREATE TYPE booking_source AS ENUM
('web', 'mobile', 'counter', 'admin');
CREATE TYPE payment_provider AS ENUM
('momo', 'cash');
CREATE TYPE payment_method AS ENUM
('ewallet', 'qr', 'cash');
CREATE TYPE payment_status AS ENUM
('initiated', 'pending', 'paid', 'failed', 'expired', 'canceled', 'refunded');
CREATE TYPE cancel_rule_type AS ENUM
('GRACE_HOURS', 'BEFORE_START_DAYS');
CREATE TYPE refund_status AS ENUM
('none', 'pending', 'confirmed', 'rejected');
CREATE TYPE tag_category AS ENUM
('skill', 'interest', 'industry');
CREATE TYPE service_type AS ENUM
('drink', 'meal', 'printing', 'other');

-- ==========================================
-- 2. TABLES CREATION
-- ==========================================

CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(2048),
    status user_status NOT NULL DEFAULT 'active',
    role user_role NOT NULL,
    branch_id UUID,
    -- admin/customer usually null; staff must have branch_id
    membership_tier membership_tier NOT NULL DEFAULT 'standard',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_accounts
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    provider VARCHAR(20) NOT NULL,
    -- e.g., 'google'
    provider_user_id VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_user_id)
);

CREATE TABLE profiles
(
    user_id UUID PRIMARY KEY,
    bio TEXT,
    profession VARCHAR(120),
    company VARCHAR(120),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_link VARCHAR(2048),
    contact_public BOOLEAN NOT NULL DEFAULT false,
    primary_branch_id UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE branches
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(80),
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    status branch_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tags
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) NOT NULL UNIQUE,
    category tag_category NOT NULL DEFAULT 'skill',
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE profile_skills
(
    profile_user_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    level SMALLINT,
    PRIMARY KEY (profile_user_id, tag_id)
);

CREATE TABLE profile_interests
(
    profile_user_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    priority SMALLINT,
    PRIMARY KEY (profile_user_id, tag_id)
);

CREATE TABLE profile_match_scores
(
    profile_user_id UUID NOT NULL,
    matched_user_id UUID NOT NULL,
    score NUMERIC(6,4) NOT NULL,
    reasons_json JSONB,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_user_id, matched_user_id)
);

CREATE TABLE floors
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL,
    floor_no INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    svg_url VARCHAR(2048) NOT NULL,
    map_version INT NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (branch_id, floor_no)
);

CREATE TABLE workspace_types
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    -- desk, meeting_room, private_office
    name VARCHAR(100) NOT NULL,
    capacity_default INT NOT NULL DEFAULT 1
);

CREATE TABLE workspaces
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL,
    workspace_type_id UUID NOT NULL,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(120) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    svg_element_id VARCHAR(100) NOT NULL,
    status workspace_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (floor_id, code),
    UNIQUE (floor_id, svg_element_id)
);

CREATE TABLE workspace_maintenance
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    reason VARCHAR(255),
    status maintenance_status NOT NULL DEFAULT 'scheduled',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE price_policies
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID,
    workspace_type_id UUID NOT NULL,
    duration_unit duration_unit NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    unit duration_unit NOT NULL,
    unit_count INT NOT NULL DEFAULT 1,
    is_contract BOOLEAN NOT NULL DEFAULT false,
    status booking_status NOT NULL,
    subtotal_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    addon_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_deadline_at TIMESTAMPTZ,
    source booking_source NOT NULL DEFAULT 'web',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checkin_logs
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    staff_user_id UUID NOT NULL,
    checkin_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checkout_at TIMESTAMPTZ,
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    provider payment_provider NOT NULL,
    method payment_method NOT NULL,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    request_id VARCHAR(100),
    amount NUMERIC(12,2) NOT NULL,
    status payment_status NOT NULL,
    provider_trans_id VARCHAR(120),
    pay_url VARCHAR(2048),
    signature_valid BOOLEAN,
    raw_response JSONB,
    paid_at TIMESTAMPTZ,
    created_by_staff_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_trans_id)
);

CREATE TABLE payment_events
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    idempotency_key VARCHAR(120) NOT NULL UNIQUE,
    provider_event_id VARCHAR(120),
    signature VARCHAR(500),
    signature_valid BOOLEAN,
    payload_json JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cancellation_policies
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    rule_type cancel_rule_type NOT NULL,
    min_value INT,
    max_value INT,
    refund_percent NUMERIC(5,2) NOT NULL,
    priority INT NOT NULL DEFAULT 100,
    branch_id UUID,
    workspace_type_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking_cancellations
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE,
    policy_id UUID,
    refund_percent NUMERIC(5,2) NOT NULL,
    refund_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    penalty_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    reason VARCHAR(255),
    cancelled_by UUID NOT NULL,
    cancelled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    refund_status refund_status NOT NULL DEFAULT 'none',
    refund_confirmed_by UUID,
    refund_confirmed_at TIMESTAMPTZ,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE extra_services
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    service_type service_type NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking_services
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    extra_service_id UUID NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID,
    actor_role VARCHAR(20),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(60) NOT NULL,
    target_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. CHECK CONSTRAINTS & ADVANCED INDEXES
-- ==========================================

-- CHECK: user_id và matched_user_id không được trùng nhau
ALTER TABLE profile_match_scores 
ADD CONSTRAINT chk_match_scores_diff_users 
CHECK (profile_user_id <> matched_user_id);

-- CHECK & EXCLUDE: Chống trùng lịch Booking (no-overlap) cho cùng 1 workspace.
ALTER TABLE bookings
ADD CONSTRAINT no_overlap_bookings 
EXCLUDE USING gist
(
    workspace_id
WITH =,
    tstzrange
(start_at, end_at)
WITH &&
)
WHERE
(status IN
('pending_payment', 'confirmed', 'checked_in'));

-- UNIQUE INDEX: Chỉ cho phép một lần check-in active duy nhất cho mỗi booking
CREATE UNIQUE INDEX idx_single_active_checkin 
ON checkin_logs (booking_id) 
WHERE checkout_at IS NULL;

-- INDEX tối ưu tra cứu cho các trường khóa ngoại hay dùng (Performance)
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_auth_accounts_user_id ON auth_accounts(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_branch_id ON bookings(branch_id);
CREATE INDEX idx_bookings_workspace_id ON bookings(workspace_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_booking_services_booking_id ON booking_services(booking_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_user_id);

-- ==========================================
-- 4. FOREIGN KEYS (Relationships)
-- ==========================================

ALTER TABLE users ADD CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id);

ALTER TABLE auth_accounts ADD CONSTRAINT fk_auth_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE profiles ADD CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_primary_branch FOREIGN KEY (primary_branch_id) REFERENCES branches(id);

ALTER TABLE profile_skills ADD CONSTRAINT fk_skills_profile FOREIGN KEY (profile_user_id) REFERENCES profiles(user_id);
ALTER TABLE profile_skills ADD CONSTRAINT fk_skills_tag FOREIGN KEY (tag_id) REFERENCES tags(id);

ALTER TABLE profile_interests ADD CONSTRAINT fk_interests_profile FOREIGN KEY (profile_user_id) REFERENCES profiles(user_id);
ALTER TABLE profile_interests ADD CONSTRAINT fk_interests_tag FOREIGN KEY (tag_id) REFERENCES tags(id);

ALTER TABLE profile_match_scores ADD CONSTRAINT fk_match_profile FOREIGN KEY (profile_user_id) REFERENCES profiles(user_id);
ALTER TABLE profile_match_scores ADD CONSTRAINT fk_match_matched FOREIGN KEY (matched_user_id) REFERENCES profiles(user_id);

ALTER TABLE floors ADD CONSTRAINT fk_floors_branch FOREIGN KEY (branch_id) REFERENCES branches(id);

ALTER TABLE workspaces ADD CONSTRAINT fk_ws_floor FOREIGN KEY (floor_id) REFERENCES floors(id);
ALTER TABLE workspaces ADD CONSTRAINT fk_ws_type FOREIGN KEY (workspace_type_id) REFERENCES workspace_types(id);

ALTER TABLE workspace_maintenance ADD CONSTRAINT fk_ws_maint_ws FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
ALTER TABLE workspace_maintenance ADD CONSTRAINT fk_ws_maint_created FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE price_policies ADD CONSTRAINT fk_price_branch FOREIGN KEY (branch_id) REFERENCES branches(id);
ALTER TABLE price_policies ADD CONSTRAINT fk_price_ws_type FOREIGN KEY (workspace_type_id) REFERENCES workspace_types(id);
ALTER TABLE price_policies ADD CONSTRAINT fk_price_created FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_branch FOREIGN KEY (branch_id) REFERENCES branches(id);

ALTER TABLE checkin_logs ADD CONSTRAINT fk_checkin_booking FOREIGN KEY (booking_id) REFERENCES bookings(id);
ALTER TABLE checkin_logs ADD CONSTRAINT fk_checkin_staff FOREIGN KEY (staff_user_id) REFERENCES users(id);

ALTER TABLE payments ADD CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id);
ALTER TABLE payments ADD CONSTRAINT fk_payments_staff FOREIGN KEY (created_by_staff_id) REFERENCES users(id);

ALTER TABLE payment_events ADD CONSTRAINT fk_pay_events_payment FOREIGN KEY (payment_id) REFERENCES payments(id);

ALTER TABLE cancellation_policies ADD CONSTRAINT fk_canc_branch FOREIGN KEY (branch_id) REFERENCES branches(id);
ALTER TABLE cancellation_policies ADD CONSTRAINT fk_canc_ws_type FOREIGN KEY (workspace_type_id) REFERENCES workspace_types(id);

ALTER TABLE booking_cancellations ADD CONSTRAINT fk_bc_booking FOREIGN KEY (booking_id) REFERENCES bookings(id);
ALTER TABLE booking_cancellations ADD CONSTRAINT fk_bc_policy FOREIGN KEY (policy_id) REFERENCES cancellation_policies(id);
ALTER TABLE booking_cancellations ADD CONSTRAINT fk_bc_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES users(id);
ALTER TABLE booking_cancellations ADD CONSTRAINT fk_bc_refund_by FOREIGN KEY (refund_confirmed_by) REFERENCES users(id);

ALTER TABLE booking_services ADD CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id);
ALTER TABLE booking_services ADD CONSTRAINT fk_bs_extra_srv FOREIGN KEY (extra_service_id) REFERENCES extra_services(id);

ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id);
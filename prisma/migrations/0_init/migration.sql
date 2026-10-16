CREATE TYPE user_role AS ENUM ('client', 'instructor', 'admin');
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL, password_hash TEXT, name TEXT NOT NULL, phone TEXT,
  role user_role NOT NULL DEFAULT 'client', is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE SET NULL, name TEXT NOT NULL, bio TEXT, photo_url TEXT, is_active BOOLEAN NOT NULL DEFAULT true);
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT, price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'RUB', duration_days INTEGER NOT NULL, is_active BOOLEAN NOT NULL DEFAULT true);
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active', starts_at TIMESTAMPTZ NOT NULL, ends_at TIMESTAMPTZ NOT NULL);
CREATE TYPE class_level AS ENUM ('beginner', 'intermediate', 'advanced', 'all');
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT, instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  level class_level NOT NULL DEFAULT 'all', starts_at TIMESTAMPTZ NOT NULL, duration_min INTEGER NOT NULL DEFAULT 60, capacity INTEGER, stream_url TEXT, is_published BOOLEAN NOT NULL DEFAULT false);
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','attended','cancelled')), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (user_id, class_id));
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id), subscription_id UUID REFERENCES subscriptions(id), amount_cents INTEGER NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'RUB', status payment_status NOT NULL DEFAULT 'pending', provider TEXT, provider_ref TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, contact TEXT NOT NULL, message TEXT, source TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','done','spam')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, cover_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false, published_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), author_name TEXT NOT NULL, text TEXT NOT NULL, is_published BOOLEAN NOT NULL DEFAULT false);
CREATE INDEX idx_classes_starts_at ON classes(starts_at);
CREATE INDEX idx_bookings_class ON bookings(class_id);
CREATE INDEX idx_subs_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_leads_status ON leads(status, created_at DESC);

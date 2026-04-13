-- AUCA Student Mentorship Portal Database Schema
-- Database: PostgreSQL
-- Author: Confiance UFITAMAHORO (ID: 27185)
-- Institution: AUCA Rwanda
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Enable UUID extension for better ID management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================================
-- AUCA Student Mentorship Portal - Database Schema
-- ============================================================

-- Users table (mentees, mentors, admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('mentee', 'mentor', 'admin')),
    profile_picture VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentor profiles (extra info for approved mentors)
CREATE TABLE mentor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expertise TEXT[],                  -- e.g. ['Python', 'Web Dev']
    department VARCHAR(100),
    year_of_study VARCHAR(50),
    availability TEXT,
    approval_status VARCHAR(20) DEFAULT 'pending'
        CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions between mentees and mentors
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mentee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    meeting_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback from mentees after completed sessions
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    mentee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sessions_mentor ON sessions(mentor_id);
CREATE INDEX idx_sessions_mentee ON sessions(mentee_id);
CREATE INDEX idx_feedback_mentor ON feedback(mentor_id);
CREATE INDEX idx_mentor_profiles_status ON mentor_profiles(approval_status);

TRUNCATE feedback, sessions, mentor_profiles, users RESTART IDENTITY CASCADE;
-- ============================================================
-- Seed Data for AUCA Mentorship Portal
-- Admin password: password123 | Others password: password
-- ============================================================

-- Use this for "Test Mentee" and "Test Mentor"
-- Password is: password
-- 1. Clear everything first
-- ============================================================
-- FULL RESET AND SEED FOR AUCA MENTORSHIP PORTAL
-- ============================================================


CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- PERMANENT FIX: SEED WITH DATABASE-GENERATED HASHES
-- ============================================================

-- 1. Clear everything
TRUNCATE feedback, sessions, mentor_profiles, users RESTART IDENTITY CASCADE;

-- 2. Insert Users using crypt()
-- This generates a fresh, local hash for 'password123' and 'password'
INSERT INTO users (name, email, password_hash, role, bio) VALUES
('Admin User', 'admin@auca.ac.rw',
  crypt('password123', gen_salt('bf', 10)), 'admin', 'System administrator');


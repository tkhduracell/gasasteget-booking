-- ============================================================
-- Gasasteget Booking: Roles & Permissions Schema
-- Run this in the Supabase SQL Editor after creating your project.
-- ============================================================

-- Table: roles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: permissions
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: role_permissions (many-to-many)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Table: user_roles (links auth.users to roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  PRIMARY KEY (user_id, role_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);

-- ============================================================
-- Seed: Roles
-- ============================================================
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Full system access'),
  ('manager', 'Manage bookings and users'),
  ('user', 'Standard booking user')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Seed: Permissions
-- ============================================================
INSERT INTO public.permissions (action, description) VALUES
  ('bookings.create', 'Create new bookings'),
  ('bookings.read', 'View bookings'),
  ('bookings.update', 'Modify bookings'),
  ('bookings.delete', 'Cancel bookings'),
  ('users.read', 'View user list'),
  ('users.manage', 'Manage user accounts'),
  ('roles.assign', 'Assign roles to users')
ON CONFLICT (action) DO NOTHING;

-- ============================================================
-- Seed: Role-Permission mappings
-- ============================================================

-- Admin gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM public.roles r, public.permissions p
  WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Manager gets booking CRUD + user read
INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM public.roles r, public.permissions p
  WHERE r.name = 'manager'
    AND p.action IN ('bookings.create', 'bookings.read', 'bookings.update', 'bookings.delete', 'users.read')
ON CONFLICT DO NOTHING;

-- User gets basic booking access
INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM public.roles r, public.permissions p
  WHERE r.name = 'user'
    AND p.action IN ('bookings.create', 'bookings.read')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read roles, permissions, and role_permissions
CREATE POLICY "Authenticated users can read roles"
  ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read permissions"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read role_permissions"
  ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- Users can read their own role assignments; admins can read all
CREATE POLICY "Users can read own roles or admins can read all"
  ON public.user_roles FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Only admins can insert/update/delete user_roles
CREATE POLICY "Admins can manage user_roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can delete user_roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- ============================================================
-- Helper functions
-- ============================================================

-- Check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id UUID, p_action TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id AND p.action = p_action
  );
$$;

-- Get all role names for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id UUID)
RETURNS TABLE(role_name TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT r.name
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id;
$$;

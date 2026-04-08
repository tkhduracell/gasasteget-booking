export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string | null;
}

export interface UserWithPermissions {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AccessRequest {
  id: string;
  user_id: string;
  name: string;
  email: string;
  community_role: string;
  status: "pending" | "approved" | "denied";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

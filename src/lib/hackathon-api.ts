const DEFAULT_API_BASE_URL = "/api";
const DEFAULT_SOCKET_URL = "";

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL,
);

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
  errors?: string[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiError | null;

  if (!response.ok || !payload || payload.success === false) {
    const message = payload && payload.success === false ? payload.message : "Request failed";
    const errors = payload && payload.success === false && payload.errors ? payload.errors : [];
    throw new Error(errors.length > 0 ? `${message}: ${errors.join(", ")}` : message);
  }

  return payload.data;
}

export type RegistrationMember = {
  name: string;
  email: string;
  branch: string;
  year: string;
  gender: string;
};

export type RegistrationPayload = {
  teamName: string;
  collegeName: string;
  track: string;
  teamSize: number;
  ideaPitch: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    branch: string;
    year: string;
    gender: string;
  };
  members: RegistrationMember[];
};

export type TeamRecord = {
  _id: string;
  teamName: string;
  collegeName: string;
  track: string;
  teamSize: number;
  ideaPitch: string;
  leader: {
    name: string;
    email: string;
    phone?: string;
    branch: string;
    year: string;
    gender: string;
  };
  members: RegistrationMember[];
  status: "pending" | "round1" | "round2" | "winner" | "rejected";
  createdAt?: string;
  updatedAt?: string;
};

export async function registerTeam(payload: RegistrationPayload) {
  return request<{ team: TeamRecord }>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchResults(status: "round1" | "round2" | "winner") {
  return request<{ teams: TeamRecord[] }>(`/results/${status === "winner" ? "winners" : status}`);
}

// ---- Admin ----

const ADMIN_TOKEN_KEY = "hackathon_admin_token";
const ADMIN_PROFILE_KEY = "hackathon_admin_profile";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type TeamStatus = TeamRecord["status"];

export type DashboardStats = {
  totalTeams: number;
  pending: number;
  round1: number;
  round2: number;
  winners: number;
  rejected: number;
};

export type TeamsPage = {
  teams: TeamRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminProfile(): AdminProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminProfile;
  } catch {
    return null;
  }
}

export function storeAdminSession(token: string, admin: AdminProfile) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (!token) throw new UnauthorizedError("Authentication required");
  return { Authorization: `Bearer ${token}` };
}

export class UnauthorizedError extends Error {}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await request<T>(path, {
      ...init,
      headers: {
        ...authHeaders(),
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      /authentication required|invalid or expired token|unauthorized/i.test(error.message)
    ) {
      throw new UnauthorizedError(error.message);
    }
    throw error;
  }
}

export async function adminLogin(email: string, password: string) {
  return request<{ token: string; admin: AdminProfile }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchDashboardStats() {
  return adminRequest<DashboardStats>("/admin/dashboard");
}

export async function fetchTeams(params: {
  page?: number;
  limit?: number;
  status?: TeamStatus | "";
  search?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<TeamsPage>(`/teams${suffix}`);
}

export async function updateTeamStatus(teamId: string, status: TeamStatus) {
  return adminRequest<{ team: TeamRecord }>(`/team/${teamId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteTeamById(teamId: string) {
  return adminRequest<{ teamId: string }>(`/team/${teamId}`, {
    method: "DELETE",
  });
}

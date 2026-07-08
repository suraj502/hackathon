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

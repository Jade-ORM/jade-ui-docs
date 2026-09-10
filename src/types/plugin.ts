export type PluginChannel = "official" | "community";

export interface OfficialPlugin {
  name: string;
  version: string;
  description: string;
  path: string;
  core_module: string;
  jade: string;
}

export interface CommunityPluginOwner {
  githubId: number;
  login: string;
  avatarUrl: string;
}

export interface CommunityPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  jade: string;
  lua?: string;
  main: string;
  repository: string;
  keywords: string[];
  owner: CommunityPluginOwner;
  submittedAt: string;
  updatedAt: string;
}

export interface SessionUser {
  githubId: number;
  login: string;
  name: string | null;
  avatarUrl: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface CommunityListResponse {
  plugins: CommunityPlugin[];
}

export interface MeResponse {
  user: SessionUser | null;
}

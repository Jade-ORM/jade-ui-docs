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
  accessToken: string;
}

export interface PublicUser {
  githubId: number;
  login: string;
  name: string | null;
  avatarUrl: string;
}

export interface JadePluginManifest {
  name: string;
  version: string;
  description: string;
  jade: string;
  lua?: string;
  main: string;
  repository: string;
  keywords?: string[];
  author?: string;
  license?: string;
}

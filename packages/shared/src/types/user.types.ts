export type UserRole = 'VISITOR' | 'BUYER' | 'AGENT' | 'AGENCY_ADMIN' | 'OWNER' | 'MODERATOR' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage: string;
  preferredCurrency: string;
  preferredUnits: 'metric' | 'imperial';
  mfaEnabled: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'BUYER' | 'AGENT' | 'OWNER';
}

export const ROLES = {
  ADMIN: '3e1e1e1e-1111-4111-8111-111111111111',
  USER: '3e1e1e1e-1111-4111-8111-111111111112'
} as const;

export const DEFAULT_ROLE_ID = ROLES.USER;

export type RoleId = typeof ROLES[keyof typeof ROLES];
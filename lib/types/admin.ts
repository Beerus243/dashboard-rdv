export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "OBSERVER";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  adminRole: AdminRole;
  avatarUrl?: string | null;
};

export type AdminLoginResponse = {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
};

export type AdminUsersStats = {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  verifiedUsers: number;
  admins: number;
  newToday: number;
  newWeek: number;
  newMonth: number;
  totalMatches: number;
  totalMessages: number;
  openReports: number;
  pendingPhotos: number;
};

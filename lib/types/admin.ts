export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "OBSERVER";

export type ReportStatus = "OPEN" | "CLOSED";
export type PhotoModerationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type NotificationType = "MATCH" | "MESSAGE" | "LIKE" | "SYSTEM";

export type PaginatedMeta = {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};

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

export type AdminUserListItem = {
  id: string;
  email: string;
  name: string;
  adminRole: AdminRole | null;
  isActive: boolean;
  emailVerified: string | null;
  bannedAt: string | null;
  banReason: string | null;
  createdAt: string;
  matchCount: number;
  reportCount: number;
  profile?: {
    city?: string | null;
    gender?: string | null;
    avatarUrl?: string | null;
    lastActiveAt?: string | null;
  } | null;
};

export type AdminReport = {
  id: string;
  reason: string;
  description?: string | null;
  status: ReportStatus;
  createdAt: string;
  closedAt?: string | null;
  resolution?: string | null;
  reporter?: { id: string; name: string; email: string };
  reported?: {
    id: string;
    name: string;
    email: string;
    profile?: { avatarUrl?: string | null };
  };
  closedBy?: { id: string; name: string; adminRole?: AdminRole };
};

export type AdminModerationPhoto = {
  id: string;
  url: string;
  moderationStatus: PhotoModerationStatus;
  createdAt: string;
  profile?: {
    user?: { id: string; name: string; email: string };
  };
};

export type AdminModerationMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender?: { id: string; name: string };
  conversationId?: string;
};

export type AdminMatch = {
  id: string;
  createdAt: string;
  user1?: { id: string; name: string; profile?: { avatarUrl?: string | null; city?: string | null } };
  user2?: { id: string; name: string; profile?: { avatarUrl?: string | null; city?: string | null } };
};

export type AdminConversation = {
  id: string;
  createdAt: string;
  messageCount?: number;
  participants?: { id: string; name: string; avatarUrl?: string | null }[];
  lastMessage?: { content: string; createdAt: string } | null;
};

export type AdminChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender?: { id: string; name: string; avatarUrl?: string | null };
};

export type AdminNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  createdAt: string;
  user?: { id: string; name: string; email: string };
};

export type AdminAuditLog = {
  id: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  admin?: { id: string; name: string; email: string; adminRole?: AdminRole };
};

export type AdminHealth = {
  status: string;
  timestamp: string;
  services?: Record<string, string>;
};

export type StatGender = { gender: string; count: number };
export type StatAgeGroup = { group: string; count: number };
export type StatGeography = { city: string; count: number };
export type StatRevenue = { enabled: boolean; message?: string };

export type UpdateAdminUserBody = {
  name?: string;
  isActive?: boolean;
  banReason?: string;
  adminRole?: AdminRole | null;
};

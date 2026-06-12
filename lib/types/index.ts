export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  avatarUrl?: string | null;
  avatarThumbUrl?: string | null;
  profile?: {
    avatarUrl?: string | null;
    photos?: { url: string; order: number }[];
  } | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export type FeedProfile = {
  id: string;
  userId: string;
  bio?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  gender?: string | null;
  interestedIn?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
  job?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  lastSeen?: string | null;
  isComplete?: boolean;
  photos?: { url: string; order?: number; isPrimary?: boolean }[];
  user?: {
    id: string;
    name: string;
    email?: string;
  };
};

export type MatchItem = {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
    profile?: {
      bio?: string | null;
      city?: string | null;
      avatarUrl?: string | null;
      photos?: { url: string; order?: number }[];
    };
  };
};

export type LikePreview = {
  id: string;
  userId: string;
  name: string;
  age?: number | null;
  city?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  likedAt?: string;
};

export type MessageThread = {
  id: string;
  conversationId?: string;
  matchId?: string;
  otherUserId?: string;
  otherUserName: string;
  avatarUrl?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  isOnline?: boolean;
};

export type ExploreInterest = {
  id: string;
  name: string;
  subtitle?: string | null;
  slug: string;
  imageUrl?: string | null;
  nearbyProfiles?: number;
  icon?: string | null;
};

export type UserProfile = {
  id: string;
  userId: string;
  bio?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  interestedIn?: string | null;
  city?: string | null;
  job?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
  isComplete?: boolean;
  photos?: { id?: string; url: string; order?: number; isPrimary?: boolean }[];
};

export type FormSchema = {
  submit: { method: string; url: string };
  fields: { name: string; type: string; required: boolean; label: string; value?: unknown; options?: string[] }[];
};

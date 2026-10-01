export const categories = ["movies", "music", "games"] as const;
export type Category = (typeof categories)[number];

export type Person = {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  header: string;
  followers: number;
  following: number;
  visibleCategories: Category[];
  isFollowing?: boolean;
};

export type CatalogItem = {
  id: string;
  providerId: string;
  category: Category;
  title: string;
  subtitle: string;
  year: number;
  image: string;
  backdrop?: string;
  description: string;
  metadata: string[];
  providerScore?: number;
};

export type Rating = {
  id: string;
  activityId?: string;
  user: Person;
  item: CatalogItem;
  score: number;
  note?: string;
  rank: number;
  createdAt: string;
  likes: number;
  liked?: boolean;
};

export type CatalogSearchResult = Pick<
  CatalogItem,
  "providerId" | "category" | "title" | "subtitle" | "year" | "image"
>;

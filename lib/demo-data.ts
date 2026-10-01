import type { CatalogItem, Category, Person, Rating } from "@/lib/types";

const image = (id: string, w = 800, h = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;

export const people: Person[] = [
  {
    username: "noahframes",
    name: "Noah Williams",
    bio: "Films after midnight, records on Sunday mornings, and games with impossible maps.",
    avatar: image("photo-1500648767791-00dcc994a43e", 300, 300),
    header: image("photo-1489599849927-2ee91cede3ba", 1600, 600),
    followers: 428,
    following: 183,
    visibleCategories: ["movies", "music", "games"],
    isFollowing: true
  },
  {
    username: "mayashelf",
    name: "Maya Chen",
    bio: "Finding the soft, strange, unforgettable things.",
    avatar: image("photo-1494790108377-be9c29b29330", 300, 300),
    header: image("photo-1511379938547-c1f69419868d", 1600, 600),
    followers: 972,
    following: 221,
    visibleCategories: ["movies", "music"]
  },
  {
    username: "alexplays",
    name: "Alex Morgan",
    bio: "Indie games, loud guitars, quiet cinema.",
    avatar: image("photo-1535713875002-d1d0cf377fde", 300, 300),
    header: image("photo-1511512578047-dfb367046420", 1600, 600),
    followers: 316,
    following: 405,
    visibleCategories: ["games", "music"]
  }
];

export const currentUser: Person = {
  username: "samira",
  name: "Samira",
  bio: "Collecting stories that stay with me.",
  avatar: image("photo-1534528741775-53994a69daeb", 300, 300),
  header: image("photo-1470229722913-7c0e2dbbafd3", 1600, 600),
  followers: 84,
  following: 112,
  visibleCategories: ["movies", "music", "games"]
};

export const catalog: CatalogItem[] = [
  { id: "m1", providerId: "157336", category: "movies", title: "Interstellar", subtitle: "Christopher Nolan", year: 2014, image: image("photo-1446776811953-b23d57bd21aa"), backdrop: image("photo-1446776877081-d282a0f896e2", 1800, 900), description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", metadata: ["Science Fiction", "2h 49m", "United States"], providerScore: 8.7 },
  { id: "m2", providerId: "496243", category: "movies", title: "Parasite", subtitle: "Bong Joon Ho", year: 2019, image: image("photo-1485846234645-a62644f84728"), description: "A cash-strapped family slowly insinuates itself into the home of a wealthy household.", metadata: ["Drama", "2h 12m", "South Korea"], providerScore: 8.5 },
  { id: "m3", providerId: "550", category: "movies", title: "Fight Club", subtitle: "David Fincher", year: 1999, image: image("photo-1489599849927-2ee91cede3ba"), description: "An insomniac office worker and a reckless soap maker form an underground fight club.", metadata: ["Drama", "2h 19m", "United States"], providerScore: 8.4 },
  { id: "m4", providerId: "372058", category: "movies", title: "Your Name", subtitle: "Makoto Shinkai", year: 2016, image: image("photo-1518709268805-4e9042af9f23"), description: "Two teenagers share a profound, magical connection after discovering they swap bodies.", metadata: ["Animation", "1h 46m", "Japan"], providerScore: 8.5 },
  { id: "a1", providerId: "ok-computer", category: "music", title: "OK Computer", subtitle: "Radiohead", year: 1997, image: image("photo-1493225457124-a3eb161ffa5f"), description: "Radiohead's landmark third studio album: anxious, expansive and eerily prescient.", metadata: ["Alternative Rock", "12 tracks", "53 min"], providerScore: 9.0 },
  { id: "a2", providerId: "blonde", category: "music", title: "Blonde", subtitle: "Frank Ocean", year: 2016, image: image("photo-1524368535928-5b5e00ddc76b"), description: "A fragmented, intimate meditation on youth, memory and desire.", metadata: ["Alternative R&B", "17 tracks", "60 min"], providerScore: 8.9 },
  { id: "a3", providerId: "rumours", category: "music", title: "Rumours", subtitle: "Fleetwood Mac", year: 1977, image: image("photo-1471478331149-c72f17e33c73"), description: "Immaculate pop songs shaped by the fractures inside the band that made them.", metadata: ["Soft Rock", "11 tracks", "40 min"], providerScore: 8.8 },
  { id: "a4", providerId: "vespertine", category: "music", title: "Vespertine", subtitle: "Björk", year: 2001, image: image("photo-1483412033650-1015ddeb83d1"), description: "A miniature world of intimate vocals, microbeats and glacial strings.", metadata: ["Art Pop", "12 tracks", "55 min"], providerScore: 8.7 },
  { id: "g1", providerId: "1942", category: "games", title: "The Witcher 3", subtitle: "CD Projekt RED", year: 2015, image: image("photo-1552820728-8b83bb6b773f"), description: "A story-driven open-world adventure set in a visually stunning fantasy universe.", metadata: ["RPG", "PC · Console", "Single player"], providerScore: 9.2 },
  { id: "g2", providerId: "119171", category: "games", title: "Hades", subtitle: "Supergiant Games", year: 2020, image: image("photo-1511512578047-dfb367046420"), description: "Defy the god of the dead as you hack and slash out of the Underworld.", metadata: ["Roguelike", "PC · Console", "Single player"], providerScore: 9.0 },
  { id: "g3", providerId: "25076", category: "games", title: "Red Dead Redemption 2", subtitle: "Rockstar Games", year: 2018, image: image("photo-1519074069444-1ba4fff66d16"), description: "An epic tale of honor and loyalty at the dawn of the modern age.", metadata: ["Adventure", "PC · Console", "Single player"], providerScore: 9.3 },
  { id: "g4", providerId: "7346", category: "games", title: "Inside", subtitle: "Playdead", year: 2016, image: image("photo-1493711662062-fa541adb3fc8"), description: "A dark, narrative-driven platformer combining intense action with challenging puzzles.", metadata: ["Puzzle platformer", "PC · Console", "Single player"], providerScore: 8.6 }
];

export const ratings: Rating[] = [
  { id: "r1", user: people[0], item: catalog[0], score: 9.5, note: "The rare blockbuster that feels more intimate every time I return to it.", rank: 1, createdAt: "12 min", likes: 28, liked: true },
  { id: "r2", user: people[1], item: catalog[5], score: 9, note: "Memory rendered as texture. Still finding new corners in it.", rank: 1, createdAt: "48 min", likes: 41 },
  { id: "r3", user: people[2], item: catalog[9], score: 9.5, note: "Every failed escape makes the next conversation better. Remarkable design.", rank: 1, createdAt: "2 hr", likes: 19 },
  { id: "r4", user: people[0], item: catalog[1], score: 9, note: "Funny until it isn't, and then it never lets go.", rank: 2, createdAt: "Yesterday", likes: 63 },
  { id: "r5", user: people[1], item: catalog[7], score: 10, note: "Tiny sounds, enormous feelings.", rank: 2, createdAt: "Yesterday", likes: 87 }
];

export const categoryLabels: Record<Category, string> = { movies: "Movies", music: "Albums", games: "Games" };

export function itemsFor(category: Category) {
  return catalog.filter((item) => item.category === category);
}

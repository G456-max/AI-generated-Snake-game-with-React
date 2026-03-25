export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 80;

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Composer Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400",
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "AI Composer Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/400/400",
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "AI Composer Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/400/400",
  },
];

import type { User as PrivyUser } from '@privy-io/react-auth';

export interface Game {
  id: string;
  title: string;
  image: string;
  url: string;
  genres: string[];
  orientation: string;
  author: string;
  plays: number;
  tournament?: {
    start_time: number;
    end_time: number;
  }
}

export interface PrismUser {
  id: string;
  privy_id: string;
  username: string;
  bio: string | null;
  avatar_id: string;
  wallet_signer: string;
}

export type AppUser = PrivyUser & { prism?: PrismUser };

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'Free' | 'Wagered';
  completed: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  reward: string;
  unlocksIn: string;
}

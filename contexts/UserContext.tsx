import type { AppUser, PrismUser } from '../types';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEnvironment } from '@/hooks/useEnvironment';

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  updateUserProfile: (data: Partial<PrismUser>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// @ts-expect-error meta.env is always defined in vite
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: privyUser, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { isTelegram } = useEnvironment();
  const [prismUser, setPrismUser] = useState<PrismUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrismUser = useCallback(async (privyId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_ENDPOINT}/api/user?privyId=${privyId}`);
      if (!response.ok) {
        // Assuming 404 means new user, otherwise throw
        if (response.status === 404) {
          console.log("User not found in backend, might be a new user.");
          setPrismUser(null);
          return;
        }
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setPrismUser(data.user);
    } catch (error) {
      console.error("Error fetching PRISM user:", error);
      setPrismUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated && privyUser) {
      fetchPrismUser(privyUser.id);
    } else {
      setPrismUser(null);
      setLoading(false);
    }
  }, [authenticated, privyUser, fetchPrismUser]);

  // Sync walletAddress only in Telegram environment
  useEffect(() => {
    if (!isTelegram) return;
    if (!prismUser) return;
    const nextWallet = wallets?.[0]?.address || '';
    if (nextWallet && nextWallet !== prismUser.wallet_signer) {
      setPrismUser({ ...prismUser, wallet_signer: nextWallet });
    }
  }, [isTelegram, wallets, prismUser]);

  const updateUserProfile = async (data: Partial<PrismUser>) => {
    if (!prismUser) return;
    console.log("Updating profile with:", data);
    const updatedUser = { ...prismUser, ...data };
    setPrismUser(updatedUser);
  };

  const mergedUser = privyUser ? {
    ...privyUser,
    prism: prismUser ? {
      ...prismUser,
      username: prismUser.username || `User${privyUser.id.slice(-5)}`,
      avatar_id: prismUser.avatar_id || `https://picsum.photos/seed/${privyUser.id}/200`
    } : {
      id: '',
      privy_id: privyUser.id,
      username: `User${privyUser.id.slice(-5)}`,
      bio: '',
      avatar_id: `https://picsum.photos/seed/${privyUser.id}/200`,
      wallet_signer: isTelegram ? (wallets?.[0]?.address || '') : '',
    }
  } : null;

  return (
    <UserContext.Provider value={{ user: mergedUser as AppUser, loading, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

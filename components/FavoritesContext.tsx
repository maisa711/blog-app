'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '@utils/firebase';

interface FavoritesContextValue {
  favoritePosts: string[];
  setFavoritePosts: React.Dispatch<React.SetStateAction<string[]>>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider = ({ children }:any) => {
  const { data: session } = useSession();
  const [favoritePosts, setFavoritePosts] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      const fetchFavorites = async () => {
        // @ts-ignore
        const docRef = doc(db, 'favorites', session?.user?.id as any);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFavoritePosts(docSnap.data().postIds || []);
        } else {
          await setDoc(docRef, { postIds: [] });
        }
      };

      fetchFavorites();
    }
  }, [session]);

  return (
    <FavoritesContext.Provider value={{ favoritePosts, setFavoritePosts }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  return useContext(FavoritesContext);
}

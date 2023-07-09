import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, getDocs, orderBy } from "firebase/firestore";
import { db } from "@utils/firebase";


const usePosts = (userid: string | null, setIsLoading:any) => {
  const [allPosts, setAllPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    let unsubscribePosts: Function;
    if (userid) {
        console.log("userid", userid);
        
        
        const unsubscribeFavorites = onSnapshot(doc(db, 'favorites', userid), async (favoritesSnapshot) => {
          const favoritesData = favoritesSnapshot.data();
          if (favoritesData && favoritesData.postIds) {
            const postIds = favoritesData.postIds;
            const postQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
            
            const postDocs = await getDocs(postQuery);
            const postsArr = postDocs.docs
              .map((doc) => ({ ...doc.data(), id: doc.id } as any))
              .filter((post) => postIds.includes(post.id));
  
            setAllPosts(postsArr as any);
            setIsLoading(false)
          }
        });
        return () => {
          unsubscribeFavorites();
          if (unsubscribePosts) unsubscribePosts();
        };
      }  else {
      unsubscribePosts = onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), (querySnapshot) => {
        const postsArr = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAllPosts(postsArr as any);
        setIsLoading(false)
      });
      return () => {
        unsubscribePosts();
      };
    }
  }, [userid]);

  return { allPosts, setDisplayPosts, displayPosts };
};
export default usePosts;
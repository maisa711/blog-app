'use client'

import { useEffect, useState } from "react";
import { Button, PostCardList } from "./Helpers";
import SearchBar from "./SearchBar";
import Profile from "./Profile";
import usePosts from "@hooks/usePosts";
import { useFavorites } from "./FavoritesContext";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";

const Feed = ({ userid }: any) => {
  console.log('there is a userid', userid);
  const { data: session } = useSession();

  // Feed info
  const [isLoading, setIsLoading] = useState(true);
  const { allPosts, displayPosts, setDisplayPosts } = usePosts(userid, setIsLoading);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const postsPerPage = 5;

  useEffect(() => {
    const filteredPosts = allPosts.filter((post: any) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('change');
    
    setDisplayPosts(filteredPosts.slice(pageIndex * postsPerPage, (pageIndex + 1) * postsPerPage));
  }, [searchQuery, pageIndex, allPosts]);

  const handleNext = () => {
    setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  const handlePrev = () => {
    setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
  };

  // Post info
  const { favoritePosts, setFavoritePosts } = useFavorites()!;

  if (isLoading) return <LoadingSpinner isLoading={isLoading} title={'Loading'} description={'Please wait while we process your request...'}/>;
  return (
    <>
      {userid ? (
        <Profile
          userid={userid}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          data={displayPosts}
          favoritePosts={favoritePosts}
          setFavoritePosts={setFavoritePosts}
        />
      ) : (
        <>
          <div className="">
            <div className="flex flex-col gap-5 md:gap-0 md:flex-row place-items-center p-5">
              <SearchBar searchQuery={searchQuery} handleSearchChange={(e: any) => { setSearchQuery(e.target.value) }} />
            </div>
            <PostCardList
              data={displayPosts}
              session={session}
              favoritePosts={favoritePosts}
              setFavoritePosts={setFavoritePosts}
            />

            <div className="flex justify-center my-4">
              {pageIndex > 0 && (<Button type="button" onClick={handlePrev} className="mx-2 py-2 px-4 bg-secondary hover:bg-secondary-hover text-white rounded-lg">Previous</Button>)}
              {displayPosts.length >= 5 && (<Button type="button" onClick={handleNext} className="mx-2 py-2 px-4 bg-secondary hover:bg-secondary-hover text-white rounded-lg">Next</Button>)}
            </div>
          </div>
        </>
      )}

    </>

  )
}

export default Feed
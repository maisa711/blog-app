"use client";

import SearchBar from "./SearchBar";
import { PostCardList, DisplayUserProfileMain } from "./Helpers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";

const Profile = ({
  userid,
  data,
  searchQuery,
  setSearchQuery,
  favoritePosts,
  setFavoritePosts,
}: any) => {
  const [loaderContent, setLoaderContent] = useState('Please wait while we load your profile...');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editedContent, setEditedContent] = useState({
    email: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/getUser/${userid}`);
      const data = await res.json();
      setUser(data.user);
      setEditedContent({
        email: data.user.email,
        image: data.user.image,
      });
      setIsLoading(false)
    };
    fetchUser();
  }, [userid, data]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading && (<LoadingSpinner isLoading={isLoading} title={'Loading'} description={loaderContent}/>)}

      {user && !isLoading && (
        <DisplayUserProfileMain session={session} user={user} isEditing={isEditing} setIsEditing={setIsEditing} selectedImage={selectedImage} setSelectedImage={setSelectedImage} editedContent={editedContent} setEditedContent={setEditedContent} setLoaderContent={setLoaderContent} setIsLoading={setIsLoading}/>
      )}

      <section className="w-full max-w-full flex justify-start flex-col">
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row place-items-center p-5">
          <SearchBar
            searchQuery={searchQuery}
            handleSearchChange={(e: any) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <PostCardList
          data={data}
          session={session}
          favoritePosts={favoritePosts}
          setFavoritePosts={setFavoritePosts}
        />
      </section>
    </div>
  );
};

export default Profile;

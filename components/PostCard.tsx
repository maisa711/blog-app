import Link from "next/link";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon } from '@heroicons/react/24/solid';

import { DisplayUserProfile } from './Helpers';
import { shortenString, toggleFavorite } from '@utils/utilFuncs';


const PostCard = ({ post, session, favoritePosts, setFavoritePosts }:any) => {
  const isFavorite = favoritePosts.includes(post.id);

  return (
    <div className="w-full p-6 bg-card-bg rounded-lg shadow-md hover:shadow-xl transition-shadow duration-100 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">

        <div className="flex items-center space-x-4 text-white w-full justify-between">
          <DisplayUserProfile
            linkHref={`/profile/${post?.creator?.id}`}
            linkClassname="flex flex-row w-fit justify-start items-center gap-5"
            imageSrc={post.creator.image}
            ImageClassname="h-10 w-10 rounded-full cursor-pointer"
            text={post.creator.name}
            textClassname="font-medium"
          />
          <span className="text-gray-400 text-sm">
            {new Date(post.timestamp.toDate()).toLocaleDateString()}
          </span>
        </div>

      </div>

      <div className="mt-4 text-main-text">
        <Link href={`/post/${post.id}`} className="">
          <span className="text-xl md:text-2xl font-semibold  hover:underline cursor-pointer w-fit">
            {shortenString(post.title,200)}
          </span>
        </Link>

        <p className="mt-2 text-sm md:text-base">
          {shortenString(post.description,1500)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-gray-400">
        <span>Comments: {post.commentCount}</span>

        <div className="flex items-center space-x-4">
          {session?.user && (
            <>
              {isFavorite ? (
                <StarIcon
                  onClick={() => { toggleFavorite(post, favoritePosts, setFavoritePosts, isFavorite, session) }}
                  className="h-6 w-6 cursor-pointer text-yellow-500"
                />
              ) : (
                <StarOutlineIcon
                  onClick={() => { toggleFavorite(post, favoritePosts, setFavoritePosts, isFavorite, session) }}
                  className="h-6 w-6 cursor-pointer text-gray-500 hover:text-yellow-500"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

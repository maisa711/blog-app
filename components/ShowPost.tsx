"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Comments from "./Comments";
import {
    getPostData,
    updatePost,
    deletePost,
} from "@utils/utilFuncs";
import { useRouter } from "next/navigation";
import {
    NavigationButtons,
    PostEditor,
    PostContent,
    Timestamp,
    UserControls,
} from "./Helpers";
import { handlePostUpdate } from "@utils/ShowPostUtils";
import LoadingSpinner from "./LoadingSpinner";


const ShowPost = ({ id }: any) => {
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [editedContent, setEditedContent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [nextPostId, setNextPostId] = useState(null);
    const [previousPostId, setPreviousPostId] = useState(null);

    const [post, setPost] = useState({
        creator: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        // Subscribe to post updates
        const unsubscribe = getPostData(id, (postData: any) => {
            handlePostUpdate(
                postData,
                setPost,
                setNextPostId,
                setPreviousPostId,
                setIsLoading
            );
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [id]);

    if (isLoading) return <LoadingSpinner isLoading={isLoading} title={'Loading'} description={'Please wait while we process your request...'}/>;

    return (
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col text-start h-full w-full gap-6">
            <NavigationButtons
                previousPostId={previousPostId}
                nextPostId={nextPostId}
                router={router}
            />
            {/*@ts-ignore*/}
            {session?.user?.id === post.creator.id && isEditing ? ( 
                <PostEditor
                    editedContent={editedContent}
                    setEditedContent={setEditedContent}
                />
            ) : (
                <PostContent post={post} />
            )}
            
            <UserControls
                // @ts-ignore
                creatorId={post.creator.id} 
                isEditing={isEditing}
                session={session}
                updateFunction={() => {
                    updatePost(id, editedContent as any, setIsEditing);
                }}
                deleteFunction={() => {
                    deletePost(id, router);
                }}
                cancelFunction={() => {
                    setIsEditing(false);
                }}
                EditFunction={() => {
                    setIsEditing(true);
                    setEditedContent(post as any);
                }}
            />  
            {/*@ts-ignore*/}
            <Timestamp timestamp={post.timestamp } />
            <Comments postId={id} session={session} />
        </div>
    );
};

export default ShowPost;

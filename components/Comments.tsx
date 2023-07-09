"use client";

import { useEffect, useState } from "react";
import { CommentList, TextAreaField,Button, DisplayUserProfile } from "./Helpers";
import { collection, query, onSnapshot, doc,orderBy, where } from "firebase/firestore";
import { db } from "@utils/firebase";
import { addComment, deleteComment, updateComment } from "@utils/CommentsUtils";
import { PlusIcon,EllipsisHorizontalIcon  } from "@heroicons/react/24/solid";


const Comments = ({ postId, session }: any) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        
        const q = query(collection(db, 'comments'), orderBy('timestamp'), where('postId', '==', postId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let commentsArr: any[] = [];

            querySnapshot.forEach((doc) => {
                commentsArr.push({ ...doc.data(), id: doc.id });
            });
            setComments(commentsArr as any);
            console.log('change comments');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="">
                {session?.user && (<>
                    <form
                        onSubmit={(e: any) => addComment(e, postId, comment, session, setComment,setSubmitting)}
                        className="flex flex-col gap-4"
                    >
                        <DisplayUserProfile
                            linkHref={`/profile/${session?.user?.id}`}
                            linkClassname="flex flex-row w-fit justify-start items-center gap-5"
                            imageSrc={session?.user?.image}
                            ImageClassname={"h-10 w-10 rounded-full cursor-pointer"}
                            text= {session?.user?.name}
                            textClassname={"font-bold text-main-text"}

                        />

                        <div className="flex flex-row place-items-end gap-5">
                            <TextAreaField
                                value={comment}
                                onChange={(e:any) => setComment(e.target.value)}
                                required
                                placeholder="Write your comment here..."
                                id="comment"
                                className="rounded-lg py-2 bg-card-bg backdrop-blur-md w-full h-10 px-4 text-main-text shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                classNameCont='w-full'
                                label="Your Comment"
                            />

                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-black rounded-full flex-row py-1 px-1 gap-2 grow mb-1"
                                disabled={submitting}
                            >
                                {submitting ? <EllipsisHorizontalIcon className="h-7 w-7"/> : <PlusIcon className="h-7 w-7"/>}
                            </Button>
                        </div>
                    </form>
                </>)}


                <CommentList session={session} data={comments} editingCommentId={editingCommentId} setEditingCommentId={setEditingCommentId} deleteComment={(comment: any) => deleteComment(postId,comment.id)} updateComment={(commentContent: any, commentId:any, setEditingCommentId: any) => updateComment(postId, commentContent, commentId, setEditingCommentId)}/>

            </div>
        </>
    );
};

export default Comments;

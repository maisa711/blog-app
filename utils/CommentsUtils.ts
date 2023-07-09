import {
    collection,
    updateDoc,
    addDoc,
    Timestamp,
    doc,
    increment,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@utils/firebase";

export const deleteComment = async (postId: any, commentId: any) => {
    const hasConfirmed = confirm("Are you sure you want to delete this comment?");

    if (hasConfirmed) {
        const postRef = doc(db, "posts", postId);
        const commentRef = doc(db, "comments", commentId);

        await updateDoc(postRef, {
            commentCount: increment(-1),
        });

        await deleteDoc(commentRef);
    }
};

export const updateComment = async (
    postId: any,
    commentContent: any,
    commentId: any,
    setEditingCommentId: any
) => {
    const commentRef = doc(db, "comments", commentId);

    await updateDoc(commentRef, {
        content: commentContent,
    }).then(() => {
        setEditingCommentId(null);
    });
};

export const addComment = async (
    e: any,
    postId: any,
    comment: any,
    session: any,
    setComment: any,
    setSubmitting: any,
) => {
    e.preventDefault();

    setSubmitting(true)
    // reference to the post document
    const postRef = doc(db, "posts", postId);

    // reference to the subcollection
    const commentsRef = collection(db, "comments");

    await addDoc(commentsRef, {
        content: comment,
        creator: {
            id: session?.user?.id,
            name: session?.user?.name,
            image: session?.user?.image,
        },
        postId: postId,
        timestamp: Timestamp.fromDate(new Date()),
    }).then(async () => {
        await updateDoc(postRef, {
            commentCount: increment(1),
        });
        setComment("");
        setSubmitting(false)
    });
};

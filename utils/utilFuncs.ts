import { DocumentData, Unsubscribe, WriteBatch } from "@firebase/firestore";
import { Auth } from "@firebase/auth";
import { Session } from "next-auth";
import { 
    collection, 
    updateDoc, 
    addDoc, 
    Timestamp, 
    doc, 
    setDoc, 
    deleteDoc, 
    query, 
    getDocs, 
    where, 
    writeBatch, 
    onSnapshot 
} from "firebase/firestore";
import { db } from "@utils/firebase";
import { signOut as signOutFirebase } from "firebase/auth";
import { signOut as signOutNextAuth } from "next-auth/react";

interface Post {
    title: string;
    description: string;
}

interface User {
    uid: string;
}

export const updatePostsAndComments = async (user: User, content: DocumentData) => {
    const batch: WriteBatch = writeBatch(db);

    const postsQuery = query(
        collection(db, "posts"),
        where("creator.id", "==", user?.uid)
    );
    const postsSnapshot = await getDocs(postsQuery);

    postsSnapshot.forEach((post) => {
        const postRef = doc(db, "posts", post.id);
        batch.update(postRef, content);
    });

    const commentsQuery = query(
        collection(db, "comments"),
        where("creator.id", "==", user?.uid)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    commentsSnapshot.forEach((comment) => {
        const commentRef = doc(db, "comments", comment.id);
        batch.update(commentRef, content);
    });

    await batch.commit();
};

export const handleSignOut = async (auth: Auth) => {
    try {
        // Sign out of Firebase
        await signOutFirebase(auth);

        // Sign out of NextAuth
        await signOutNextAuth({ callbackUrl: "/" }); // Redirect to home page after sign out
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};

// add product to firestore
export const addPost = async (post: Post, session: Session, closeModal: () => void) => {
    await addDoc(collection(db, "posts"), {
        title: post.title,
        description: post.description,
        creator: {
            // @ts-ignore
            id: session?.user?.id,
            name: session?.user?.name,
            image: session?.user?.image,
        },
        commentCount: 0,
        timestamp: Timestamp.fromDate(new Date()),
    }).then(() => {
        closeModal();
    });
};

export const deletePost = async (postId: string, router: any) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");

    if (hasConfirmed) {
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef).then(() => {
            router.push("/");
        });
    }
};

export const updatePost = async (
    postId: string,
    editedPost: Post,
    setIsEditing: (isEditing: boolean) => void
) => {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
        title: editedPost.title,
        description: editedPost.description,
    }).then(() => {
        setIsEditing(false);
    });
};

export const createPost = async (
    e: React.FormEvent,
    post: Post,
    setSubmitting: (isSubmitting: boolean) => void,
    session: Session,
    closeModal: () => void
) => {
    e.preventDefault();

    if (post.title === "" || post.description === "") {
        alert("Please enter a title or description");
        return;
    }

    try {
        setSubmitting(true);
        await addPost(post, session, closeModal);
    } catch (error) {
        console.error(error);
    } finally {
        setSubmitting(false);
    }
};

export const getPostData = (postId: string, onPostUpdate: (data: DocumentData | undefined) => void): Unsubscribe => {
    const postRef = doc(db, "posts", postId);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(postRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const postData = docSnapshot.data();
            // Call the callback function with the updated data
            onPostUpdate(postData);
        } else {
            console.log('Document not found');
        }
    });

    // Return the unsubscribe function so that the listener can be detached when not needed
    return unsubscribe;
};


export const toggleFavorite = async (post: DocumentData, favoritePosts: string[], setFavoritePosts: (posts: string[]) => void, isFavorite: boolean, session: Session) => {
    const newFavorites = isFavorite
        ? favoritePosts.filter((pId) => pId !== post.id)
        : [...favoritePosts, post.id];

    setFavoritePosts(newFavorites);
    // @ts-ignore
    const docRef = doc(db, 'favorites', session?.user?.id as any);
    await setDoc(docRef, { postIds: newFavorites });
};

export const shortenString = (str: string, maxLen = 50) => {
    if (str.length > maxLen) {
        return str.substring(0, maxLen) + "...";
    } else {
        return str;
    }
};

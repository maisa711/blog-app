import {
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    where,
} from "firebase/firestore";
import { db } from "@utils/firebase";

// Function to get the next post based on timestamp
export const getNextPostId = async (currentPostTimestamp: any) => {
    // Reference to the posts collection
    const postRef = collection(db, "posts");

    // Query for the next post (based on timestamp)
    const q = query(
        postRef,
        where("timestamp", ">", currentPostTimestamp), // Get posts after current post
        orderBy("timestamp"), // Order by timestamp
        limit(1) // Limit to 1 document
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If there are results, return the ID of the first (and only) post
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
    }
    return null;
};

// Function to get the previous post based on timestamp
export const getPreviousPostId = async (currentPostTimestamp: any) => {
    // Reference to the posts collection
    const postRef = collection(db, "posts");

    // Query for the previous post (based on timestamp)
    const q = query(
        postRef,
        where("timestamp", "<", currentPostTimestamp), // Get posts before current post
        orderBy("timestamp", "desc"), // Order by timestamp descending
        limit(1) // Limit to 1 document
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If there are results, return the ID of the first (and only) post
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
    }
    return null;
};

// Function to handle updating the post
export const handlePostUpdate = async (postData:any, setPost:any, setNextPostId:any, setPreviousPostId:any, setIsLoading:any) => {
    // Set the current post
    setPost(postData);

    if (postData) {
        // If the postData is not null, get the next and previous posts
        const nextId = await getNextPostId(postData.timestamp) || null;
        const previousId = await getPreviousPostId(postData.timestamp) || null;

        // Set the next and previous post IDs
        setNextPostId(nextId);
        setPreviousPostId(previousId);
    }

    // Set the loading state to false
    setIsLoading(false);
};

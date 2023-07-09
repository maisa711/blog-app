
import { auth } from "@utils/firebase";
import {
    updateProfile as authUpdateProfile,
    updateEmail,
    signInWithCustomToken,
} from "firebase/auth";
import {
    getStorage,
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { handleSignOut, updatePostsAndComments } from "./utilFuncs";

// This function is for handling changes in the user's image
export const handleImageChange = (e: any, selectedImage:any,setSelectedImage:any, editedContent:any, setEditedContent:any,) => {
    if (e.target.files && e.target.files[0]) {
        if (selectedImage) {
            // revokeObjectURL releases an existing object URL which was created by URL.createObjectURL() method
            URL.revokeObjectURL(selectedImage);
        }
        // If there is a file, assign it to img
        let img = e.target.files[0];

        // Update the editedContent object with the new image and update the state
        setEditedContent({ ...editedContent, image: img });
        // Create a local URL for the new image and update the state
        setSelectedImage(URL.createObjectURL(img));
    }
};

// This function is for cancelling any changes made by the user
export const handleCancel = ( selectedImage:any, setSelectedImage:any, setIsEditing:any) => {
    if (selectedImage) {
        // Revoke the object URL and set the selected image to null
        URL.revokeObjectURL(selectedImage);
        setSelectedImage(null);
    }
    // Set isEditing to false indicating the user is no longer editing
    setIsEditing(false);
}

// This function is for updating the user's profile image
export const updateUserProfileImage = async (user:any, currentImage:any, getImage:any, selectedImage:any, setSelectedImage:any,setLoaderContent:any,setIsLoading:any) => {
    // Create a storage reference in Firebase
    const storage = getStorage();
    const imgRef = ref(storage, currentImage);

    // Create a new storage reference for the new image
    const storageRef = ref(storage, `profileImages/${Date.now()}_${getImage.name}`);
    // Start the upload
    const uploadTask = uploadBytesResumable(storageRef, getImage);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate the progress of the upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // Update the loader content with the current progress
                setLoaderContent('Image Upload Is ' + progress + '% Done')
            },
            (error) => {
                // If there's an error during the upload process, update the loader content and stop the loading
                setLoaderContent('Upload failed:', error)
                setIsLoading(false)
                reject(error);
            },
            async () => {
                // Get the download URL of the uploaded image
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                // Update the user's photo URL with the new URL
                await authUpdateProfile(user, { photoURL: downloadURL });

                // Revoke the local URL for the new image and set the selected image to the new URL
                if (selectedImage) {
                    URL.revokeObjectURL(selectedImage);
                }
                setSelectedImage(downloadURL);

                // Delete the old image from storage
                await deleteObject(imgRef);

                resolve(downloadURL);
            }
        );
    });
};

// This function is for updating the user's profile
export const updateProfile = async (sessionUser:any, editedProfile:any, setIsEditing:any, selectedImage:any, setSelectedImage:any,setLoaderContent:any,setIsLoading:any) => {
    // If the user's email has not changed and there is no new image, just cancel editing
    if (sessionUser.email === editedProfile.email && !selectedImage) {
        setIsEditing(false);
    } else {
        // Otherwise, sign in with the custom token
        await signInWithCustomToken(auth, sessionUser.customToken);
        const user = auth.currentUser || null;
        let content = {};

        try {
            setIsLoading(true)
            // If the user has a new image and has changed their email
            if (selectedImage && sessionUser.email !== editedProfile.email) {
                // Update the user's profile image
                const newImageUrl = await updateUserProfileImage(user, sessionUser?.image, editedProfile.image, selectedImage, setSelectedImage,setLoaderContent,setIsLoading);
                // Update the user's email
                await updateEmail(user as any, editedProfile.email);
                content = {
                    "creator.image": newImageUrl,
                };
                setLoaderContent('Email and Image updated')
                // Update the posts and comments made by the user with the new profile image
                await updatePostsAndComments(user as any, content);
            } else if (selectedImage) {
                // If the user has a new imageHere's the provided TypeScript files annotated with comments:
                const newImageUrl = await updateUserProfileImage(user, sessionUser?.image, editedProfile.image, selectedImage, setSelectedImage,setLoaderContent,setIsLoading);
                content = { "creator.image": newImageUrl };

                setLoaderContent('Image updated')
                await updatePostsAndComments(user as any, content);
            } else {
                await updateEmail(user as any, editedProfile.email);
                setLoaderContent('Email updated')
            }
            setIsEditing(false);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        } finally {
            handleSignOut(auth);
        }
    }
};
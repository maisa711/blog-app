import PostCard from "./PostCard";
import CommentCard from "./CommentCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import {
    handleCancel,
    handleImageChange,
    updateProfile,
} from "@utils/ProfileUtils";

export const PostCardList = ({
    data,
    session,
    favoritePosts,
    setFavoritePosts,
}: any) => {
    return (
        <div>
            <div className="flex flex-col justify-items-center gap-x-6 gap-y-10 mt-10">
                {data.map((post: any) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        session={session}
                        favoritePosts={favoritePosts}
                        setFavoritePosts={setFavoritePosts}
                    />
                ))}
            </div>
        </div>
    );
};

export const CommentList = ({
    session,
    data,
    deleteComment,
    editingCommentId,
    setEditingCommentId,
    updateComment,
}: any) => {
    return (
        <div>
            <div className="flex flex-col justify-items-center gap-x-6 gap-y-10 mt-10">
                {data.map((comment: any) => (
                    <CommentCard
                        key={comment.id}
                        deleteComment={() => deleteComment && deleteComment(comment)}
                        updateComment={updateComment}
                        comment={comment}
                        editingCommentId={editingCommentId}
                        setEditingCommentId={setEditingCommentId}
                        session={session}
                    />
                ))}
            </div>
        </div>
    );
};

export const ErrorMessage = ({ message, messages }: any) => {
    return (
        <>
            {message && (
                <p className="text-center bg-red-300 p-4 mb-5 rounded">{message}</p>
            )}

            {messages && (
                <>
                    {messages.map((error: any) => (
                        <p key={error} className="text-start bg-red-300 p-4 mb-5 rounded">
                            {error}
                        </p>
                    ))}
                </>
            )}
        </>
    );
};

export const InputField = ({
    id,
    name,
    type,
    required,
    value,
    onChange,
    label,
    className,
    placeholder,
    classNameCont,
}: any) => {
    return (
        <div className={classNameCont}>
            <label className="block text-sm font-medium text-main-text" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${className}`}
            />
        </div>
    );
};

export const TextAreaField = ({
    id,
    name,
    required,
    value,
    onChange,
    label,
    className,
    classNameCont,
    placeholder,
}: any) => {
    return (
        <div className={classNameCont}>
            <label className="block text-sm font-medium text-main-text" htmlFor={id}>
                {label}
            </label>
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className={`${className}`}
            />
        </div>
    );
};

export const Button = ({
    type,
    className,
    children,
    disabled,
    onClick,
}: any) => {
    return (
        <button
            type={type}
            className={`${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const DisplayUserProfile = ({
    linkHref,
    linkClassname,
    imageSrc,
    ImageClassname,
    text,
    textClassname,
}: any) => {
    return (
        <Link href={`${linkHref}`} className={linkClassname}>
            <Image
                src={imageSrc}
                width={60}
                height={60}
                alt="Profile Picture"
                className={ImageClassname}
            />
            <h3 className={textClassname}>{text}</h3>
        </Link>
    );
};

export const DisplayUserProfileMain = ({ session, user, isEditing, setIsEditing, selectedImage, setSelectedImage, editedContent, setEditedContent, setLoaderContent,setIsLoading }: any) => {
    return (
        <section className="w-full max-w-full flex flex-col items-start">
            <div className="p-5 flex flex-col md:flex-row justify-start items-center gap-5 w-full">
                {session?.user?.id === user.id && isEditing ? (
                    <>
                        <label
                            htmlFor="productImage"
                            className="h-20 w-20 rounded-full flex items-center justify-center cursor-pointer relative"
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src={selectedImage || editedContent?.image}
                                    fill={true}
                                    className="rounded-full"
                                    style={{ backgroundSize: "cover" }}
                                    alt=""
                                />
                            </div>
                            <div className=" text-main-text text-sm p-2 rounded flex flex-col items-center z-10">
                                <ArrowUpCircleIcon className="h-10 w-10 mb-1 font-bold" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => { handleImageChange(e, selectedImage, setSelectedImage, editedContent, setEditedContent) }}
                                required
                                id="productImage"
                                className="hidden"
                            />
                        </label>
                    </>
                ) : (
                    <Image
                        src={user.image}
                        width={70}
                        height={70}
                        alt="Profile Picture"
                        className="h-20 w-20 rounded-full cursor-pointer"
                    />
                )}
                <h3 className="font-bold text-2xl text-main-text mt-4 md:mt-0">
                    {user.name}
                </h3>

                {session?.user?.id === user.id && isEditing ? (
                    <InputField
                        value={editedContent.email}
                        onChange={(e: any) =>
                            setEditedContent({
                                ...editedContent,
                                email: e.target.value,
                            })
                        }
                        placeholder={'Your Email Goes Here...'}
                        classNameCont='w-full md:w-1/2 text-main-text mt-4 md:mt-0'
                        className="rounded-lg py-2 bg-card-bg backdrop-blur-md w-full h-10 px-4 shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                ) : (
                    <h3 className="font-bold text-2xl text-main-text mt-4 md:mt-0">
                        {user.email}
                    </h3>
                )}
                <div className="mt-4 md:mt-0">
                    <UserControls
                        creatorId={user.id}
                        isEditing={isEditing}
                        session={session}
                        updateFunction={() => {
                            updateProfile(
                                user,
                                editedContent,
                                setIsEditing,
                                selectedImage,
                                setSelectedImage,
                                setLoaderContent,
                                setIsLoading
                            );
                        }}
                        noDelete={true}
                        cancelFunction={() => {
                            handleCancel(selectedImage, setSelectedImage, setIsEditing);
                        }}
                        EditFunction={() => {
                            setEditedContent({
                                email: user.email,
                                image: user.image,
                            });
                            setIsEditing(true);
                        }}
                    />
                </div>
            </div>
        </section>
    )
}


//ShowPost page

export const NavigationButtons = ({
    previousPostId,
    nextPostId,
    router,
}: any) => {
    return (
        <div className="flex justify-between">
            {previousPostId && (
                <Button
                    onClick={() => router.push(`/post/${previousPostId}`)}
                    className="flex items-center space-x-2"
                    type="button"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-main-text" />
                    <span className="text-main-text">Previous</span>
                </Button>
            )}
            {nextPostId && (
                <Button
                    onClick={() => router.push(`/post/${nextPostId}`)}
                    className="flex items-center space-x-2"
                    type="button"
                >
                    <span className="text-main-text">Next</span>
                    <ChevronRightIcon className="h-5 w-5 text-main-text" />
                </Button>
            )}
        </div>
    );
};

export const PostContent = ({ post }: any) => (
    <div className="px-4 py-8 space-y-6 bg-card-bg rounded-lg shadow-xl">
        <h1 className="text-main-text text-3xl font-bold mb-3">Title</h1>
        <p className="text-main-text text-lg">{post.title}</p>
        
        <h1 className="text-main-text text-3xl font-bold mb-3">Description</h1>
        <p className="text-main-text text-lg">{post.description}</p>
    </div>
);

export const PostEditor = ({ editedContent, setEditedContent }: any) => {
    return (
        <div className="px-4 py-8 space-y-6 bg-card-bg rounded-lg shadow-xl">
            <h1 className="text-main-text text-3xl font-bold mb-3">Title</h1>
            <TextAreaField
                value={editedContent.title}
                onChange={(e:any) =>
                    setEditedContent({ ...editedContent, title: e.target.value })
                }
                placeholder="Write your title here..."
                className="rounded-lg py-2 bg-gray-300 w-full px-4 h-auto text-black shadow-sm outline-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            />

            <h1 className="text-main-text text-3xl font-bold mb-3">Description</h1>
            <TextAreaField
                value={editedContent.description}
                onChange={(e:any) =>
                    setEditedContent({
                        ...editedContent,
                        description: e.target.value,
                    })
                }
                placeholder="Write your description here..."
                className="rounded-lg py-2 bg-gray-300 w-full px-4 h-auto text-black  shadow-sm outline-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            />
        </div>
    );
};

export const Timestamp = ({ timestamp }: any) => (
    <div className="px-4 py-8 bg-card-bg rounded-lg shadow-xl">
        <h1 className="text-main-text text-3xl font-bold mb-2">Timestamp</h1>
        <p className="text-main-text text-lg">
            {new Date(timestamp.toDate()).toLocaleString()}
        </p>
    </div>
);

export const UserControls = ({
    creatorId,
    isEditing,
    session,
    updateFunction,
    deleteFunction,
    cancelFunction,
    EditFunction,
    noDelete,
}: any) => {
    return (
        <div className="flex justify-end gap-3 mt-2">
            {session?.user?.id === creatorId && isEditing ? (
                <>
                    <Button
                        onClick={updateFunction}
                        className="text-main-text text-sm py-1 px-2 bg-green-500 rounded"
                        type="button"
                    >
                        Update
                    </Button>
                    <Button
                        onClick={cancelFunction}
                        className="text-main-text text-sm py-1 px-2 bg-red-500 rounded"
                        type="button"
                    >
                        Cancel
                    </Button>
                </>
            ) : session?.user?.id === creatorId ? (
                <>
                    <Button
                        onClick={EditFunction}
                        className="text-main-text text-sm py-1 px-2 bg-yellow-500 rounded"
                        type="button"
                    >
                        Edit
                    </Button>
                    {!noDelete && (
                        <Button
                            onClick={deleteFunction}
                            className="text-main-text text-sm py-1 px-2 bg-red-500 rounded"
                            type="button"
                        >
                            Delete
                        </Button>
                    )}
                </>
            ) : null}
        </div>
    );
};

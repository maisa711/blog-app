"use client";

import { useState } from "react";
import { DisplayUserProfile, TextAreaField, UserControls } from "./Helpers";

const CommentCard = ({
    session,
    comment,
    deleteComment,
    editingCommentId,
    setEditingCommentId,
    updateComment,
}: any) => {
    const [editedContent, setEditedContent] = useState(comment.content);
    const isEditing = editingCommentId === comment.id;

    return (
        <div
            key={comment.id}
            className="flex flex-col bg-card-bg p-5 rounded-md gap-4"
        >
            <div className="flex items-center gap-2 justify-between">
                <DisplayUserProfile
                    linkHref={`/profile/${comment?.creator?.id}`}
                    linkClassname="flex flex-row w-fit justify-start items-center gap-5"
                    imageSrc={comment.creator.image}
                    ImageClassname={"h-10 w-10 rounded-full cursor-pointer"}
                    text={comment.creator.name}
                    textClassname={"font-bold text-main-text"}

                />
                <span className="text-main-text text-sm">
                    Timestamp: {new Date(comment.timestamp.toDate()).toLocaleString()}
                </span>
            </div>
            <div className="w-full">
                <div className="flex flex-col gap-2">
                    {session?.user?.id === comment.creator.id && isEditing ? (
                        <TextAreaField
                            value={editedContent}
                            onChange={(e:any) => setEditedContent(e.target.value)}
                            required
                            placeholder="Edit your comment here..."
                            id="commentEdit"
                            className="rounded-lg py-2 bg-gray-700 backdrop-blur-md w-full h-10 px-4 text-main-text shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            classNameCont="w-full"
                        />
                    ) : (
                        <p className="text-main-text">{comment.content}</p>
                    )}

                    <UserControls
                        creatorId={comment.creator.id}
                        isEditing={isEditing}
                        session={session}
                        updateFunction={() => {
                            updateComment(editedContent, comment.id, setEditingCommentId);
                        }}
                        deleteFunction={deleteComment}
                        cancelFunction={() => setEditingCommentId(null)}
                        EditFunction={() => setEditingCommentId(comment.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentCard;

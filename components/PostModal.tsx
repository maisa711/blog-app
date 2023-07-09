"use client";

import { useSession } from "next-auth/react";
import PostForm from "./PostForm";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createPost } from "@utils/utilFuncs";
import { Button } from "./Helpers";


export default function PostModal() {
    let [isOpen, setIsOpen] = useState(false);

    const { data: session } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        title: "",
        description: "",
    });


    function closeModal() {
        setIsOpen(false);
        setPost({
            title: "",
            description: "",
        })
    }

    function openModal() {
        setIsOpen(true);
    }


    return (
        <div className="flex justify-end">

            <div>
                <Button
                    className=" hidden md:flex bg-primary hover:bg-primary-hover  text-black py-2 px-4 rounded-full flex-row gap-2"
                    onClick={openModal}
                    type="button"
                >
                    <p>Add Post</p>

                    <PlusIcon className="h-6 w-6" />
                </Button>

                <Button
                    className="flex md:hidden bg-primary hover:bg-primary-hover  text-black py-2 px-2 rounded-full flex-row"
                    onClick={openModal}
                    type="button"
                >
                    <PlusIcon className="h-6 w-6" />
                </Button>
            </div>


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="z-10 w-[1000px] transform overflow-hidden rounded-2xl p-1 text-left align-middle shadow-xl transition-all bg-main-bg border border-secondary">
                                    <PostForm
                                        type="Create"
                                        post={post}
                                        setPost={setPost}
                                        submitting={submitting}
                                        handleSubmit={(e: any) =>
                                            
                                            createPost(
                                                e,
                                                post,
                                                setSubmitting,
                                                // @ts-ignore
                                                session,
                                                closeModal
                                            )
                                        }
                                        handleCancel={closeModal}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

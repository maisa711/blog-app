import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowPathIcon  } from '@heroicons/react/24/outline';

const LoadingSpinner = ({ isLoading, title, description }:any) => {
    return (
        <Transition show={isLoading} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                open={isLoading}
                static
                onClose={() => {}}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-card-bg rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary sm:mx-0 sm:h-10 sm:w-10">
                                <ArrowPathIcon className="h-6 w-6 text-background animate-spin" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-main-text">
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-accent">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default LoadingSpinner;

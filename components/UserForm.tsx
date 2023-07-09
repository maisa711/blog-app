'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputField, ErrorMessage, Button } from "./Helpers";
import { handleUserSubmit, handleInputChange, handleImageChange, togglePasswordVisibility } from "@utils/UserFormUtils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

const UserForm = ({ UserAuth }:any) => {
    const router = useRouter();
    const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
    const [loaderContent, setLoaderContent] = useState('');

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const callbackUrl = "/";
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        image: ''
    });

    return (
        <div className="flex items-center justify-center h-[86vh]">
            {isSpinnerLoading && (<LoadingSpinner isLoading={isSpinnerLoading} title={'Loading'} description={loaderContent}/>)}
            <div className="w-full max-w-md mx-auto bg-card-bg p-7 rounded-md shadow-xl">
                <div className="text-center">
                    <h1 className="my-3 text-3xl font-semibold text-main-text dark:text-main-text">{UserAuth ? 'Login' : 'Register'}</h1>
                    <p className="text-gray-400 dark:text-gray-400">{UserAuth ? 'Welcome Back!' : 'Register Today!'}</p>
                </div>
                <form className="mt-7 space-y-6" onSubmit={(e) => { handleUserSubmit(e, formValues, setLoading, router, callbackUrl, setError, setFormValues, selectedImage, UserAuth, setPasswordErrors,setIsSpinnerLoading,setLoaderContent ) }}>
                    <ErrorMessage message={error} />

                    {!UserAuth && (
                        <InputField
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formValues.name}
                            onChange={(e: any) => handleInputChange(e, formValues, setFormValues)}
                            label="Name"
                            className={'w-full p-3 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary'}
                        />
                    )}
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formValues.email}
                        onChange={(e: any) => handleInputChange(e, formValues, setFormValues)}
                        label="Email address"
                        className={'w-full p-3 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary'}
                    />
                    <div className="relative flex flex-row">
                        <InputField
                            id="password"
                            name="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            required
                            value={formValues.password}
                            onChange={(e: any) => handleInputChange(e, formValues, setFormValues)}
                            label="Password"
                            classNameCont={'w-full'}
                            className={'w-full p-3 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary'}
                        />
                        <div
                            className="absolute right-3 top-[65%] transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={() => { togglePasswordVisibility(isPasswordVisible, setIsPasswordVisible) }}
                        >
                            {isPasswordVisible ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </div>
                    </div>
                    <ErrorMessage messages={passwordErrors} />

                    {!UserAuth && (
                        <div className="mt-6">
                            <label className='w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-hover hover:bg-accent cursor-pointer ' htmlFor="productImage">Upload Image</label>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e: any) => handleImageChange(e, formValues, setFormValues, selectedImage, setSelectedImage)}
                                required
                                id="productImage"
                                className="hidden"
                            />
                            {formValues.image && (
                                <div className="mt-4">
                                    <Image src={selectedImage ? selectedImage || '' : formValues.image} alt="verify" width={60} height={60} className="mx-auto rounded-full" />
                                </div>
                            )}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 block bg-secondary hover:bg-secondary-hover focus:bg-indigo-600 text-white font-semibold rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "loading..." : (UserAuth ? 'Login' : 'Register')}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default UserForm;

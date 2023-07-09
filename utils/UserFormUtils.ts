import { signIn } from "next-auth/react";
import { ChangeEvent } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Validate the password based on certain rules
const validatePassword = (password:any) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password should be at least 8 characters.');
    }

    if (password.search(/[a-z]/) < 0) {
        errors.push('Password should contain at least one lowercase letter.');
    }

    if (password.search(/[A-Z]/) < 0) {
        errors.push('Password should contain at least one uppercase letter.');
    }

    if (password.search(/[0-9]/) < 0) {
        errors.push('Password should contain at least one digit.');
    }

    if (password.search(/[!@#$%^&*]/) < 0) {
        errors.push('Password should contain at least one special character (!@#$%^&*).');
    }

    // Return an object with the validation results
    return {
        isValid: errors.length === 0, // If there are no errors, it's valid
        errors, // The errors themselves
    };
}

// Toggle the visibility of the password
export const togglePasswordVisibility = (isPasswordVisible:any, setIsPasswordVisible:any) => {
    setIsPasswordVisible(!isPasswordVisible);
};

// Handle the user login
export const handleUserLogin = async (formValues:any, setLoading:any, router:any, callbackUrl:any, setError:any) => {
    // logic for handling login
    const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
    });

    setLoading(false);
    console.log("result", res);
    if (!res?.error) {
        router.push(callbackUrl);
        setError('');
    } else {
        setError("invalid email or password");
    }
};

// Handle user registration
export const handleUserRegister = async (formValues:any, setLoading:any, setError:any, setPasswordErrors:any, setIsSpinnerLoading:any,setLoaderContent:any) => {

    const passwordValidation = validatePassword(formValues.password);

    if(!passwordValidation.isValid){
        setPasswordErrors(passwordValidation.errors)
        setLoading(false);
        return;
    }

    setPasswordErrors([])

    setIsSpinnerLoading(true)
    // logic for handling registration
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${Date.now()}_${formValues.image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, formValues.image);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setLoaderContent('Image Upload Is ' + progress + '% Done')
        },
        (error) => {
            setLoaderContent('Upload failed:', error)
            setIsSpinnerLoading(false)
        },
        async () => {
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const res = await fetch("/api/users/register", {
                method: "POST",
                body: JSON.stringify({ ...formValues, image: downloadURL }),
            });

            setLoading(false);
            setLoaderContent('Success')
            setIsSpinnerLoading(false)
            if (!res.ok) {
                setError((await res.json()).message);
                return;
            }
            signIn(undefined, { callbackUrl: "/" });
        }
    );
};


export const handleUserSubmit = async (event: React.FormEvent<HTMLFormElement>,formValues:any, setLoading:any, router:any, callbackUrl:any, setError:any, setFormValues:any, selectedImage:any, UserAuth:any, setPasswordErrors:any, setIsSpinnerLoading:any,setLoaderContent:any) => {
    event.preventDefault()
    setLoading(true)
    setFormValues({ name: "", email: "", password: "", image: '' });
    if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
    }

    if (UserAuth) {
        handleUserLogin(formValues, setLoading, router, callbackUrl, setError);
    } else {
        handleUserRegister(formValues, setLoading, setError, setPasswordErrors, setIsSpinnerLoading,setLoaderContent);
    }


}

// Handle changes in the form input fields
export const handleInputChange = (event: ChangeEvent<HTMLInputElement>, formValues:any,setFormValues:any ) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
};

export const handleImageChange = (e: any, formValues:any, setFormValues:any, selectedImage:any, setSelectedImage:any) => {
    if (e.target.files && e.target.files[0]) {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
        }

        let img = e.target.files[0];

        setFormValues({ ...formValues, image: img });
        setSelectedImage(URL.createObjectURL(img));

    }
};
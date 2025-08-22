import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});

export const registrationValidationSchema = Yup.object({
    organizationName: Yup.string()
        .min(2, 'Organization name must be at least 2 characters')
        .required('Organization name is required'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required('Please confirm your password'),
    phone: Yup.string()
        .required('Phone number is required'),
    address: Yup.string()
        .min(10, 'Address must be at least 10 characters')
        .required('Address is required')
});
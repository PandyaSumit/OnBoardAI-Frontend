import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
    mfaToken: Yup.string()
        .when('requiresMFA', {
            is: true,
            then: (schema) => schema.required('MFA code is required')
        })
});


export const registrationValidationSchema = Yup.object({
    // Organization details
    name: Yup.string()
        .min(2, 'Organization name must be at least 2 characters')
        .max(100, 'Organization name must not exceed 100 characters')
        .required('Organization name is required'),

    // Admin user details
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),

    // Admin profile
    firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .required('First name is required'),
    lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .required('Last name is required'),

    // Optional organization profile
    description: Yup.string().max(500, 'Description must not exceed 500 characters'),
    website: Yup.string().url('Invalid URL format'),
    industry: Yup.string(),
    size: Yup.string()
});
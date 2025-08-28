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


export const organizationRegistrationSchema = Yup.object().shape({
    adminFirstName: Yup.string()
        .required('First name is required')
        .max(50, 'First name must be at most 50 characters'),

    adminLastName: Yup.string()
        .max(50, 'Last name must be at most 50 characters'),

    adminEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    adminPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

    confirmAdminPassword: Yup.string()
        .oneOf([Yup.ref('adminPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),

    // Organization fields
    organizationName: Yup.string()
        .required('Organization name is required')
        .max(100, 'Organization name must be at most 100 characters'),

    organizationEmail: Yup.string()
        .email('Invalid email address')
        .required('Organization email is required'),

    description: Yup.string()
        .max(500, 'Description can’t exceed 500 characters'),

    industry: Yup.string()
        .required('Industry is required'),

    organizationSize: Yup.string()
        .required('Organization size is required'),

    website: Yup.string()
        .url('Enter a valid website URL')
        .nullable()
})

export const userRegistrationSchema = Yup.object({
    firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .required('First name is required'),

    lastName: Yup.string()
        .max(50, 'Last name must not exceed 50 characters'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and number'
        )
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),

    joinCode: Yup.string()
        .max(50, 'Join code must not exceed 50 characters')
        .nullable()
})
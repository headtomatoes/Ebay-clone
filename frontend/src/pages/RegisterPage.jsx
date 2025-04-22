import React from 'react';
import RegisterForm from '../components/auth/RegisterForm.jsx';

function RegisterPage() {
    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <RegisterForm />
            </div>
        </div>
    );
}
export default RegisterPage;

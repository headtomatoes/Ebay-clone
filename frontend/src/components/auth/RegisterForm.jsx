import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed useAuth import - we don't auto-login after register
// Import the REAL registration function
import { registerUser } from '../../services/AuthService'; // Adjust path

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '' // Added for confirmation check
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // State for backend errors
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error for the field being changed
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    // Clear API error when user starts typing again
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) { // Example: Minimum length
      newErrors.password = 'Password must be at least 8 characters and contain letters and numbers, and special characters';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // *** UPDATED handleSubmit ***
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);

    try {
      // Prepare data for backend (matching SignupRequestDTO)
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
        // Add roles if your DTO supports it, otherwise backend assigns default
      };

      // Call the REAL backend service
      const response = await registerUser(userData);

      // Registration successful! Redirect to login page with a success message.
      // The success message can be displayed on the LoginForm component.
      navigate('/signin', {
        state: { message: response.message || 'Registration successful! Please log in.' }
      });

    } catch (err) {
      console.error('Registration failed:', err);
      // Display specific error from backend if available
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      // Add display for apiError
      // Add disabled state to button based on loading
// {/*       <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}> */}
// {/*         {apiError && ( */}
// {/*             <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{apiError}</p> */}
// {/*         )} */}
// {/*         {['username', 'email', 'password'].map((field) => ( */}
// {/*             <div key={field} style={{ marginBottom: '15px' }}> */}
// {/*                */}{/* ... label and input ... */}
// {/*               {errors[field] && ( */}
// {/*                   <p style={{ color: 'red', marginTop: '5px' }}>{errors[field]}</p> */}
// {/*               )} */}
// {/*             </div> */}
// {/*         ))} */}
// {/*         <button */}
// {/*             type="submit" */}
// {/*             disabled={loading} */}
// {/*             style={{ /* ... styles ... */ opacity: loading ? 0.6 : 1 }} */}
// {/*         > */}
// {/*           {loading ? 'Signing Up...' : 'Sign Up'} */}
// {/*         </button> */}
// {/*       </form> */}

       <form onSubmit={handleSubmit} className="border border-gray-300 rounded-xl max-w-md mx-auto mt-10 p-6 shadow bg-white">
{/*              <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2> */}

             {apiError && (
               <p className="text-red-500 text-center mb-4">{apiError}</p>
             )}

             {['username', 'email', 'password', 'confirmPassword'].map((field) => (
               <div key={field} className="mb-4">
                 <label className="block text-sm font-medium mb-1 capitalize" htmlFor={field}>
                   {field === 'confirmPassword' ? 'Confirm Password' : field}
                 </label>
                 <input
                   type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                   name={field}
                   id={field}
                   value={formData[field]}
                   onChange={handleChange}
                   placeholder={`Enter your ${field === 'confirmPassword' ? 'password again' : field}`}
                   className="w-full border rounded px-3 py-2"
                 />
                 {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
               </div>
             ))}

             <button
               type="submit"
               disabled={loading}
               className={`w-full bg-blue-600 text-white py-2 rounded-full ${loading ? 'opacity-60' : ''}`}
             >
               {loading ? 'Signing Up...' : 'Sign Up'}
             </button>
       </form>

  );
}
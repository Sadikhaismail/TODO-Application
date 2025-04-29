import React, { useState } from 'react';
import api from '../Api'; 
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    age: '',
    gender: '',
    profession: '',
    profilePicture: null,
  });

  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const navigate = useNavigate();

  // Password regex rules
  const passwordValidation = {
    lower: /[a-z]/,
    upper: /[A-Z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const passwordStatus = {
    lower: passwordValidation.lower.test(formData.password),
    upper: passwordValidation.upper.test(formData.password),
    number: passwordValidation.number.test(formData.password),
    special: passwordValidation.special.test(formData.password),
  };

  const isValid = {
    fullName: formData.fullName.trim().length > 0,
    email: /\S+@\S+\.\S+/.test(formData.email),
    phoneNumber: /^\d{10}$/.test(formData.phoneNumber),
    address: formData.address.trim().length > 0,
    age: Number(formData.age) > 0,
    gender: formData.gender !== '',
    profession: formData.profession.trim().length > 0,
    password:
      passwordStatus.lower &&
      passwordStatus.upper &&
      passwordStatus.number &&
      passwordStatus.special,
    confirmPassword: formData.password === formData.confirmPassword,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const inputClass = (field) =>
    `w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
      touched[field]
        ? isValid[field]
          ? 'border-green-500 focus:ring-green-500'
          : 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await api.post('/users/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Something went wrong');
    }
  };

  const allPasswordRulesMet = passwordStatus.lower && passwordStatus.upper && passwordStatus.number && passwordStatus.special;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="max-w-2xl w-full p-8 bg-white rounded-md shadow-lg" >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <form onSubmit={handleRegister}>

          {/* Full Name & Email */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('fullName')}
                placeholder="Enter your name"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('email')}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone & Address */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, phoneNumber: value });
                  }
                }}
                onBlur={handleBlur}
                className={inputClass('phoneNumber')}
                placeholder="10 digit phone"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('address')}
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Age & Gender */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('age')}
                placeholder="Age"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('gender')}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Profession */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('profession')}
              placeholder="Your profession"
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.profilePicture && (
              <img
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="flex space-x-4 mb-6">
            <div className="w-1/2 relative">
              <label className="block mb-1 font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  setShowPasswordCriteria(e.target.value.length > 0);
                }}
                onBlur={handleBlur}
                className={inputClass('password')}
                placeholder="Password"
              />

              {/* Password Criteria */}
              {showPasswordCriteria && !allPasswordRulesMet && (                 
                <ul className="text-xs mt-2 space-y-1 bg-gray-50 p-2 rounded-md border">                   
                  {!passwordStatus.lower && <li className="text-red-600">Lowercase letter</li>}                   
                  {!passwordStatus.upper && <li className="text-red-600">Uppercase letter</li>}                   
                  {!passwordStatus.number && <li className="text-red-600">Number</li>}                   
                  {!passwordStatus.special && <li className="text-red-600">Special character</li>}                 
                </ul>     
              )}
            </div>

            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('confirmPassword')}
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all"
          >
            Register
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 text-center text-red-500 font-medium">{error}</div>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/UserService';
import { toast } from 'react-toastify';

export default function EditAccountPage() {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({ email: '', address: '', phoneNumber: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    getProfile(token).then(data => {
      setProfile(data);
      setEditData({
        email: data.email || '',
        address: data.address || '',
        phoneNumber: data.phoneNumber || ''
      });
    });
  }, [token]);

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    try {
      const updated = await updateProfile(token, editData);
      setProfile(updated);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = e => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error('Please enter both your current and new password.');
      return;
    }
    try {
      await changePassword(token, passwordData);
      toast.success('Password changed!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Account</h2>
      <form onSubmit={handleProfileSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input value={profile.username} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input name="email" value={editData.email} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input name="address" value={editData.address} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input name="phoneNumber" value={editData.phoneNumber} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save Changes</button>
      </form>

      <h3 className="text-xl font-semibold mb-3">Change Password</h3>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Old Password</label>
          <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Change Password</button>
      </form>
    </div>
  );
}
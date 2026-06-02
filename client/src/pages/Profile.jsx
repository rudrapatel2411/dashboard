import React, { useState, useEffect } from 'react';
import { User as UserIcon, Building2, Shield, Camera, KeyRound, Trash2, LogOut, CheckCircle, AlertTriangle, Save, Loader2, Sparkles, MapPin, Trophy } from 'lucide-react';

const Profile = () => {
  // Fetch current user and setup state
  const [token] = useState(localStorage.getItem('token'));
  const [localUser, setLocalUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SERVER_BASE = API_URL.replace('/api', '');
  
  // Loading & UI status state
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: success, error

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    // Institute details
    instituteName: '',
    contactPerson: '',
    mobile: '',
    city: '',
    state: '',
    address: '',
    sport: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Avatar upload preview state
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // Determine active roles and colors based on user role and type
  const isUserAdmin = localUser.role === 'admin';
  const isUserAcademy = localUser.role === 'institution' && localUser.instituteType === 'academy';
  const isUserInstitute = localUser.role === 'institution' && localUser.instituteType !== 'academy';

  // Get accent theme classes based on role
  const themeClasses = {
    primaryColor: isUserAdmin ? 'text-slate-800' : isUserAcademy ? 'text-amber-600' : 'text-blue-600',
    bgColor: isUserAdmin ? 'bg-slate-500' : isUserAcademy ? 'bg-amber-500' : 'bg-blue-600',
    borderColor: isUserAdmin ? 'focus:border-slate-500 focus:ring-slate-500/20' : isUserAcademy ? 'focus:border-amber-500 focus:ring-amber-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20',
    btnColor: isUserAdmin ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-500/20' : isUserAcademy ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
    badgeBg: isUserAdmin ? 'bg-slate-100 text-slate-800 border-slate-200' : isUserAcademy ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200',
    accentText: isUserAdmin ? 'text-slate-500' : isUserAcademy ? 'text-amber-500' : 'text-blue-500'
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        const u = data.user;
        const inst = data.institute || {};

        setProfileData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          avatar: u.avatar || '',
          instituteName: inst.name || '',
          contactPerson: inst.contactPerson || '',
          mobile: inst.mobile || '',
          city: inst.city || '',
          state: inst.state || '',
          address: inst.address || '',
          sport: inst.sport || '',
        });

        if (u.avatar) {
          setAvatarPreview(`${SERVER_BASE}${u.avatar}`);
        }
      } else {
        showToast(data.message || 'Failed to fetch profile info', 'error');
      }
    } catch (err) {
      showToast('Network error loading profile details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (!isUserAdmin) {
        formData.append('instituteName', profileData.instituteName);
        formData.append('contactPerson', profileData.contactPerson);
        formData.append('mobile', profileData.mobile);
        formData.append('city', profileData.city);
        formData.append('state', profileData.state);
        formData.append('address', profileData.address);
        if (isUserAcademy) {
          formData.append('sport', profileData.sport);
        }
      }

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Profile settings updated successfully!', 'success');
        
        // Update local storage user details dynamically
        const updatedLocalUser = {
          ...localUser,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
        };

        if (data.institute) {
          updatedLocalUser.instituteName = data.institute.name;
          updatedLocalUser.sport = data.institute.sport;
        }

        localStorage.setItem('user', JSON.stringify(updatedLocalUser));
        setLocalUser(updatedLocalUser);

        // Dispatch Custom Event to notify other components (Header, Sidebars) immediately
        window.dispatchEvent(new Event('user-update'));
        
        // Refresh component state
        if (data.user.avatar) {
          setAvatarPreview(`${SERVER_BASE}${data.user.avatar}`);
          setAvatarFile(null);
        }
      } else {
        showToast(data.message || 'Error updating profile', 'error');
      }
    } catch (err) {
      showToast('Server connection failed.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(data.message || 'Error changing password', 'error');
      }
    } catch (err) {
      showToast('Server connection failed.', 'error');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = isUserAdmin ? '/admin/login' : '/institute/login';
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type "DELETE" exactly to confirm account deletion.', 'error');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/institute/login';
      } else {
        showToast(data.message || 'Failed to delete account', 'error');
        setDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (err) {
      showToast('Server connection failed during deletion.', 'error');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-slate-500 font-semibold text-sm">Fetching account details...</p>
      </div>
    );
  }

  // Get user avatar initials
  const initials = profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U';
  const roleLabel = isUserAdmin ? 'System Admin' : isUserAcademy ? 'Academy Owner' : 'Institution Principal';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-10">
      
      {/* Toast Alert */}
      {message.text && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 animate-slide-in ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
          <span className="text-xs font-bold">{message.text}</span>
        </div>
      )}

      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Sparkles className={`w-7 h-7 ${themeClasses.accentText} animate-pulse-soft`} />
            Account Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure your personal information, organization settings, and credentials.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <LogOut size={16} /> Logout Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            {/* Background glowing circle */}
            <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-xl ${themeClasses.bgColor}`}></div>
            
            {/* Avatar image container */}
            <div className="relative group mt-4">
              <div className={`w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow-lg flex items-center justify-center bg-slate-100 ${themeClasses.primaryColor}`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile Photo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black">{initials}</span>
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group-hover:bg-secondary border border-white"
              >
                <Camera size={14} />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="mt-5">
              <h2 className="font-extrabold text-slate-800 text-base leading-snug">{profileData.name}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border mt-2.5 ${themeClasses.badgeBg}`}>
                {roleLabel}
              </span>
            </div>

            <div className="w-full border-t border-slate-50 my-5 pt-4 text-left space-y-3.5">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registered Email</span>
                <span className="text-xs font-semibold text-slate-700 block truncate">{profileData.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">System Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle size={12} /> Approved & Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Form Card 1: Details */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${themeClasses.primaryColor}`}>
                {isUserAdmin ? <UserIcon size={18} /> : <Building2 size={18} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {isUserAdmin ? 'Personal Details' : isUserAcademy ? 'Academy Details' : 'Institution Details'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Update contact, profile, and organization properties.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              
              {/* Profile Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    {isUserAdmin ? 'Full Name' : 'Contact Person Name'} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={profileData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={profileData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Contact Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Role Specific Fields */}
                {!isUserAdmin && (
                  <>
                    <div>
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                        {isUserAcademy ? 'Academy Name' : 'Institute Name'} <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="instituteName"
                        required
                        value={profileData.instituteName}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Office Mobile</label>
                      <input 
                        type="tel" 
                        name="mobile"
                        value={profileData.mobile}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                        placeholder="Organization phone"
                      />
                    </div>

                    {isUserAcademy && (
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Sport Specialization</label>
                        <div className="relative">
                          <Trophy className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                          <input 
                            type="text" 
                            name="sport"
                            value={profileData.sport}
                            onChange={handleInputChange}
                            className={`w-full rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                            placeholder="e.g. Football, Archery"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isUserAdmin && (
                <div className="border-t border-slate-50 pt-5 space-y-5">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin size={14} className={themeClasses.accentText} /> Location Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">City <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        value={profileData.city}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">State <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="state"
                        required
                        value={profileData.state}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Physical Address</label>
                      <textarea 
                        name="address"
                        rows={2}
                        value={profileData.address}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input resize-none ${themeClasses.borderColor}`} 
                        placeholder="Complete office address details"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={updating}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${themeClasses.btnColor}`}
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Update Profile Settings
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Form Card 2: Password Security */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${themeClasses.primaryColor}`}>
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Security & Password</h3>
                <p className="text-[11px] text-slate-400 font-medium">Keep your account secure by modifying the password credentials.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    required
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    required
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChangeInput}
                    className={`w-full rounded-xl py-2.5 px-3.5 text-xs font-semibold sports-input ${themeClasses.borderColor}`} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={passwordUpdating}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${themeClasses.btnColor}`}
                >
                  {passwordUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound size={14} /> Update Credentials
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Card 3: Danger Zone */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-black text-red-800 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" /> Danger Zone
              </h4>
              <p className="text-[11px] text-red-600/80 font-semibold leading-normal">
                {isUserAdmin 
                  ? 'Deleting your administrator account will permanently remove your login credentials.'
                  : 'Permanently delete this organization account. This clears all linked profiles, students, evaluations, and academic records.'}
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/10 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-5 animate-slide-up">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Permanently Delete Account?</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 font-semibold leading-relaxed space-y-2.5">
              <p>
                Deleting your account will erase all profile information.
              </p>
              {!isUserAdmin && (
                <p className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-100 text-[11px] font-bold">
                  Warning: All registered student rosters, physical testing records, and grade parameters linked to your institution/academy will be completely deleted.
                </p>
              )}
              <p>
                To confirm deletion, please type <span className="font-black text-red-600">DELETE</span> in the box below:
              </p>
            </div>

            <input 
              type="text" 
              placeholder='Type "DELETE" here'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3.5 text-xs font-black tracking-widest border border-red-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 bg-red-50/10 text-center uppercase" 
            />

            <div className="flex gap-3 justify-end pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={deleting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} /> Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;

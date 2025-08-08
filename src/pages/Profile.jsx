import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [profile, setProfile] = useState({
    name: 'আহমেদ হাসান',
    email: 'ahmed.hasan@email.com',
    phone: '+৮৮০১৭১২৩৪৫৬৭৮',
    dateOfBirth: '১৫/০৮/১৯৯৫',
    address: 'ধানমন্ডি, ঢাকা',
    occupation: 'ছাত্র',
    education: 'স্নাতক',
    joinDate: '১৫ জানুয়ারি, ২০২৪',
    bio: 'গণিত শেখার প্রতি আগ্রহী একজন শিক্ষার্থী।'
  });

  const [preferences, setPreferences] = useState({
    language: 'bangla',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would save the profile data to your backend
    setIsEditing(false);
    alert('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
  };

  const tabs = [
    { id: 'personal', name: 'ব্যক্তিগত তথ্য', icon: '👤' },
    { id: 'preferences', name: 'পছন্দসমূহ', icon: '⚙️' },
    { id: 'security', name: 'নিরাপত্তা', icon: '🔒' },
    { id: 'achievements', name: 'অর্জনসমূহ', icon: '🏆' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          backgroundColor: '#3498db',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: 'white'
        }}>
          👤
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>
          {profile.name}
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
          সদস্য হয়েছেন: {profile.joinDate}
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 25px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#3498db' : '#7f8c8d',
              borderBottom: activeTab === tab.id ? '3px solid #3498db' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>ব্যক্তিগত তথ্য</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isEditing ? '#27ae60' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {isEditing ? 'সংরক্ষণ করুন' : 'সম্পাদনা করুন'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  নাম
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  ফোন
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  জন্ম তারিখ
                </label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  পেশা
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                  শিক্ষাগত যোগ্যতা
                </label>
                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                ঠিকানা
              </label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: 'bold' }}>
                সম্পর্কে
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>পছন্দসমূহ</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#34495e', marginBottom: '15px' }}>ভাষা সেটিংস</h3>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', '', e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              >
                <option value="bangla">বাংলা</option>
                <option value="english">English</option>
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#34495e', marginBottom: '15px' }}>নোটিফিকেশন</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  ইমেইল নোটিফিকেশন
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  SMS নোটিফিকেশন
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  পুশ নোটিফিকেশন
                </label>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#34495e', marginBottom: '15px' }}>গোপনীয়তা</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    প্রোফাইল দৃশ্যমানতা
                  </label>
                  <select
                    value={preferences.privacy.profileVisibility}
                    onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="public">সবার জন্য দৃশ্যমান</option>
                    <option value="private">ব্যক্তিগত</option>
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={preferences.privacy.showProgress}
                    onChange={(e) => handlePreferenceChange('privacy', 'showProgress', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  অগ্রগতি প্রদর্শন করুন
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={preferences.privacy.showAchievements}
                    onChange={(e) => handlePreferenceChange('privacy', 'showAchievements', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  অর্জনসমূহ প্রদর্শন করুন
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>নিরাপত্তা সেটিংস</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                padding: '20px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>পাসওয়ার্ড পরিবর্তন</h3>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                  নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড পরিবর্তন করুন
                </p>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  পাসওয়ার্ড পরিবর্তন করুন
                </button>
              </div>

              <div style={{ 
                padding: '20px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>দ্বি-ফ্যাক্টর অথেনটিকেশন</h3>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                  অতিরিক্ত নিরাপত্তার জন্য 2FA সক্রিয় করুন
                </p>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  2FA সক্রিয় করুন
                </button>
              </div>

              <div style={{ 
                padding: '20px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>লগইন ইতিহাস</h3>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                  সাম্প্রতিক লগইন কার্যকলাপ দেখুন
                </p>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  ইতিহাস দেখুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>আমার অর্জনসমূহ</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                padding: '20px',
                border: '2px solid #f1c40f',
                borderRadius: '12px',
                backgroundColor: '#fff9e6',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
                <h3 style={{ color: '#f39c12', marginBottom: '10px' }}>প্রথম কোর্স সম্পূর্ণ</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  প্রাথমিক গণিত কোর্স সফলভাবে সম্পূর্ণ করেছেন
                </p>
                <span style={{ 
                  backgroundColor: '#f1c40f', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}>
                  অর্জিত
                </span>
              </div>

              <div style={{
                padding: '20px',
                border: '2px solid #e74c3c',
                borderRadius: '12px',
                backgroundColor: '#ffeae8',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔥</div>
                <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>সপ্তাহব্যাপী স্ট্রিক</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  ৭ দিন ধারাবাহিক অধ্যয়ন সম্পূর্ণ করেছেন
                </p>
                <span style={{ 
                  backgroundColor: '#e74c3c', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}>
                  অর্জিত
                </span>
              </div>

              <div style={{
                padding: '20px',
                border: '2px solid #bdc3c7',
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                opacity: 0.6
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
                <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>মাস্টার শিক্ষার্থী</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  ৫টি কোর্স সম্পূর্ণ করুন
                </p>
                <span style={{ 
                  backgroundColor: '#bdc3c7', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}>
                  লকড
                </span>
              </div>

              <div style={{
                padding: '20px',
                border: '2px solid #bdc3c7',
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                opacity: 0.6
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌟</div>
                <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>এক্সপার্ট লেভেল</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  ১০০ ঘন্টা অধ্যয়ন সম্পূর্ণ করুন
                </p>
                <span style={{ 
                  backgroundColor: '#bdc3c7', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}>
                  লকড
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
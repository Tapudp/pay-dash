import React, { useState, useEffect } from 'react';
import './ProfileSelection.css';
import { useAuth } from '../../context/AuthContext';

const ProfileSelection = ({ profiles, onLogin }) => {
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    setIsLoginDisabled(!selectedProfile);
  }, [selectedProfile]);

  const handleProfileChange = (event) => {
    const userSelectedProfile = profiles.find(
      (item) => Number(item.id) === Number(event.target.value)
    );
    setSelectedProfile(userSelectedProfile);
  };

  const handleLoginClick = () => {
    if (selectedProfile) {
      login(selectedProfile);
    }
  };

  return (
    <div className='profile-selection'>
      <h3>Select a Profile</h3>
      <select onChange={handleProfileChange}>
        <option value=''>Choose a Profile</option>
        {profiles && profiles.length > 0
          ? profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.firstName} {profile.lastName}
              </option>
            ))
          : null}
      </select>
      <button onClick={handleLoginClick} disabled={isLoginDisabled}>
        Login
      </button>
    </div>
  );
};

export default ProfileSelection;

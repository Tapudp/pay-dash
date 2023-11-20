import React, { useEffect, useState } from 'react';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MainInterface from '../../components/MainInterface/MainInterface';
import ProfileSelection from '../../components/ProfileSelection/ProfileSelection';
import { useAuth } from '../../context/AuthContext';
import APIService from '../../service';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allProfiles, setListOfProfiles] = useState([]);

  // auth context
  const { currentUser, error, setError } = useAuth();

  useEffect(() => {
    APIService.GET({ endpoint: '/profiles/clients' })
      .then((response) => {
        setListOfProfiles(response);
      })
      .catch((apiError) => {
        alert(apiError);
        setError(`${apiError.message} - all profiles`);
      });
  }, []);

  return (
    <div className='home-layout'>
      <h2 className='title'>DeelDash</h2>
      {/* Before login: Profile selection and login button */}
      {!currentUser && <ProfileSelection profiles={allProfiles} />}

      {/* After login: Main interface with deposit buttons, balance, etc. */}
      {currentUser && <MainInterface setLoading={setLoading} setError={setError} />}

      {/* Display error messages if any operation fails */}
      {(error !== '' || error) && (
        <ErrorNotification errorMessage={error} close={() => setError('')} />
      )}

      {/* Display a loading spinner during asynchronous operations */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Home;

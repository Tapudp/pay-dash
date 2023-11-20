import React, { useState } from 'react';
import constants from '../../constants';
import { useAuth } from '../../context/AuthContext';
import APIService from '../../service';
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField';
import DepositButton from '../DepositButton/DepositButtton';
import './MainInterface.css';
import JobListContainer from '../JobListContainer';

const MainInterface = ({ setLoading, setError }) => {
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [jobs, setJobs] = useState(null);
  const { currentUser, logout, setCurrentUser } = useAuth();

  const handleDeposit = async (amount) => {
    setError('');
    setLoading(true);

    try {
      const response = await APIService.POST({
        endpoint: `/balances/deposit/${currentUser.id}`,
        headers: {
          profile_id: currentUser.id,
        },
        data: { amount },
      });

      setCurrentUser((prevDetails) => ({
        ...prevDetails,
        balance: (Number(prevDetails.balance) + Number(amount)).toFixed(2),
      }));
      alert(response.message);
    } catch (error) {
      alert(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const populateContractorDetailsWithJobs = async (contractorDetails) => {
    setError('');
    setLoading(true);
    setSelectedContractor(contractorDetails);

    try {
      const listOfJobs = await APIService.GET({
        endpoint: `/jobs/all?contractorId=${contractorDetails.id}`,
        headers: {
          profile_id: currentUser.id,
        },
      });
      setJobs(() => listOfJobs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const payForAJob = async (jobDetails) => {
    setError('');
    setLoading(true);
    try {
      const payResponse = await APIService.POST({
        endpoint: `/jobs/${jobDetails.id}/pay`,
        headers: {
          profile_id: currentUser.id,
        },
      });
      setJobs((prev) => {
        const newListOfUnPaidJobs = prev.unpaidJobs.filter((item) => item.id !== jobDetails.id);
        prev.paidJobs.push({ ...jobDetails, paid: true });
        return { ...prev, unpaidJobs: newListOfUnPaidJobs };
      });
      setCurrentUser((prevDetails) => ({
        ...prevDetails,
        balance: (prevDetails.balance - Number(jobDetails.price)).toFixed(2),
      }));
      alert(`${payResponse.message} with ${jobDetails.price}!`);
    } catch (error) {
      alert(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-interface'>
      <div className='main-interace-head'>
        <p className='balance-text'>
          Balance: <b> ${currentUser.balance} </b>
        </p>
        <p>
          Welcome,{' '}
          <b>
            {currentUser.firstName} {currentUser.lastName}
          </b>
          !
        </p>
        <button
          className='logout-btn'
          onClick={() => {
            logout();
            setError('');
          }}
        >
          Logout
        </button>
      </div>
      <div className='deposit-btn-list'>
        {constants.baseDepositValues.map((depositValue, idx) => (
          <DepositButton
            key={`${depositValue}-${idx}`}
            amount={depositValue}
            onDeposit={handleDeposit}
          />
        ))}
      </div>

      <AutoCompleteField
        setLoading={setLoading}
        setError={setError}
        onSelectProfile={populateContractorDetailsWithJobs}
      />

      <div>
        {selectedContractor &&
          `showing jobs for [${selectedContractor.firstName} ${selectedContractor.lastName} ${selectedContractor.profession}]`}
      </div>

      <JobListContainer
        jobs={jobs}
        setLoading={setLoading}
        setError={setError}
        payForAJob={payForAJob}
      />
    </div>
  );
};

export default MainInterface;

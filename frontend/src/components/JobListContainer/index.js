import React from 'react';
import JobList from '../Joblist/Joblist';

export default function JobListContainer({ jobs, setLoading, setError, payForAJob }) {
  return (
    <div className='jobs-list-container'>
      {jobs !== null && (
        <>
          <JobList
            title={'Unpaid jobs'}
            jobs={jobs.unpaidJobs}
            setLoading={setLoading}
            setError={setError}
            handlePay={payForAJob}
          />
          <JobList
            title={'Paid jobs'}
            jobs={jobs.paidJobs}
            setLoading={setLoading}
            setError={setError}
          />
        </>
      )}
    </div>
  );
}

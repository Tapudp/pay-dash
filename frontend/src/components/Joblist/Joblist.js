import React from 'react';
import JobItem from '../JobItem/JobItem';
import './Joblist.css';

const JobList = ({ title = 'Job list', jobs, handlePay = () => {} }) => {
  return (
    <div className='job-list'>
      <h3>{title}</h3>
      <div>
        {jobs.length > 0 ? (
          jobs.map((job) => <JobItem key={job.id} job={job} handlePay={handlePay} />)
        ) : (
          <p>No jobs found!</p>
        )}
      </div>
    </div>
  );
};

export default JobList;

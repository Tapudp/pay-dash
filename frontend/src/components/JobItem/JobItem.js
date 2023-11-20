import React from 'react';

const JobItem = ({ job, handlePay }) => {
  return (
    <div className='job-item-card'>
      <p className='job-description'>
        <strong>{job.description}</strong>
      </p>
      <p className='job-price'>
        Price: <strong>${job.price}</strong>
      </p>
      <div className='payment-status'>
        {job.paid ? (
          <span className='paid'>Paid</span>
        ) : (
          <button className='pay-button' onClick={() => handlePay(job)}>
            Pay
          </button>
        )}
      </div>
    </div>
  );
};

export default JobItem;

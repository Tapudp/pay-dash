import React from 'react';
import './DepositButton.css';

const DepositButton = ({ amount, onDeposit }) => {
  const handleDepositClick = () => {
    onDeposit(amount);
  };

  return (
    <button className='deposit-button' onClick={handleDepositClick}>
      Deposit ${amount}
    </button>
  );
};

export default DepositButton;

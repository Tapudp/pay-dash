import React, { useState, useEffect } from 'react';
import './AutoCompleteField.css';
import { useAuth } from '../../context/AuthContext';
import APIService from '../../service';
import Select from 'react-select';

const customStylesForSelect = {
  control: (provided) => ({
    ...provided,
    width: '300px',
  }),
};

const AutoCompleteField = ({ onSelectProfile }) => {
  const [searchInput, setSearchInput] = useState('');
  const [contractors, setContractors] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { currentUser, setError } = useAuth();

  const handleInputChange = (inputValue) => {
    setSearchInput(inputValue);
  };

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleContinueClick = () => {
    if (selectedOption) {
      onSelectProfile(selectedOption.details);
    }
  };

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await APIService.GET({
          endpoint: '/profiles/contractors',
          headers: { profile_id: currentUser.id },
        });
        const formattedContractors = response.map((contractor) => ({
          value: contractor.id,
          details: { ...contractor },
          label: `${contractor.firstName} ${contractor.lastName}`,
        }));
        setContractors(formattedContractors);
      } catch (error) {
        setError(`Failed to fetch contractors : ${error.message} `);
      }
    };

    fetchContractors();
  }, []);

  return (
    <div className='auto-complete-container'>
      <label>Pay jobs for </label>
      <Select
        styles={customStylesForSelect}
        value={selectedOption}
        options={contractors}
        onChange={handleOptionChange}
        onInputChange={handleInputChange}
        placeholder='Search for a contractor...'
        isSearchable
      />

      <button className='continue-button' onClick={handleContinueClick}>
        Continue
      </button>
    </div>
  );
};

export default AutoCompleteField;

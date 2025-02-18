import React, { useState } from 'react';

const jobRoles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'AI Engineer', 'DevOps Engineer', 'Cybersecurity Analyst',
  'Product Manager', 'Business Analyst', 'UI/UX Designer', 'System Architect',
  'Mobile App Developer', 'Cloud Engineer', 'Blockchain Developer'
];

const JobDescriptionForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [interviewLevel, setInterviewLevel] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [filteredRoles, setFilteredRoles] = useState(jobRoles);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleJobRoleChange = (e) => {
    const value = e.target.value;
    setJobRole(value);
    setFilteredRoles(jobRoles.filter(role => role.toLowerCase().includes(value.toLowerCase())));
    setShowDropdown(true);
  };

  const selectJobRole = (role) => {
    setJobRole(role);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Role:', jobRole);
    console.log('Job Description:', jobDescription);
    console.log('Interview Level:', interviewLevel);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Start Mock Interview</h2>

        {/* Job Role Selection */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2" htmlFor="jobRole">
            Job Role
          </label>
          <input
            id="jobRole"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type to search job role..."
            value={jobRole}
            onChange={handleJobRoleChange}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filteredRoles.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
              {filteredRoles.map((role, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => selectJobRole(role)}
                >
                  {role}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="jobDescription">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Enter job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Interview Level */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="interviewLevel">
            Interview Level
          </label>
          <select
            id="interviewLevel"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={interviewLevel}
            onChange={(e) => setInterviewLevel(e.target.value)}
            required
          >
            <option value="" disabled>Select interview level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Start Interview Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Start Interview
        </button>
      </form>
    </div>
  );
};

export default JobDescriptionForm;

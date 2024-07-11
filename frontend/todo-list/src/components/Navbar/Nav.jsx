import React, { useState } from 'react';
import Profile from '../Cards/Profile';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({userInfo}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-white drop-shadow">
      <h2 className='py-2 text-xl font-medium text-black'>
        TO DO List
      </h2>
    </div>
  );
}

export default Navbar;

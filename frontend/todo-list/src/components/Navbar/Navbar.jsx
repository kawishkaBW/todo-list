import React, { useState } from 'react';
import Profile from '../Cards/Profile';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const Navbar = ({ userInfo , onSearchNote , handleCleanSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleCleanSearch();
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-white drop-shadow">
      <h2 className='py-2 text-xl font-medium text-black'>
        TO DO List
      </h2>
      <SearchBar 
        value={searchQuery} 
        onChange={({ target }) => setSearchQuery(target.value)} 
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />   
      <Profile userInfo={userInfo} onLogOut={onLogOut}/>
    </div>
  );
}

export default Navbar;

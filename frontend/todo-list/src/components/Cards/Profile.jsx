import React from 'react';
import PropTypes from 'prop-types';
import { getInitials } from '../../utils/helper';

const Profile = ({ userInfo, onLogOut }) => {
  if (!userInfo || !userInfo.fullName) {
    return (
      <div className='flex items-center gap-3'>
        <p className='text-sm font-medium'>User</p>
        <button className='text-sm text-slate-700' onClick={onLogOut}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <span>Hi</span>
      <p className='text-sm font-medium'>{userInfo.fullName}</p>
      <div className='flex items-center justify-center w-12 h-12 font-medium rounded-full text-slate-950 bg-slate-100'>
        {getInitials(userInfo.fullName)}
      </div>
      <button className='text-sm text-slate-700' onClick={onLogOut}>
        Log Out
      </button>
    </div>
  );
};

Profile.propTypes = {
  userInfo: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }),
  onLogOut: PropTypes.func.isRequired,
};

export default Profile;

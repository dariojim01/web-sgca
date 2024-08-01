import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './../../firebase';
import { Button } from '@material-tailwind/react';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Button onClick={handleSignOut} className="mt-6" fullWidth>
      Sign Out
    </Button>
  );
};

export default SignOut;
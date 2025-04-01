import React from 'react';
import { useParams } from 'react-router-dom';
import ConfirmRestore from '../components/ConfirmRestore';
import NavBar from '../components/NavBar';

const ConfirmRestorePage = () => {
  const { userId, token } = useParams();

  return (
    <div>
      <NavBar layout={4}/>
      <ConfirmRestore userId={userId} token={token} />
    </div>
  );
};

export default ConfirmRestorePage;

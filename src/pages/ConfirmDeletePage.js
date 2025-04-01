import React from 'react';
import { useParams } from 'react-router-dom';
import ConfirmDelete from '../components/ConfirmDelete';
import NavBar from '../components/NavBar';

const ConfirmDeletePage = () => {
  const { userId, token } = useParams();

  return (
    <div>
      <NavBar layout={4}/>
      <ConfirmDelete userId={userId} token={token} />
    </div>
  );
};

export default ConfirmDeletePage;

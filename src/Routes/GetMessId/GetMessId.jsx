import React from 'react';
import MessIdGenerator from '../../components/MessIdGenerator/MessIdGenerator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const GetMessId = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleMessIdGenerated = (newMess) => {
    // Store the new mess data (in real app, this would be handled by API)
    console.log('New mess created:', newMess);
    
    // Show success message and redirect options
    setTimeout(() => {
      navigate('/', { 
        state: { 
          message: `Mess ID ${newMess.id} created! Share it with your students.`,
          messId: newMess.id 
        }
      });
    }, 3000);
  };

  return (
    <div>
      <MessIdGenerator onMessIdGenerated={handleMessIdGenerated} />
    </div>
  );
};

export default GetMessId;

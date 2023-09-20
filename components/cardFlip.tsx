import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import UserForm from '../components/UserForm';

interface User {
    id: number;
    username: string;
    email: string;
  }
  
  interface UsersPageProps {
    users: User[];
  }

const CardFlip = ({ users }: UsersPageProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userList, setUserList] = useState(users);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const handleAddUser = (user: User) => {
    setUserList((prevUsers) => [...prevUsers, user]);
  };

  const handleEditUser = (userId: number) => {
    setEditingUserId(userId);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await fetch(`http://localhost:8000/users/${userId}`, {
        method: 'DELETE',
      });

      const updatedUsers = userList.filter((user) => user.id !== userId);
      setUserList(updatedUsers);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleUserEdited = (editedUser: User) => {
    const updatedUsers = userList.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setUserList(updatedUsers);
    setEditingUserId(null);
  };

  return (
    <div
      className={`card-flip ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="front">
      <UserForm onUserAdded={handleAddUser} />
      </div>
      <div className="back">Back Content</div>
      <button className='button-flip w-5 h-5' onClick={handleFlip}>Flip</button>
    </div>
  );
};

export default CardFlip;
export const getStaticProps: GetStaticProps<UsersPageProps> = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      const data = await response.json();
      return {
        props: { users: data },
      };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        props: { users: [] },
      };
    }
  };
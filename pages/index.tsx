import { GetStaticProps } from 'next';
import { useState } from 'react';
import UserForm from '../components/UserForm';
import UserEditForm from '../components/UserEditForm';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UsersPageProps {
  users: User[];
}

const UsersPage = ({ users }: UsersPageProps) => {
  const [userList, setUserList] = useState(users);
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const handleAddUser = (user: User) => {
    setUserList((prevUsers) => [...prevUsers, user]);
  };

  const handleEditUser = (userId: number) => {
    if(editingUserId){
      setEditingUserId(null);
      setIsFlipped(false);
    }else{
      setEditingUserId(userId);
      setIsFlipped(true);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await fetch(`http://localhost:8000/users/${userId}`, {
        method: 'DELETE',
      });

      const updatedUsers = userList.filter((user) => user.id !== userId);
      setUserList(updatedUsers);
      if(editingUserId === userId){
      setEditingUserId(null);
      setIsFlipped(false);
    }
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
    setIsFlipped(false);
  };

  return (
    <div className='grid md:grid-cols-2 gap-12 max-w-6xl mx-auto'>
      <div
      className={`card-flip my-auto h-[28rem] ${isFlipped ? 'flipped' : ''}`}
    >
      <div className="front rounded-lg">
      <UserForm onUserAdded={handleAddUser} />
      </div>
      <div className="back rounded-lg">
      {editingUserId !== null && (
        <UserEditForm
          user={userList.find((user) => user.id === editingUserId)!}
          onUserEdited={handleUserEdited}
        />
      )}
      </div>
      
    </div>
      <div className='h-screen overflow-auto'>
        <div className='px-8 py-4'>
          <h1 className='text-2xl font-bold pt-4'>Lista de Usuários</h1>
          <ul className='pt-2'>
            {userList.map((user) => (
              <li
                className={`mt-4 shadowbox ${editingUserId === user.id ? 'editing' : ''}`}
                key={user.id}
              >
                <div className='bg-gray-700 grid p-4 rounded-lg'>
                  <span><strong>ID:</strong> {user.id}</span>
                  <span><strong>Nome de usuário:</strong> {user.username}</span>
                  <span><strong>Email:</strong> {user.email}</span>
                  <div className='mt-4 flex justify-end gap-4'>
                    <button
                      className="bg-red-500/50 hover:bg-red-500/25 text-white text-sm font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500/50 hover:bg-blue-500/25 text-white text-sm font-bold py-2 px-4 rounded"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

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

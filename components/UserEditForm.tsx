// UserEditForm.tsx
import { useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserEditFormProps {
  user: User;
  onUserEdited: (editedUser: User) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, onUserEdited }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Validação dos campos obrigatórios
    if (!editedUser.username || !editedUser.email || !editedUser.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Enviar a solicitação de edição para o servidor aqui
    // Você pode usar fetch ou uma biblioteca como axios
    try {
      const response = await fetch(`http://localhost:8000/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        onUserEdited(editedUser); // Atualizando o estado após a edição bem-sucedida
      } else {
        console.error('Erro ao editar usuário');
      }
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
    }
  };

  return (
    <div className="bg-gray-700 w-full h-full my-auto px-8 py-12 rounded-lg shadowbox">
      <h2 className="text-2xl font-bold mb-4">Alterar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">
            Nome de Usuário:
          </label>
          <input
            type="text"
            name="username"
            required
            value={editedUser.username}
            onChange={handleInputChange}
            className="w-full text-black border p-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            required
            value={editedUser.email}
            onChange={handleInputChange}
            className="w-full border p-2 text-black rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">
            Senha:
          </label>
          <input
            type="password"
            name="password"
            required
            value={editedUser.password}
            onChange={handleInputChange}
            className="w-full border p-2 text-black rounded-md"
          />
        </div>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-sky-500/50 hover:bg-sky-500/25 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditForm;
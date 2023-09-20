import { useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserFormProps {
  onUserAdded: (user: User) => void;
}

const UserForm = ({ onUserAdded }: UserFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUser = await response.json();
        onUserAdded(newUser);
        setFormData({
          username: '',
          email: '',
          password: '',
        });
        router.push('/');
      } else {
        console.error('Erro ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <div className="bg-gray-700 my-auto px-8 py-12 w-full rounded-lg h-full shadowbox">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">
            Nome de Usuário:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full text-black border p-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full border p-2 text-black rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full border p-2 text-black rounded-md"
          />
        </div>
        <div className="text-center mt-6">
          <button type="submit" className="bg-sky-500/50 hover:bg-sky-500/25 text-white font-bold py-2 px-4 rounded">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

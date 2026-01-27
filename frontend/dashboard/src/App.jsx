import BudgetTable from './components/dashboard/BugetTable.jsx';
import { useState } from 'react';
import TransactionForm from './components/dashboard/TransactionForm.jsx';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Budget Manager</h1>
            <p className="text-gray-600">Controle financeiro pessoal</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            {showForm ? 'Fechar Formulário' : '+ Nova Transação'}
          </button>
        </header>

        <main>
          {showForm && (
            <TransactionForm onSuccess={handleSuccess} />
          )}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Histórico de Transações</h2>
            <BudgetTable key={refreshKey} />
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
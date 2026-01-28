import { useState, useEffect } from 'react';
import BudgetTable from './components/dashboard/BugetTable.jsx';
import TransactionForm from './components/dashboard/TransactionForm.jsx';
import DashboardStats from './components/dashboard/DashboardStats';
import MonthFilter from './components/dashboard/MonthFilter';
import { transactionService } from './services/transactionServices.js';

function App() {
  const [showForm, setShowForm] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const fetchData = async () => {
    try {
      let filters = {};

      if (currentMonth) {
        const [year, month] = currentMonth.split('-');
        const startDate = `${year}-${month}-01`;

        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        filters = { start_date: startDate, end_date: endDate };
      }

      const data = await transactionService.getAll(filters);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleUpdate = () => {
    fetchData();
  };

  const handleFormSuccess = () => {
    handleUpdate();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Budget Manager</h1>
            <p className="text-gray-600">Controle financeiro pessoal</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Fechar' : '+ Nova Transação'}
          </button>
        </header>

        <main>
          {showForm && (
            <div className="mb-6">
              <TransactionForm onSuccess={handleFormSuccess} />
            </div>
          )}

          <MonthFilter
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />

          <DashboardStats transactions={transactions} />

          <div className="card mb-6 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Histórico</h2>

            <BudgetTable
              transactions={transactions}
              onUpdate={handleUpdate}
            />
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
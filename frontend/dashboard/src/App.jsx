import { useState, useEffect } from 'react';
import BudgetTable from './components/dashboard/BugetTable.jsx';
import TransactionForm from './components/dashboard/TransactionForm.jsx';
import DashboardStats from './components/dashboard/DashboardStats';
import MonthFilter from './components/dashboard/MonthFilter';
import { transactionService } from './services/transactionServices.js';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [notification, setNotification] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );


  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
      showToast("Erro ao carregar dados.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleUpdate = () => {
    fetchData();
  };

  const handleFormSuccess = (msg) => {
    handleUpdate();
    setShowForm(false);
    setEditingTransaction(null);
    showToast(msg || "Transação salva com sucesso!");
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  }

  const handleDeleteSuccess = () => {
    handleUpdate();
    showToast("Transação removida com sucesso!");
  };

  return (
    <div className="min-h-screen p-8 relative">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all transform translate-y-0 animate-fade-in
          ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Budget Manager</h1>
            <p className="text-gray-600">Controle financeiro pessoal</p>
          </div>
          <button
            onClick={() => {
              if (showForm && editingTransaction) {
                setEditingTransaction(null);
              } else {
                setShowForm(!showForm);
              }
            }}
            className="btn-primary"
          >
            {showForm ? (editingTransaction ? 'Cancelar Edição' : 'Fechar') : '+ Nova Transação'}
          </button>
        </header>

        <main>
          {showForm && (
            <div className="mb-6">
              <TransactionForm
                onSuccess={handleFormSuccess}
                transactionToEdit={editingTransaction}
                onCancel={handleCloseForm}
              />
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
              onEdit={handleEditClick}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
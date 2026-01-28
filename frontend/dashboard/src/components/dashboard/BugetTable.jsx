import { transactionService } from '../../services/transactionServices.js';
const BudgetTable = ({ transactions, onUpdate }) => {


  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await transactionService.remove(id);
        if (onUpdate) onUpdate();
      } catch (error) {
        alert("Erro ao excluir item.");
        console.error(error);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (!transactions || transactions.length === 0) {
     return (
        <div className="card mt-6 text-center text-gray-500 p-8">
            Nenhuma transação encontrada neste período.
        </div>
     );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Data</th>
            <th scope="col" className="px-6 py-3">Descrição</th>
            <th scope="col" className="px-6 py-3">Categoria</th>
            <th scope="col" className="px-6 py-3">Tipo</th>
            <th scope="col" className="px-6 py-3 text-right">Valor</th>
            <th scope="col" className="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{formatDate(t.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {t.description}
                </td>

                <td className="px-6 py-4">
                  {t.category ? t.category.name : 'Sem Categoria'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold 
                  ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="btn-danger"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable;
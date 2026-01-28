import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryServices.js';
import { transactionService } from '../../services/transactionServices.js';

const TransactionForm = ({ onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        if (data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id)
      };
      await transactionService.create(payload);
      
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category_id: categories.length > 0 ? categories[0].id : '',
        date: new Date().toISOString().split('T')[0]
      });
      
      alert("Transação salva com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar transação.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h3 className="text-lg font-bold mb-4">Nova Transação</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium opacity-70 mb-1">Descrição</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Ex: Almoço"
          />
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-1">Valor (R$)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-1">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="expense">Despesa (Saída)</option>
            <option value="income">Receita (Entrada)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-1">Categoria</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Selecione...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium opacity-70 mb-1">Data</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full mt-4"> {/* ✨ CLEAN CODE */}
        Salvar Transação
      </button>
    </form>
  );
};

export default TransactionForm;
import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryServices.js';
import { transactionService } from '../../services/transactionServices.js';

import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TransactionForm = ({ onSuccess, transactionToEdit, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  const typeOptions = [
    { id: 'expense', name: 'Despesa (Saída)' },
    { id: 'income', name: 'Receita (Entrada)' }
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);

        if (transactionToEdit) {
          setFormData({
            description: transactionToEdit.description,
            amount: transactionToEdit.amount,
            type: transactionToEdit.type,
            category_id: transactionToEdit.category_id,
            date: transactionToEdit.date.split('T')[0]
          });
        } else if (cats.length > 0) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }));
        }
      } catch (err) {
        console.error("Erro inicialização", err);
      }
    };
    init();
  }, [transactionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id)
      };

      if (transactionToEdit) {
        await transactionService.update(transactionToEdit.id, payload);
        setSuccessMsg("Transação atualizada com sucesso! 🎉");
      } else {
        await transactionService.create(payload);
        setSuccessMsg("Transação criada com sucesso! 🚀");
        setFormData({
          description: '',
          amount: '',
          type: 'expense',
          category_id: categories.length > 0 ? categories[0].id : '',
          date: new Date().toISOString().split('T')[0]
        });
      }

      setTimeout(() => {
        if (onSuccess) {
          const msg = transactionToEdit
            ? "Transação atualizada com sucesso!"
            : "Transação criada com sucesso!";
          onSuccess(msg);
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao salvar. Verifique os dados.");
    }
  };

  return (
    <div className="card mb-6 animate-fade-in relative">
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-center justify-center font-semibold">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-700">
          {transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
        </h3>
        {onCancel && (
          <Button variant="icon" onClick={onCancel}>
            ✕
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Ex: Almoço"
          />

          <Input
            label="Valor (R$)"
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="0.00"
          />

          <Select
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
          />

          <Select
            label="Categoria"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            options={categories}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Data"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button type="submit">
            {transactionToEdit ? 'Atualizar' : 'Salvar Transação'}
          </Button>

          {transactionToEdit && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
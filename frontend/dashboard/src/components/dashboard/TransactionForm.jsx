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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            alert("Erro ao salvar transação. Verifique o console.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Nova Transação</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="Ex: Almoço"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                    <input
                        type="number"
                        name="amount"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    >
                        <option value="expense">Despesa (Saída)</option>
                        <option value="income">Receita (Entrada)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    >
                        <option value="">Selecione...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition duration-200"
            >
                Salvar Transação
            </button>
        </form>
    );
};

export default TransactionForm;
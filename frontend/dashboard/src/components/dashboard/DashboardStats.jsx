import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { transactionService } from '../../services/transactionServices.js';

const DashboardStats = ({ refreshKey }) => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const calculateStats = async () => {
            try {
                const transactions = await transactionService.getAll();

                const income = transactions
                    .filter(t => t.type === 'income')
                    .reduce((acc, curr) => acc + curr.amount, 0);

                const expense = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, curr) => acc + curr.amount, 0);

                setSummary({
                    income,
                    expense,
                    balance: income - expense
                });

                setChartData([
                    { name: 'Receitas', value: income, fill: '#16a34a' },
                    { name: 'Despesas', value: expense, fill: '#dc2626' },
                ]);

            } catch (error) {
                console.error("Erro ao calcular estatísticas", error);
            }
        };

        calculateStats();
    }, [refreshKey]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm uppercase">Entradas</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm uppercase">Saídas</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.expense)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm uppercase">Saldo Atual</h3>
                    <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.balance)}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribuição Financeira</h3>

                {summary.income === 0 && summary.expense === 0 ? (
                    <div className="text-gray-400 h-64 flex items-center justify-center">
                        Sem dados para exibir
                    </div>
                ) : (
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

        </div>
    );
};

export default DashboardStats;
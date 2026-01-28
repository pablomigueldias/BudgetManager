import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { transactionService } from '../../services/transactionServices.js';

const DashboardStats = ({ transactions }) => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const { income, expense, balance, chartData } = useMemo(() => {
    const incomeTotal = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenseTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
      chartData: [
        { name: 'Receitas', value: incomeTotal, fill: 'rgb(var(--color-income))' },
        { name: 'Despesas', value: expenseTotal, fill: 'rgb(var(--color-expense))' },
      ]
    };
  }, [transactions]);


  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

      <div className="space-y-4">
        <div className="card border-l-4 border-[rgb(var(--color-income))]">
          <h3 className="text-sm uppercase opacity-70 font-semibold">Entradas</h3>
          <p className="text-2xl font-bold text-[rgb(var(--color-income))]">
            {formatCurrency(income)}
          </p>
        </div>

        <div className="card border-l-4 border-[rgb(var(--color-expense))]">
          <h3 className="text-sm uppercase opacity-70 font-semibold">Saídas</h3>
          <p className="text-2xl font-bold text-[rgb(var(--color-expense))]">
            {formatCurrency(expense)}
          </p>
        </div>

        <div className="card border-l-4 border-blue-500">
          <h3 className="text-sm uppercase opacity-70 font-semibold">Saldo Atual</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-[rgb(var(--color-expense))]'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="card flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-4">Distribuição</h3>

        {income === 0 && expense === 0 ? (
          <div className="text-gray-400 h-64 flex items-center justify-center italic">
            Sem dados neste período
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
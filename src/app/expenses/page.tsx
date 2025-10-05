'use client';

import { useState, useEffect } from 'react';

type Expense = {
    id: number;
    title: string;
    amount: number;
    frequency: number;
    isRecurring: boolean;
    total: number;
    category: { id: number; name: string };
};

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [form, setForm] = useState<{ title: string, amount?: number, categoryId: number, frequency: number, isRecurring: boolean }>({
        title: '',
        amount: 0,
        categoryId: 1,
        frequency: 1,
        isRecurring: false,
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // You can make this dynamic if needed
    const [totalPages, setTotalPages] = useState(1);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    // Fetch all expenses
    const fetchExpenses = async (page: number, limit: number) => {
        if (!token) return;

        const res = await fetch(`/api/expenses?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
            setExpenses(data.expenses);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        }
    };

    useEffect(() => {
        fetchExpenses(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    // Add expense
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (editId) {
            const res = await fetch(`/api/expenses/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Expense updated successfully!');
                setEditId(null);
                setForm({ title: '', amount: 0, categoryId: 1, frequency: 1, isRecurring: false });
                fetchExpenses(currentPage, itemsPerPage);
                window.location.reload()
            } else {
                setError(data.error || 'Failed to update expense');
            }
            return;
        }
        
        const res = await fetch('/api/expenses/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form),
        });
        
        const data = await res.json();
        
        if (res.ok) {
            setSuccess('Expense added successfully!');
            setForm({ title: '', amount: 0, categoryId: 1, frequency: 1, isRecurring: false });
            fetchExpenses(currentPage, itemsPerPage);
            window.location.reload()
        } else {
            setError(data.error || 'Failed to add expense');
        }
    };

    console.log(expenses);

    // Delete expense
    const handleDelete = async (id: number) => {
        const confirmed = confirm('Are you sure you want to delete this expense?');
        if (!confirmed) return;

        const res = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            fetchExpenses(currentPage, itemsPerPage);
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to delete expense');
        }
    };

    // Fill form for edit
    const handleEdit = (expense: Expense) => {
        setEditId(expense.id);
        setForm({
            title: expense.title,
            amount: expense.amount,
            categoryId: expense.category.id,
            frequency: expense.frequency,
            isRecurring: expense.isRecurring,
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md mb-6">
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    // value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: (e.target.value ? parseFloat(e.target.value) : 0) })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Frequency"
                    // value={form.frequency}
                    onChange={(e) => setForm({ ...form, isRecurring: (parseInt(e.target.value) > 1 ? true : false), frequency: (e.target.value ? parseInt(e.target.value) : 1) })}
                    className="border p-2 rounded"
                    min={1}
                    required
                />
                <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                    className="border p-2 rounded"
                >
                    <option value={1}>Food</option>
                    <option value={2}>Travel</option>
                    <option value={3}>Rent</option>
                    <option value={4}>Utilities</option>
                    <option value={5}>Others</option>
                </select>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button type="submit" className="bg-blue-500 text-white rounded py-2 mt-2 hover:bg-blue-600">
                    {editId ? 'Update Expense' : 'Add Expense'}
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
            <table className="border-collapse border border-gray-300 w-full">
                <thead>
                    <tr>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Frequency</th>
                        <th className="border p-2">Recurring</th>
                        <th className="border p-2">Total</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp) => (
                        <tr key={exp.id}>
                            <td className="border p-2">{exp.title}</td>
                            <td className="border p-2">{exp.amount}</td>
                            <td className="border p-2">{exp.frequency}</td>
                            <td className="border p-2">{exp.isRecurring ? 'Yes' : 'No'}</td>
                            <td className="border p-2">{exp.total}</td>
                            <td className="border p-2">{exp.category.name}</td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}


'use client';

import { useState, useEffect, useCallback } from 'react';

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

    // Filter states
    const [filterTitle, setFilterTitle] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');


    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    // Fetch all expenses
    const fetchExpenses = useCallback(async (page: number, limit: number) => {
        if (!token) return;

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filterTitle) params.append('title', filterTitle);
        if (filterCategory) params.append('category', filterCategory);
        if (filterMinAmount) params.append('minAmount', filterMinAmount);
        if (filterMaxAmount) params.append('maxAmount', filterMaxAmount);


        const res = await fetch(`/api/expenses?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
            setExpenses(data.expenses);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        }
    }, [token, filterTitle, filterCategory, filterMinAmount, filterMaxAmount]);

    useEffect(() => {
        fetchExpenses(currentPage, itemsPerPage);
    }, [fetchExpenses, currentPage, itemsPerPage]);

    const [showFilters, setShowFilters] = useState(false);

    const handleApplyFilters = () => {
        setCurrentPage(1); // Reset to first page when applying filters
        fetchExpenses(1, itemsPerPage);
    };

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
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
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
                </div>

                <div className="w-full md:w-1/2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-black">Filters</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-gray-300 text-gray-800 rounded py-2 px-4 hover:bg-gray-400"
                        >
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                    {showFilters && (
                        <div className="grid grid-cols-1 gap-2">
                            <input
                                type="text"
                                placeholder="Filter by Title"
                                value={filterTitle}
                                onChange={(e) => setFilterTitle(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="border p-2 rounded"
                            >
                                <option value="">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Rent">Rent</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Others">Others</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Min Amount"
                                value={filterMinAmount}
                                onChange={(e) => setFilterMinAmount(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Max Amount"
                                value={filterMaxAmount}
                                onChange={(e) => setFilterMaxAmount(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <button
                                onClick={handleApplyFilters}
                                className="bg-green-500 text-white rounded py-2 hover:bg-green-600"
                            >
                                Apply Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
                    className="bg-blue-500 text-white rounded py-2 px-2 mt-2 hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white rounded py-2 px-2 mt-2 hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

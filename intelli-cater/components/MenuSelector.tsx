import React, { useState, useEffect } from 'react';
import api, { MenuItem } from '../api';
import { Card } from './ui/Card';

interface MenuSelectorProps {
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
}

export const MenuSelector: React.FC<MenuSelectorProps> = ({ selectedIds, onSelectionChange }) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get<MenuItem[]>('/menu-items');
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch menu items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const toggleItem = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    // Extract Categories
    const categories = ['All', 'Selected', ...Array.from(new Set(items.map(i => i.category))).sort()];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'All') return true;
        if (activeTab === 'Selected') return selectedIds.includes(item.id);
        return item.category === activeTab;
    });

    if (loading) return <div className="p-4 text-center text-slate-500">Loading Menu...</div>;

    return (
        <Card>
            <h3 className="font-bold text-lg text-primary mb-4">Menu Selection</h3>

            {/* Search */}
            <input
                type="text"
                placeholder="Search menu items..."
                className="w-full p-2 border border-slate-200 rounded-md mb-4 focus:outline-none focus:border-cta"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeTab === cat
                                ? (cat === 'Selected' ? 'bg-cta text-white' : 'bg-primary text-white')
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {cat} {cat === 'Selected' && `(${selectedIds.length})`}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredItems.length === 0 && (
                    <div className="text-center text-slate-400 py-8 text-sm">No items found.</div>
                )}
                {filteredItems.slice(0, 100).map(item => (
                    <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${selectedIds.includes(item.id)
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'border-slate-100 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                    >
                        <div>
                            <div className={`font-medium ${selectedIds.includes(item.id) ? 'text-primary' : 'text-slate-700'}`}>
                                {item.name}
                            </div>
                            <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>
                                <span>{item.sub_category}</span>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${selectedIds.includes(item.id)
                                ? 'bg-primary border-primary text-white'
                                : 'border-slate-300 text-transparent'
                            }`}>
                            ✓
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm text-slate-500">
                <span>Total Items: {items.length}</span>
                <span>Selected: {selectedIds.length}</span>
            </div>
        </Card>
    );
};

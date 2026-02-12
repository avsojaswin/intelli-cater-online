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
        <Card className="flex flex-col h-full shadow-md border-0 bg-white">
            <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Menu Selection</h3>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {selectedIds.length} Selected
                    </span>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search menu items..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta/50 transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 overflow-x-auto flex gap-2 custom-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === cat
                                ? 'bg-white shadow text-primary border border-slate-200'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredItems.length === 0 && (
                    <div className="text-center text-slate-400 py-12 text-sm flex flex-col items-center">
                        <span className="text-2xl mb-2">🔍</span>
                        No items found.
                    </div>
                )}
                {filteredItems.slice(0, 200).map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`group p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 ${isSelected
                                    ? 'bg-primary/5 border border-primary/20 shadow-sm'
                                    : 'border border-transparent hover:bg-slate-50 hover:border-slate-200'
                                }`}
                        >
                            <div className="flex-1">
                                <div className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                    {item.name}
                                </div>
                                <div className="text-[10px] text-slate-500 flex gap-2 mt-1">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>
                                    <span>{item.sub_category}</span>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected
                                    ? 'bg-primary border-primary text-white'
                                    : 'border-slate-300 text-transparent group-hover:border-slate-400'
                                }`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

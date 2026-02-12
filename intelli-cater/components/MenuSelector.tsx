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

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading Menu...</div>;

    return (
        <Card>
            <h3 className="font-bold text-lg text-primary mb-4">Menu Selection</h3>
            <input
                type="text"
                placeholder="Search menu items..."
                className="w-full p-2 border rounded mb-4"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="h-64 overflow-y-auto space-y-2">
                {filteredItems.slice(0, 100).map(item => (
                    <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-2 border rounded cursor-pointer flex justify-between items-center ${selectedIds.includes(item.id) ? 'bg-primary/10 border-primary' : 'hover:bg-slate-50'}`}
                    >
                        <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.category} - {item.sub_category}</div>
                        </div>
                        {selectedIds.includes(item.id) && <span className="text-primary font-bold">✓</span>}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-slate-500">
                {selectedIds.length} items selected
            </div>
        </Card>
    );
};

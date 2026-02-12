import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Ingredient {
    id: number;
    name: string;
    unit: string;
    stock_qty: number;
}

export interface MenuItem {
    id: number;
    name: string;
    category: string;
    sub_category: string;
    diet_type: string;
}

export interface Event {
    id: number;
    name: string;
    date: string;
    venue: string;
    pax_male: number;
    pax_female: number;
    pax_child: number;
    profile_type: string;
}

export interface IndentRequest {
    event_id: number;
    menu_item_ids: number[];
}

export default api;

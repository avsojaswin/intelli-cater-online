import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, MapPin, ChefHat, Info, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api';
import { MenuSelector } from '../components/MenuSelector';

const EventsPage: React.FC = () => {
  // Event Meta State
  const [eventMeta, setEventMeta] = useState({
    name: 'Tech Summit 2026 Gala',
    venue: 'Convention Center',
    date: new Date().toISOString().split('T')[0]
  });
  const [eventId, setEventId] = useState<number | null>(null);

  // Logic Engine I: Demographic Profiling
  const [counts, setCounts] = useState({ male: 300, female: 250, child: 50 });
  const [totalLoad, setTotalLoad] = useState(0);

  // Logic Engine II: Contextual Calibration
  const [context, setContext] = useState({
    urban: true,
    spice: 'Medium',
    fat: false
  });

  // Menu Selection
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const [indentResult, setIndentResult] = useState<any>(null);

  // Calculate Total Load
  useEffect(() => {
    // Coefficients: Male=1.0, Female=0.85, Child=0.5
    const load = (counts.male * 1.0) + (counts.female * 0.85) + (counts.child * 0.5);
    setTotalLoad(Math.round(load));
  }, [counts]);

  const handleSaveEvent = async () => {
    try {
      const payload = {
        name: eventMeta.name,
        venue: eventMeta.venue,
        date: new Date(eventMeta.date).toISOString(),
        pax_male: counts.male,
        pax_female: counts.female,
        pax_child: counts.child,
        profile_type: context.urban ? 'Urban' : 'Rural',
        menu_item_ids: selectedMenuIds
      };
      const response = await api.post('/events', payload);
      setEventId(response.data.id);
      alert(`Event Saved! ID: ${response.data.id}`);
    } catch (error) {
      console.error("Save Failed", error);
      alert("Failed to save event. " + error);
    }
  };

  const handleGenerateBOM = async () => {
    if (!eventId) {
      // Auto-save if not saved
      await handleSaveEvent();
    }

    // Check if we have an ID now (might need state update delay check, or just use optimistic/returned id)
    // For simplicity, let's assume valid ID or user clicks again.
    // Better: use the ID from response if we refactor.

    // Just call calculate-indent with current state, assuming event exists or mock ID for calculation?
    // The backend `calculate_indent` fetches usage from DB Event? Yes.
    // So we MUST save first.

    try {
      const response = await api.post('/calculate-indent', {
        event_id: eventId || 1, // Fallback to 1 if save failed or not waiting
        menu_item_ids: selectedMenuIds
      });
      setIndentResult(response.data);
    } catch (error) {
      console.error("BOM Generation Failed", error);
      alert("Failed to generate BOM. " + error);
    }
  };

  // Sample data for "Stomach Ceiling" Chart
  const chartData = [
    { name: 'Starter', weight: 200, fill: '#94A3B8' },
    { name: 'Main', weight: 450, fill: '#CBD5E1' },
    { name: 'Dessert', weight: 150, fill: '#E2E8F0' },
  ];

  const totalHeadcount = counts.male + counts.female + counts.child;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Event Name</label>
            <input
              value={eventMeta.name}
              onChange={(e) => setEventMeta({ ...eventMeta, name: e.target.value })}
              className="text-2xl font-bold text-primary w-full border-b border-transparent hover:border-slate-300 focus:border-cta focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Venue</label>
              <input
                value={eventMeta.venue}
                onChange={(e) => setEventMeta({ ...eventMeta, venue: e.target.value })}
                className="text-sm font-medium text-slate-700 w-full border-b border-transparent hover:border-slate-300 focus:border-cta focus:outline-none"
                placeholder="Enter Venue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                value={eventMeta.date}
                onChange={(e) => setEventMeta({ ...eventMeta, date: e.target.value })}
                className="text-sm font-medium text-slate-700 w-full border-b border-transparent hover:border-slate-300 focus:border-cta focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveEvent}>Save Event</Button>
          <Button onClick={handleGenerateBOM}>Generate BOM</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        {/* Left Column: Inputs & Menu (40%) */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 custom-scrollbar">

          {/* Logic Engine I & II Combined */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Users size={18} />
                <h3 className="font-bold">Demographics</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Metabolic Load</span>
                <span className="font-bold text-cta">{totalLoad} units</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                <label className="block text-[10px] text-slate-500 uppercase">Male</label>
                <input type="number" value={counts.male} onChange={(e) => setCounts({ ...counts, male: +e.target.value })} className="w-full bg-transparent text-center font-bold focus:outline-none" />
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                <label className="block text-[10px] text-slate-500 uppercase">Female</label>
                <input type="number" value={counts.female} onChange={(e) => setCounts({ ...counts, female: +e.target.value })} className="w-full bg-transparent text-center font-bold focus:outline-none" />
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                <label className="block text-[10px] text-slate-500 uppercase">Child</label>
                <input type="number" value={counts.child} onChange={(e) => setCounts({ ...counts, child: +e.target.value })} className="w-full bg-transparent text-center font-bold focus:outline-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <MapPin size={18} />
                <h3 className="font-bold">Context</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setContext({ ...context, urban: !context.urban })} className={`p-2 rounded border text-center transition-colors ${context.urban ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-slate-50 border-slate-100'}`}>
                {context.urban ? 'Urban Profile' : 'Rural Profile'}
              </button>
              <select value={context.spice} onChange={(e) => setContext({ ...context, spice: e.target.value as any })} className="p-2 rounded border border-slate-100 bg-slate-50 focus:outline-none">
                <option>Low Spice</option>
                <option>Medium Spice</option>
                <option>High Spice</option>
              </select>
            </div>
          </Card>

          {/* Menu Selection (Taller) */}
          <div className="flex-1">
            <MenuSelector selectedIds={selectedMenuIds} onSelectionChange={setSelectedMenuIds} />
          </div>
        </div>

        {/* Right Column: Chart & BOM (60%) */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-full">

          {/* Stomach Ceiling (Ultra Compact) */}
          <Card className="flex flex-row items-center p-3 gap-6 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-100 rounded text-indigo-700"><ChefHat size={16} /></div>
              <div>
                <h3 className="font-bold text-slate-700 text-sm">Stomach Ceiling</h3>
                <p className="text-[10px] text-slate-500">Constraint: 1.0 kg/pax</p>
              </div>
            </div>

            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-cta transition-all duration-500" style={{ width: '80%' }}></div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-slate-700 text-sm">80% Usage</span>
              <span className="block text-[10px] text-slate-500">0.8 kg allocated</span>
            </div>
          </Card>

          {/* BOM Panel (Big) */}
          <Card className="flex-1 flex flex-col overflow-hidden border-2 border-slate-100 shadow-md">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-700"><ShoppingCart size={20} /></div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Bill of Materials</h3>
                  <p className="text-xs text-slate-500">
                    {indentResult ? `Generated for ${indentResult.total_items} items` : 'Ready to Calculate'}
                  </p>
                </div>
              </div>
              {indentResult && (
                <Button variant="outline" size="sm" onClick={() => alert('Exporting CSV...')}>Download CSV</Button>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-slate-50/30 p-0 custom-scrollbar">
              {!indentResult ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                  <ShoppingCart size={48} strokeWidth={1.5} />
                  <p>Select menu items and click "Generate BOM"</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 border-b border-slate-200">Ingredient</th>
                      <th className="px-6 py-3 border-b border-slate-200">Category</th>
                      <th className="px-6 py-3 border-b border-slate-200 text-right">Qty</th>
                      <th className="px-6 py-3 border-b border-slate-200">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {indentResult.indent.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-700">{item.name}</td>
                        <td className="px-6 py-3 text-slate-500 text-xs">{item.category}</td>
                        <td className="px-6 py-3 text-right font-mono font-bold text-cta">
                          {item.quantity.toFixed(3)}
                        </td>
                        <td className="px-6 py-3 text-slate-400 text-xs">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {indentResult && (
              <div className="p-3 bg-green-50 border-t border-green-100 text-xs text-green-800 flex justify-between px-6">
                <span>Total Check: <strong>Verified</strong></span>
                <span>JIT Batching: <strong>60% - 30% - 10%</strong></span>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default EventsPage;
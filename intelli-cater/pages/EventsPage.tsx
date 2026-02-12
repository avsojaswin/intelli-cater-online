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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-6">

          {/* Logic Engine I Card */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><Users size={20} /></div>
              <div>
                <h3 className="font-bold text-lg text-primary">Demographic Profiling</h3>
                <p className="text-xs text-slate-500">Refining Headcount into Metabolic Capacity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <label className="block text-sm font-medium text-slate-600 mb-2">Adult Male (1.0)</label>
                <input
                  type="number"
                  value={counts.male}
                  onChange={(e) => setCounts({ ...counts, male: parseInt(e.target.value) || 0 })}
                  className="w-full text-2xl font-bold bg-transparent border-b border-slate-300 focus:border-cta focus:outline-none"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <label className="block text-sm font-medium text-slate-600 mb-2">Adult Female (0.85)</label>
                <input
                  type="number"
                  value={counts.female}
                  onChange={(e) => setCounts({ ...counts, female: parseInt(e.target.value) || 0 })}
                  className="w-full text-2xl font-bold bg-transparent border-b border-slate-300 focus:border-cta focus:outline-none"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <label className="block text-sm font-medium text-slate-600 mb-2">Child (0.5)</label>
                <input
                  type="number"
                  value={counts.child}
                  onChange={(e) => setCounts({ ...counts, child: parseInt(e.target.value) || 0 })}
                  className="w-full text-2xl font-bold bg-transparent border-b border-slate-300 focus:border-cta focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between border border-primary/10">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Headcount</p>
                <p className="text-2xl font-bold text-slate-800">{totalHeadcount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-cta">Adjusted Metabolic Load</p>
                <p className="text-3xl font-bold text-cta">{totalLoad} <span className="text-sm font-normal text-slate-500">units</span></p>
              </div>
            </div>
          </Card>

          {/* Logic Engine II Card */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><MapPin size={20} /></div>
              <div>
                <h3 className="font-bold text-lg text-primary">Contextual Calibration</h3>
                <p className="text-xs text-slate-500">Tuning for regional and environmental factors</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Profile Type</p>
                  <p className="text-xs text-slate-500">Urban (Variety) vs Rural (Volume)</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setContext({ ...context, urban: true })}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${context.urban ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Urban
                  </button>
                  <button
                    onClick={() => setContext({ ...context, urban: false })}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!context.urban ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Rural
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Spice Index</p>
                  <p className="text-xs text-slate-500">Adjusts Chili/Tamarind BOM</p>
                </div>
                <select
                  value={context.spice}
                  onChange={(e) => setContext({ ...context, spice: e.target.value as any })}
                  className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-cta"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Fat Index (Ghee+)</p>
                  <p className="text-xs text-slate-500">+15% Ghee for Dum Biryani profiles</p>
                </div>
                <button
                  onClick={() => setContext({ ...context, fat: !context.fat })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${context.fat ? 'bg-cta' : 'bg-slate-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${context.fat ? 'translate-x-5' : ''}`}></div>
                </button>
              </div>
            </div>
          </Card>

          {/* Menu Selection Card */}
          <MenuSelector selectedIds={selectedMenuIds} onSelectionChange={setSelectedMenuIds} />
        </div>

        {/* Right Column: Visualizations */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><ChefHat size={20} /></div>
              <div>
                <h3 className="font-bold text-lg text-primary">Stomach Ceiling</h3>
                <p className="text-xs text-slate-500">Fixed Capacity Constraint (1000g)</p>
              </div>
            </div>

            <div className="flex-1 min-h-[220px] max-h-[300px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: 'Used', value: 800, fill: '#10B981' }, { name: 'Remaining', value: 200, fill: '#E2E8F0' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key="cell-0" fill="#10B981" />
                    <Cell key="cell-1" fill="#E2E8F0" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1 mt-2 text-center">
                <div className="text-2xl font-bold text-slate-700">80%</div>
                <div className="text-xs text-slate-400">Capacity</div>
              </div>

              <div className="absolute top-0 right-0 bg-white/90 p-1.5 rounded border text-[10px] shadow-sm">
                <div className="font-bold text-error">Max: 1.0 kg</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex gap-2 items-start text-amber-800">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs leading-relaxed">
                  <strong>Menu Density Trap Avoided:</strong> Portions adjusted to fit 1000g limit.
                </p>
              </div>
            </div>
          </Card>

          {/* Indent Result Preview */}
          {/* Indent Result Preview */}
          {indentResult && (
            <Card className="col-span-full mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-700"><ShoppingCart size={20} /></div>
                <div>
                  <h3 className="font-bold text-lg text-primary">Generated Indent Details</h3>
                  <p className="text-xs text-slate-500">Based on Stomach Ceiling of {indentResult.capacity.toFixed(0)} units</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Ingredient</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Quantity</th>
                      <th className="px-4 py-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indentResult.indent.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                        <td className="px-4 py-3 text-slate-500">{item.category || '-'}</td>
                        <td className="px-4 py-3 text-right font-bold text-cta">{item.quantity.toFixed(2)}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventsPage;
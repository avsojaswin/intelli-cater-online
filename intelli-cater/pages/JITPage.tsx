import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const JITPage: React.FC = () => {
  const batches = [
    { id: 1, name: 'Batch 1', percent: '60%', status: 'served', time: 'T-0 (Start)', items: 'Chicken Curry, Rice, Dal' },
    { id: 2, name: 'Batch 2', percent: '30%', status: 'cooking', time: 'T+1hr', items: 'Chicken Curry, Naan' },
    { id: 3, name: 'Batch 3', percent: '10%', status: 'pending', time: 'T+2hr (Trigger)', items: 'Stir Fry, Rice' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">JIT Production Control</h1>
          <p className="text-slate-500">Real-time Kitchen Display System (KDS)</p>
        </div>
        <div className="flex gap-4 items-center">
          <select className="border rounded-md px-3 py-1.5 text-sm bg-white text-slate-700 focus:outline-none focus:border-cta">
            <option>Tech Summit 2026 Gala</option>
            <option>Corporate Lunch - Google</option>
          </select>
          <div className="flex gap-2 items-center text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border shadow-sm">
            <Clock size={16} className="text-cta" />
            <span>Event Time: <strong>01:45:00</strong></span>
          </div>
        </div>
      </div>

      {/* Production Timeline Visual */}
      <div className="relative py-8 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between max-w-4xl mx-auto">
          {batches.map((batch, index) => (
            <div key={batch.id} className="flex flex-col items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-4 
                ${batch.status === 'served' ? 'bg-success border-emerald-200 text-white' :
                  batch.status === 'cooking' ? 'bg-white border-cta text-cta animate-pulse' :
                    'bg-white border-slate-200 text-slate-300'}
              `}>
                {batch.status === 'served' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              <div className="text-center bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-700">{batch.time}</p>
                <p className="text-[10px] text-slate-500">{batch.percent} Vol</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KDS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className={`
            border-l-4 
            ${batch.status === 'served' ? 'border-l-success opacity-75' :
              batch.status === 'cooking' ? 'border-l-cta ring-2 ring-cta/10' :
                'border-l-slate-300 border-dashed'}
          `}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-primary">{batch.name}</h3>
                <span className={`
                  inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                  ${batch.status === 'served' ? 'bg-emerald-100 text-emerald-700' :
                    batch.status === 'cooking' ? 'bg-sky-100 text-sky-700' :
                      'bg-slate-100 text-slate-500'}
                `}>
                  {batch.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-700">{batch.percent}</span>
                <p className="text-xs text-slate-400">of Total</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded p-3 mb-4">
              <p className="text-xs font-semibold text-slate-500 mb-1">ITEMS TO PREP</p>
              <p className="text-sm text-slate-800 font-medium">{batch.items}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              {batch.status === 'cooking' ? (
                <Button fullWidth className="bg-success hover:bg-emerald-600">
                  Mark as Ready
                </Button>
              ) : batch.status === 'pending' ? (
                <Button fullWidth variant="outline" className="border-dashed text-slate-400 hover:text-cta hover:border-cta">
                  Start Batch
                </Button>
              ) : (
                <p className="text-xs text-center w-full text-success font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> Completed
                </p>
              )}
            </div>
          </Card>
        ))}

        {/* Conditional Trigger Alert */}
        <Card className="border border-warning/30 bg-warning/5 flex flex-col justify-center items-center text-center p-8">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-bold text-primary mb-1">Batch 3 Trigger</h3>
          <p className="text-sm text-slate-600 mb-4">
            Only cook if consumption variance &gt; 5%. Currently tracking at <span className="font-bold text-emerald-600">2.1%</span> (Safe).
          </p>
          <Button variant="ghost" size="sm" className="text-warning hover:bg-warning/10 hover:text-warning">
            View Variance Data
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default JITPage;
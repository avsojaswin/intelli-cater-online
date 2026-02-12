import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Clock, Users, Leaf, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-primary text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">I</span>
            </div>
            Intelli-Cater
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary">Features</a>
            <a href="#impact" className="text-sm font-medium text-slate-600 hover:text-primary">Impact</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary">Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
            <Button size="sm" onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Resource Orchestration Engine v2.0
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 leading-[1.1]">
                Feeding People, <br />
                <span className="text-accent">Not Trash.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Transform industrial catering from intuitive chaos to data-driven precision. 
                Eliminate the "Menu Density" trap and achieve zero-waste operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/login')} className="group">
                  Start Orchestrating
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="secondary" size="lg">
                  View Technical Blueprint
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Enterprise Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span>ESG Compliant</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur-3xl opacity-50 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Industrial Kitchen Dashboard" 
                className="rounded-xl shadow-2xl border border-slate-200/50 w-full object-cover h-[400px] lg:h-[500px]"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-slate-100 max-w-xs animate-bounce-slow hidden sm:block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Waste Reduction</span>
                  <span className="text-xs font-bold text-emerald-600">-38%</span>
                </div>
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[38%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logic Engines Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">The Logic Engines</h2>
            <p className="text-slate-600">
              Three proprietary algorithms working in concert to optimize procurement and production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Demographic Profiling (Dm)</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Refining headcount into metabolic capacity. Procurement driven by specific composition, not just ticket sales.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Adult Male (Dm = 1.0)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Adult Female (Dm = 0.85)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Child (Dm = 0.5)
                </li>
              </ul>
            </Card>

            <Card className="hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                <UtensilsCrossed size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Stomach Ceiling Constraint</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                The axiom: The sum of all BOM items must be ≤ Patron Capacity. As menu variety increases, portion weight decreases.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-600">
                If Menu Size (Ms) ↑ <br/> THEN Portion Weight (Pw) ↓
              </div>
            </Card>

            <Card className="hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">JIT Production Batching</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Replacing 'Cook All at Once' with a manufacturing-style production line. The 60-30-10 Rule eliminates terminal leftovers.
              </p>
              <div className="flex gap-2 text-xs font-semibold text-white">
                <div className="bg-emerald-500 py-1 px-2 rounded">60% T-0</div>
                <div className="bg-emerald-400 py-1 px-2 rounded">30% T+1</div>
                <div className="bg-emerald-300 py-1 px-2 rounded">10% T+2</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Financial & Environmental Impact</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                      38%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary">Raw Material Optimization</h4>
                    <p className="text-slate-600">Reduction in daily procurement cost by capping calculations at the biological limit.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      12%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary">Energy Savings</h4>
                    <p className="text-slate-600">Reduction in cold storage and fuel costs due to Just-In-Time arrival of materials.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                      40%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary">ESG Compliance</h4>
                    <p className="text-slate-600">Decrease in carbon footprint from food waste decomposition. Shift from 'Abundance' to 'Responsibility'.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <Card noPadding className="overflow-hidden">
                 <div className="bg-primary p-6 text-white">
                   <h3 className="text-lg font-bold">Case Study: The Hyderabad "Grand Wedding"</h3>
                 </div>
                 <div className="p-6 space-y-6">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                     <span className="text-slate-500 font-medium">Traditional Model</span>
                     <div className="text-right">
                       <span className="block text-error font-bold">1200 kg</span>
                       <span className="text-xs text-slate-400">Food Prepared</span>
                     </div>
                     <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">
                          30% Waste
                        </span>
                     </div>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-cta font-bold">Intelli-Cater Model</span>
                     <div className="text-right">
                       <span className="block text-success font-bold">880 kg</span>
                       <span className="text-xs text-slate-400">Food Prepared</span>
                     </div>
                     <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                          5% Waste
                        </span>
                     </div>
                   </div>
                   <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 text-center">
                     <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Hard Cash Saved</p>
                     <p className="text-4xl font-bold text-primary mt-2">₹3.15 Lakhs</p>
                     <p className="text-xs text-slate-400 mt-1">Single event savings @ ₹250/kg avg cost</p>
                   </div>
                 </div>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            The future of catering is not just tasty; it is intelligent.
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Payback period of 6 to 8 months based on Raw Material savings alone. Ready to modernize your operations?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-blue-600 text-white border-none" onClick={() => navigate('/login')}>
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-slate-600 hover:bg-white/10 hover:border-white">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-slate-900 border-t border-slate-800 text-slate-400 text-sm text-center">
        <p>&copy; 2024 Intelli-Cater. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
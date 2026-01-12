import { createFileRoute } from '@tanstack/react-router';
import { Card } from '../../../components/ui/card'; 
import { Button } from '../../../components/ui/button';
import { Plus, MoreVertical, Users, MapPin } from 'lucide-react';

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-zinc-900 bg-white min-h-screen">
      <div className="flex">
        <main className="flex-1 p-8 md:p-12">
          
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-black">Branches</h1>
              <p className="text-zinc-500 mt-2">Manage your locations and staff access.</p>
            </div>
            <Button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition shadow-lg shadow-zinc-200 flex items-center gap-2">
              <Plus size={16} /> 
              Add New Branch
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Branch Card 1 */}
            <Card className="p-6 shadow-md rounded-xl border border-zinc-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    Active
                  </span>
                  <h3 className="text-xl font-semibold mt-3 text-black">Matina Gym Fitness</h3>
                  <div className="flex items-center gap-1 mt-1 text-zinc-500">
                    <MapPin size={14} />
                    <p className="text-sm">123 Matina GSIS Davao City Philippines</p>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-black transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <div className="flex -space-x-3">
                  {/* Avatars would go here */}
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white" />
                </div>
                <button className="text-xs font-semibold text-zinc-900 hover:underline underline-offset-4 flex items-center gap-2">
                  <Users size={14} />
                  Assign Staff & Permissions
                </button>
              </div>
            </Card>

            {/* Branch Card 2 */}
            <Card className="p-6 shadow-md rounded-xl border border-zinc-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
                    Maintenance
                  </span>
                  <h3 className="text-xl font-semibold mt-3 text-black">Panacan Gym Fitness</h3>
                  <div className="flex items-center gap-1 mt-1 text-zinc-500">
                    <MapPin size={14} />
                    <p className="text-sm">123 Panacan Davao City Philippines</p>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-black transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <div className="flex -space-x-3">
                   <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white" />
                </div>
                <button className="text-xs font-semibold text-zinc-900 hover:underline underline-offset-4 flex items-center gap-2">
                  <Users size={14} />
                  Assign Staff & Permissions
                </button>
              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
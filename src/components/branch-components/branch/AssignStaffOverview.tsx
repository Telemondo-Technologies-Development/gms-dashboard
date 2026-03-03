import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Building2, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface AssignStaffOverviewProps {
  branches: {
    id: string;
    name: string;
    address: string;
    assignedStaff?: any[];
  }[];
}

export const AssignStaffOverview: React.FC<AssignStaffOverviewProps> = ({ branches }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Staff Assignment</h2>
        <p className="text-zinc-500">Select a branch to manage and deploy your team members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="group relative overflow-hidden border-zinc-200 p-0 hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-100 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="text-right">
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Branch ID</span>
                   <p className="text-xs font-mono text-zinc-500">{branch.id.slice(0, 8)}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-1">{branch.name}</h3>
              <div className="flex items-center gap-1 text-zinc-500 mb-4">
                <MapPin size={14} />
                <p className="text-sm truncate">{branch.address}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700">Team Size</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {branch.assignedStaff?.length || 0} Members
                </span>
              </div>
            </div>

            <Button 
              asChild
              variant="ghost" 
              className="w-full rounded-none border-t border-zinc-100 h-12 hover:bg-primary hover:text-white group"
            >
              <Link 
                to="/dashboard/marketing/branch/$branchId/assign" 
                params={{ branchId: branch.id }}
                className="flex items-center justify-center gap-2"
              >
                Manage Personnel
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
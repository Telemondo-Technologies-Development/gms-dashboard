import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface StaffDetailsViewProps {
  member: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
  };
  onBack: () => void;
  onRemove: (id: string) => void;
  onRoleChange: (id: string, role: 'Manager' | 'Staff') => void; // Add callback for role change
}

export function StaffDetailsView({ member, onBack, onRemove, onRoleChange }: StaffDetailsViewProps) {
  const detailRows = [
    { icon: Mail, label: 'Email', value: member.email },
    { icon: Phone, label: 'Phone', value: member.phone },
    { icon: MapPin, label: 'Address', value: member.address },
    { icon: Calendar, label: 'Birthday', value: member.birthday },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between p-6 border-b shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => onRemove(member.id)}
          className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600 transition-colors"
        >
          Remove Profile
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{member.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 border border-black rounded-md px-2 py-1 hover:bg-gray-100 transition-colors">
                {member.role}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(['Manager', 'Staff'] as Array<'Manager' | 'Staff'>).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => onRoleChange(member.id, role)} // Call onRoleChange with selected role
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-zinc-50 rounded-2xl p-6 space-y-5 border border-zinc-100">
          {detailRows.map((row, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <row.icon size={16} className="text-zinc-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase text-zinc-400">{row.label}</p>
                <p className="text-sm font-medium text-zinc-900">{row.value || 'Not provided'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
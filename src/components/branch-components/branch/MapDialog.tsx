import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: string;
  longitude: string;
  address: string;
}

const customMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <MapPin size={40} color="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2.5} />
      <div className="absolute top-[8px] w-2 h-2 bg-white rounded-full" />
    </div>
  ),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: 'custom-lucide-icon', 
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export function MapDialog({ open, onOpenChange, latitude, longitude, address }: MapDialogProps) {
  const lat = parseFloat(latitude) || 0;
  const lng = parseFloat(longitude) || 0;
  const position: [number, number] = [lat, lng];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Branch Location</DialogTitle>
        </DialogHeader>

        <div className="h-[350px] w-full rounded-xl overflow-hidden border border-zinc-200 relative z-0">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <Marker position={position} icon={customMarkerIcon}>
              <Popup>
                <div className="text-xs font-bold">{address}</div>
              </Popup>
            </Marker>

            <ChangeView center={position} />
          </MapContainer>
        </div>

        <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
          <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Confirmed Address</p>
          <p className="text-sm font-semibold text-zinc-800 leading-tight">{address}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
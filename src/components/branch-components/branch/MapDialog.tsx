import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

interface MapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number;
  longitude: number;
  address: string;
}

export function MapDialog({ open, onOpenChange, latitude, longitude, address }: MapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Branch Location</DialogTitle>
        </DialogHeader>
        <div className="h-[300px] w-full">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
            />
            <Marker position={[latitude, longitude]} />
          </MapContainer>
        </div>
        <p className="text-center mt-4 text-sm text-muted-foreground">{address}</p>
      </DialogContent>
    </Dialog>
  );
}
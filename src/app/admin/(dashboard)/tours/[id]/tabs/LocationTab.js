'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { updateTourLocation } from '../../actions'
import dynamic from 'next/dynamic'

// 1. Dynamically import Leaflet components (Disable SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer), 
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer), 
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker), 
  { ssr: false }
)

export default function LocationTab({ tour }) {
  // Default to Cairo/Giza if no location set
  const defaultPos = [30.0444, 31.2357] 
  
  // 1. PREPARE INITIAL DATA (Clean helper object)
  const initialData = {
    lat: tour.location?.lat ? Number(tour.location.lat) : defaultPos[0],
    lng: tour.location?.lng ? Number(tour.location.lng) : defaultPos[1],
    name: tour.location?.name || '',
    address: tour.location?.address || ''
  }

  // 2. EDITABLE STATE (What you type/drag)
  const [lat, setLat] = useState(initialData.lat)
  const [lng, setLng] = useState(initialData.lng)
  const [form, setForm] = useState({ 
    name: initialData.name, 
    address: initialData.address 
  })

  // SAFE HANDLERS FOR INPUTS
  const handleLatChange = (e) => {
    setLat(e.target.value);
  }

  const handleLngChange = (e) => {
    setLng(e.target.value);
  }

  // SAFE COORDINATES FOR THE MAP (Fallback to default if empty/NaN)
  // This prevents the crash while typing
  const mapCenter = [
    (lat === '' || isNaN(lat)) ? defaultPos[0] : lat,
    (lng === '' || isNaN(lng)) ? defaultPos[1] : lng
  ];

  const markerRef = useRef(null)
  const [saved, setSaved] = useState(initialData)

  // Leaflet CSS (Required fix for Next.js)
  useEffect(() => {
    import('leaflet/dist/leaflet.css')
    import('leaflet').then(L => {
      // Fix missing default icon issue in Leaflet + Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    })
  }, [])

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = marker.getLatLng()
          setLat(lat)
          setLng(lng)
        }
      },
    }),
    [],
  )

  async function handleSave(formData) {
    // Check if values are empty strings or invalid numbers (like just "-")
    if (lat === '' || lng === '' || isNaN(Number(lat)) || isNaN(Number(lng))) {
      alert("Please enter valid Latitude and Longitude values.");
      return;
    }
    // Append the map coordinates to the form data
    formData.append('lat', lat)
    formData.append('lng', lng)
    formData.append('tourId', tour.id)
    setSaved({ lat, lng, name: form.name, address: form.address })
    try {
      await updateTourLocation(formData)
    } catch (e) {
      alert(e.message)
    }
  }

  const isDirty = 
    lat !== saved.lat ||
    lng !== saved.lng ||
    form.name !== saved.name ||
    form.address !== saved.address;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
        
        {/* LEFT: FORM INPUTS */}
        <div className="p-8 border-r border-gray-100 flex flex-col justify-between">
          <form action={handleSave} className="space-y-6">
            <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Meeting Point</h3>
                <p className="text-xs text-gray-500">Click on the map to set the exact pin location.</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location Name</label>
                <input 
                    name="name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Hotel Lobby / Cairo Tower" 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address</label>
                <textarea 
                    name="address"
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    rows="3"
                    placeholder="Detailed address..." 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Latitude</label>
                    <input 
                        type="number" 
                        step="any"
                        value={lat}
                        onChange={handleLatChange}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-mono font-bold text-gray-700 focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Longitude</label>
                    <input 
                        type="number" 
                        step="any"
                        value={lng}
                        onChange={handleLngChange}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-mono font-bold text-gray-700 focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <button 
                disabled={!isDirty}
                className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all
                    ${isDirty 
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/30' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                `}
            >
                {isDirty ? 'Save Location' : 'Saved'}
            </button>
          </form>
        </div>

        {/* RIGHT: INTERACTIVE MAP */}
        <div className="col-span-2 relative bg-gray-100 z-0">
            <div id="map" className="absolute inset-0">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {lat !== '' && lng !== '' && !isNaN(lat) && !isNaN(lng) && (
                        <Marker 
                            position={[lat, lng]} 
                            draggable={true} 
                            eventHandlers={eventHandlers}
                            ref={markerRef}
                        />
                    )}
                </MapContainer>
            </div>
        </div>

      </div>
    </div>
  )
}
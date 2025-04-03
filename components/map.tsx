"use client"

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { useTheme } from 'next-themes'

interface Location {
  id: number
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  category: string
  impact: number
}

interface MapProps {
  locations: Location[]
  activeLocation: number | null
  onLocationSelect: (id: number) => void
}

// Component to handle map center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, map.getZoom())
  return null
}

export default function Map({ locations, activeLocation, onLocationSelect }: MapProps) {
  const { theme } = useTheme()
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]) // Center of India
  
  // Fix Leaflet icon issues in Next.js - moved inside the component
  useEffect(() => {
    // This is needed to fix the marker icon issues with webpack
(L.Icon.Default.prototype as any)._getIconUrl = undefined;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])
  
  // Update center when active location changes
  useEffect(() => {
    if (activeLocation && locations.length > 0) {
      const location = locations.find(loc => loc.id === activeLocation)
      if (location) {
        setCenter([location.coordinates.lat, location.coordinates.lng])
      }
    }
  }, [activeLocation, locations])
  
  // Create custom icons for different categories
  const getIcon = (category: string) => {
    const iconSize = [25, 41]
    const iconAnchor = [12, 41]
    const popupAnchor = [1, -34]
    
    let iconUrl = '/leaflet/marker-icon.png'
    
    // You can customize this with different colored markers based on category
    switch(category) {
      case 'Education':
        iconUrl = '/leaflet/marker-icon-blue.png'
        break
      case 'Healthcare':
        iconUrl = '/leaflet/marker-icon-red.png'
        break
      case 'Livelihood':
        iconUrl = '/leaflet/marker-icon-green.png'
        break
      case 'Infrastructure':
        iconUrl = '/leaflet/marker-icon-yellow.png'
        break
      default:
        iconUrl = '/leaflet/marker-icon.png'
    }
    
    return L.icon({
      iconUrl,
      iconSize: iconSize as [number, number],
      iconAnchor: iconAnchor as [number, number],
      popupAnchor: popupAnchor as [number, number],
    })
  }
  
  return (
    <MapContainer 
      center={center} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <ChangeView center={center} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={theme === 'dark' 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
      />
      
      {locations.map(location => (
        <Marker 
          key={location.id}
          position={[location.coordinates.lat, location.coordinates.lng]}
          icon={getIcon(location.category)}
          eventHandlers={{
            click: () => onLocationSelect(location.id)
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{location.name}</h3>
              <p className="text-sm">{location.category}</p>
              <p className="text-sm">Impact: {location.impact} people</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { StatCard } from '../components/ui/StatCard';
import { mockProperties } from '../data/mockProperties';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const bueaBaseCoords = { lat: 4.1553, lng: 9.2436 };

const neighborhoodOffsets = {
  'Molyko': { lat: -0.005, lng: 0.005 },
  'Bonduma': { lat: 0.002, lng: -0.002 },
  'Buea Town': { lat: 0.015, lng: -0.010 },
  'Mayor Street': { lat: -0.002, lng: 0.003 },
  'Sandpit': { lat: 0.005, lng: 0.001 },
  'Muea': { lat: 0.025, lng: 0.015 },
  'Small Soppo': { lat: 0.01, lng: -0.005 },
  'Dirty South': { lat: -0.01, lng: 0.01 },
  'Mile16': { lat: -0.015, lng: 0.015 },
  'Mile17': { lat: -0.01, lng: 0.005 },
  'Mile18': { lat: -0.005, lng: 0.002 },
  'Biaka/SantaBabara': { lat: -0.003, lng: 0.004 },
};

const propertiesWithCoords = mockProperties.map((p, idx) => {
  const offset = neighborhoodOffsets[p.neighborhood] || { lat: 0, lng: 0 };
  const randomJitterLat = (Math.sin(idx * 123.45) * 0.005);
  const randomJitterLng = (Math.cos(idx * 678.90) * 0.005);
  return {
    ...p,
    lat: bueaBaseCoords.lat + offset.lat + randomJitterLat,
    lng: bueaBaseCoords.lng + offset.lng + randomJitterLng,
  };
});

export const Map = () => {
  return (
    <PageWrapper noPadding>
      <TopHeader title="Market Map" subtitle="Property Listings in Buea" />
      <div className="p-4 flex flex-col min-h-[calc(100vh-140px)]">
        
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mb-4 z-0 min-h-[400px]">
          <MapContainer 
            center={[bueaBaseCoords.lat, bueaBaseCoords.lng]} 
            zoom={13} 
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {propertiesWithCoords.map(property => (
              <Marker key={property.id} position={[property.lat, property.lng]}>
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-gray-900">{property.address}</h3>
                    <p className="text-xs text-gray-500 mb-2">{property.exactType} • {property.neighborhood}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 mr-2">Price:</span>
                      <span className="font-bold text-primary">{property.currentPrice.toLocaleString()} XAF</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Market Insights</h3>
          <StatCard label="Total Properties Displayed" value={mockProperties.length.toString()} trend="up" trendValue="100%" />
        </div>

      </div>
      <BottomNav />
    </PageWrapper>
  );
};

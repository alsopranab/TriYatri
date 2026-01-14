
import React, { useEffect, useRef } from 'react';
import { VehicleType } from '../types';

declare global {
  interface Window {
    google: any;
    googleMapsAuthError?: boolean;
  }
}

interface MapOverlayProps {
  center?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number } | null;
  onPinMove?: (address: string) => void;
  isEmergency?: boolean;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ 
  center = { lat: 24.3735, lng: 92.1624 }, 
  destinationCoords,
  onPinMove,
  isEmergency
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropMarkerRef = useRef<any>(null);
  const fallbackPolylineRef = useRef<any>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const premiumMutedStyle: any[] = [
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#cad2d3" }] },
        { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
        { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
        { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#e9e9e9" }] },
        { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "weight": 2 }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
        { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "weight": 0.6 }, { "color": "#e0e0e0" }] }
      ];

      const mapOptions = {
        center: center,
        zoom: 16,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: premiumMutedStyle,
        gestureHandling: 'greedy',
        backgroundColor: '#f5f5f5'
      };

      googleMapRef.current = new window.google.maps.Map(mapRef.current!, mapOptions);

      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: googleMapRef.current,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: isEmergency ? "#EF4444" : "#4BA678",
          strokeOpacity: 0.8,
          strokeWeight: 6,
          lineCap: 'round'
        }
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.addEventListener('google-maps-loaded', initMap);
    }
    return () => window.removeEventListener('google-maps-loaded', initMap);
  }, []);

  useEffect(() => {
    if (!googleMapRef.current) return;

    const map = googleMapRef.current;
    
    // Clear old state
    if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
    if (dropMarkerRef.current) dropMarkerRef.current.setMap(null);
    if (fallbackPolylineRef.current) fallbackPolylineRef.current.setMap(null);
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] });

    const addCustomMarkers = (p1: any, p2: any) => {
      pickupMarkerRef.current = new window.google.maps.Marker({
        position: p1,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        }
      });

      dropMarkerRef.current = new window.google.maps.Marker({
        position: p2,
        map: map,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: isEmergency ? "#EF4444" : "#4BA678",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          scale: 1.5,
          anchor: new window.google.maps.Point(12, 24)
        }
      });

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(p1);
      bounds.extend(p2);
      map.fitBounds(bounds, { 
        top: 180, 
        bottom: 250,
        left: 70, 
        right: 70 
      });
    };

    if (destinationCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: center,
          destination: destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setDirections(result);
            addCustomMarkers(center, destinationCoords);
          } else {
            console.warn("TriYatri Directions Fallback: Using straight path polyline due to status:", status);
            
            // DRAW FALLBACK POLYLINE (Straight Line)
            fallbackPolylineRef.current = new window.google.maps.Polyline({
              path: [center, destinationCoords],
              geodesic: true,
              strokeColor: isEmergency ? "#EF4444" : "#4BA678",
              strokeOpacity: 0.6,
              strokeWeight: 5,
              map: map
            });
            
            addCustomMarkers(center, destinationCoords);
          }
        }
      );
    } else {
      if (!isInitialLoad.current) {
        map.panTo(center);
        map.setZoom(16);
      }
      isInitialLoad.current = false;
    }
  }, [center, destinationCoords, isEmergency]);

  return (
    <div className="w-full h-full relative bg-[#f5f5f5]">
      <div ref={mapRef} className="w-full h-full" />
      {!destinationCoords && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-[3.5px] border-[#4BA678] bg-white/50 backdrop-blur-md shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all animate-in zoom-in-75 duration-500">
            <div className="w-3 h-3 rounded-full bg-[#4BA678] shadow-sm"></div>
          </div>
          <div className="w-[3px] h-10 bg-gradient-to-b from-[#4BA678] to-transparent shadow-sm"></div>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]"></div>
    </div>
  );
};

export default MapOverlay;

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const CountryExplorer = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => setCountries(data));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    if (!selectedCountries.find(c => c.cca3 === country.cca3)) {
      setSelectedCountries([...selectedCountries, country]);
      setMapCenter([country.latlng[0], country.latlng[1]]);
      setMapZoom(4);
    }
  };

  const handleCountryRemove = (country) => {
    setSelectedCountries(selectedCountries.filter(c => c.cca3 !== country.cca3));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Country Explorer 🌎</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow mr-2"
        />
        <Button className="bg-blue-500 hover:bg-blue-600 text-white"><Search className="mr-2" /> Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">World Map</h2>
          {typeof window !== 'undefined' && (
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {selectedCountries.map(country => (
                <Marker key={country.cca3} position={[country.latlng[0], country.latlng[1]]}>
                  <Popup>{country.name.common}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Countries</h2>
          <div className="overflow-y-auto max-h-[400px]">
            {filteredCountries.map(country => (
              <Card key={country.cca3} className="mb-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCountrySelect(country)}>
                <CardHeader className="flex flex-row items-center">
                  <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-8 h-8 mr-2" />
                  <CardTitle className="text-xl">{country.name.common}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                  <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                  <p><strong>Region:</strong> {country.region}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {selectedCountries.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Country Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCountries.map(country => (
              <Card key={country.cca3} className="relative">
                <Button 
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1"
                  onClick={() => handleCountryRemove(country)}
                >
                  <X size={16} />
                </Button>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-6 h-6 mr-2" />
                    {country.name.common}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                  <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                  <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
                  <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(', ')}</p>
                  <p><strong>Currencies:</strong> {Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryExplorer;
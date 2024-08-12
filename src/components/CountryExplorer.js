import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ExternalLink } from 'lucide-react';

// Dynamically import the Map component with ssr: false
const Map = dynamic(() => import('./Map'), { ssr: false });

const CountryExplorer = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries:', error));
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

  const getWikipediaLink = (countryName) => {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold mb-8 text-center text-blue-600 drop-shadow-md">🌎 Country Explorer</h1>
        <div className="flex mb-6">
          <Input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow mr-2 shadow-sm"
          />
          <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
            <Search className="mr-2" /> Search
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">World Map</CardTitle>
            </CardHeader>
            <CardContent>
              <Map center={mapCenter} zoom={mapZoom} countries={selectedCountries} />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-y-auto max-h-[400px] pr-2">
                {filteredCountries.map(country => (
                  <Card key={country.cca3} className="mb-4 hover:shadow-lg transition-all transform hover:scale-105">
                    <CardHeader className="flex flex-row items-center p-4">
                      <div className="relative w-12 h-8 mr-4">
                        <Image src={country.flags.svg} alt={`${country.name.common} flag`} layout="fill" objectFit="contain" />
                      </div>
                      <CardTitle className="text-xl">{country.name.common}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                      <p><strong>Region:</strong> {country.region}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => handleCountrySelect(country)}>
                        Add to Comparison
                      </Button>
                      <a 
                        href={getWikipediaLink(country.name.common)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        Learn More <ExternalLink size={16} className="ml-1" />
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {selectedCountries.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Country Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCountries.map(country => (
                  <Card key={country.cca3} className="relative overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <Button 
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md"
                      onClick={() => handleCountryRemove(country)}
                    >
                      <X size={16} />
                    </Button>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center">
                        <div className="relative w-8 h-6 mr-2">
                          <Image src={country.flags.svg} alt={`${country.name.common} flag`} layout="fill" objectFit="contain" />
                        </div>
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
                    <CardFooter>
                      <a 
                        href={getWikipediaLink(country.name.common)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        Learn More <ExternalLink size={16} className="ml-1" />
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CountryExplorer;
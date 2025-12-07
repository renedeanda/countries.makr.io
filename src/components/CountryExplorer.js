import React, { useState, useEffect, useRef } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('https://restcountries.com/v3.1/all')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load countries (Status: ${response.status}). The API might be temporarily unavailable.`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCountries(data);
          setLoading(false);
        } else {
          throw new Error('Invalid data received from the API');
        }
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setError(error.message);
        setCountries([]);
        setLoading(false);
      });

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setShowDropdown(true);
  };

  const filteredCountries = Array.isArray(countries)
    ? countries.filter(country =>
        country?.name?.common?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCountrySelect = (country) => {
    if (!selectedCountries.find(c => c.cca3 === country.cca3)) {
      setSelectedCountries([...selectedCountries, country]);
      setMapCenter([country.latlng[0], country.latlng[1]]);
      setMapZoom(4);
    }
    setSearchTerm('');
    setShowDropdown(false);
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
        <header className="text-center py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center text-blue-600 drop-shadow-md animate-fade-in-down">
            <span className="inline-block animate-bounce">🌎</span> Country Explorer
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Crafted with <span className="text-red-500 animate-pulse inline-block">❤️</span> and <span role="img" aria-label="AI">🤖</span> by{' '}
            <a
              href="https://renedeanda.com/?utm_source=countries"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              René DeAnda
            </a>
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-semibold">⚠️ Error Loading Countries</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2">Please try refreshing the page or check back later.</p>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md text-center">
            <p className="font-semibold">🌍 Loading countries...</p>
            <p className="text-sm mt-1">Please wait while we fetch the data.</p>
          </div>
        )}

        <div className="relative mb-6" ref={searchRef}>
          <Input
            type="text"
            placeholder={loading ? "Loading countries..." : error ? "Unable to load countries" : "Search for a country..."}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full shadow-sm"
            disabled={loading || error}
          />
          {showDropdown && searchTerm && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto" style={{ zIndex: 9999 }}>
              {filteredCountries.map(country => (
                <div
                  key={country.cca3}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="relative w-8 h-6 mr-2">
                    <Image src={country.flags.svg} alt={`${country.name.common} flag`} layout="fill" objectFit="contain" />
                  </div>
                  <span>{country.name.common}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">World Map</CardTitle>
            </CardHeader>
            <CardContent>
              <Map center={mapCenter} zoom={mapZoom} countries={selectedCountries} />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-y-auto max-h-[400px] pr-2">
                {filteredCountries.length === 0 && !loading && !error && (
                  <p className="text-center text-gray-500 py-8">
                    {searchTerm ? 'No countries found matching your search.' : 'No countries available.'}
                  </p>
                )}
                {filteredCountries.map(country => (
                  <Card key={country.cca3} className="mb-4 hover:shadow-lg transition-all transform hover:scale-105">
                    <CardHeader className="flex flex-row items-center p-4">
                      <div className="relative w-12 h-8 mr-4">
                        <Image src={country.flags.svg} alt={`${country.name.common} flag`} layout="fill" objectFit="contain" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{country.name.common}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                      <p><strong>Region:</strong> {country.region}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center flex-wrap">
                      <Button variant="outline" onClick={() => handleCountrySelect(country)} className="mb-2 sm:mb-0">
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
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Country Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCountries.map(country => (
                  <Card key={country.cca3} className="relative overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <Button
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md"
                      onClick={() => handleCountryRemove(country)}
                    >
                      <X size={16} />
                    </Button>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg sm:text-xl flex items-center">
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
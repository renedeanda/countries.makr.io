import SEOMetadata from '../components/SEOMetadata.js';
import CountryExplorer from '../components/CountryExplorer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <SEOMetadata />
      <CountryExplorer />
    </div>
  );
}
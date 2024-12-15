import { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InventoryList from './components/InventoryList';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 h-12">
            <button
              onClick={() => setCurrentPage('upload')}
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                currentPage === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setCurrentPage('inventory')}
              className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                currentPage === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inventory
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'upload' ? <FileUpload /> : <InventoryList />}
      </main>
    </div>
  );
}

export default App; 

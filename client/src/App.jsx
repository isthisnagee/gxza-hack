import { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FileUpload />
      </main>
    </div>
  );
}

export default App; 

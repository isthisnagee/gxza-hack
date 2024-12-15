import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'inventory'),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Group items by name, dosage, and form
        const groupedItems = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          const key = `${data.name}-${data.dosage}-${data.form}`;
          
          if (!acc[key]) {
            acc[key] = {
              id: doc.id,
              name: data.name,
              dosage: data.dosage,
              form: data.form,
              manufacturer: data.manufacturer,
              quantity: 0,
              sources: [],
              lastUpdated: data.uploadedAt?.toDate()
            };
          }
          
          acc[key].quantity += Number(data.quantity);
          acc[key].sources.push({
            file: data.originalFile,
            date: data.uploadedAt?.toDate(),
            quantity: data.quantity
          });
          
          // Keep track of most recent update
          if (data.uploadedAt?.toDate() > acc[key].lastUpdated) {
            acc[key].lastUpdated = data.uploadedAt?.toDate();
          }

          return acc;
        }, {});

        setInventory(Object.values(groupedItems));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching inventory:', error);
        setError('Failed to load inventory');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Inventory List (aggregated)</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr 
                key={`${item.name}-${item.dosage}-${item.form}`} 
                className="hover:bg-gray-50 group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dosage}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.form}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="group-hover:text-blue-600 cursor-pointer">
                    {item.quantity}
                    <div className="hidden group-hover:block absolute bg-white shadow-lg rounded-lg p-4 z-10 mt-2">
                      <h4 className="font-semibold mb-2">Sources:</h4>
                      {item.sources.map((source, idx) => (
                        <div key={idx} className="text-xs mb-1">
                          {source.quantity} units from {source.file} 
                          ({source.date?.toLocaleDateString()})
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.lastUpdated?.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList; 

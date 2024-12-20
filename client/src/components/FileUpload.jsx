import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
      setUploadProgress(0);
    }
  };

  const processFileContent = async (text) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "user",
            content: `
              Parse this pharmacy inventory data and convert to structured format:
              ${text}
              
              Return as JSON array with format:
              [{
                "name": "standardized drug name",
                "dosage": "standardized dosage with unit",
                "form": "pill/liquid/etc",
                "quantity": "numeric only",
                "manufacturer": "standardized manufacturer name"
              }]
            `
          }]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const content = data.choices[0].message.content;
      
      // Extract JSON array from the content using regex
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);
      
      const parsedData = JSON.parse(jsonStr);
      
      // Store processed data in Firestore
      const inventoryRef = collection(db, 'inventory');
      for (const item of parsedData) {
        await addDoc(inventoryRef, {
          ...item,
          uploadedAt: new Date(),
          originalFile: file.name
        });
      }

      return parsedData;
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);
      
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError('Failed to upload file. Please try again.');
          setUploading(false);
          setProcessing(false);
        },
        async () => {
          try {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File uploaded successfully:', downloadURL);
            
            // 2. Process the file with OpenAI
            setProcessing(true);
            
            // Read the file content
            const text = await file.text();
            const processedData = await processFileContent(text);
            
            console.log('Processed data:', processedData);
            setUploadSuccess(true);
            setFile(null);
            e.target.reset();
          } catch (error) {
            console.error('Processing error:', error);
            setUploadError('Failed to process file. Please try again.');
          } finally {
            setUploading(false);
            setProcessing(false);
          }
        }
      );
      
    } catch (error) {
      console.error('Error starting upload:', error);
      setUploadError('Failed to start upload. Please try again.');
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Existing Inventory</h2>
        <h3 className="text-lg text-gray-600 mb-6">(.csv, .txt, .xlsx, .pdf)</h3>
        
        {uploadError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="text-sm text-green-600">File processed successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Choose File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-600
                  hover:file:bg-blue-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
                disabled={uploading || processing}
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {(uploading || processing) && (
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: uploading ? `${uploadProgress}%` : '100%' }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {uploading 
                  ? `${Math.round(uploadProgress)}% uploaded`
                  : 'Processing file...'}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 
              border border-transparent text-sm font-medium rounded-lg
              text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
            disabled={!file || uploading || processing}
          >
            {uploading || processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploading ? 'Uploading...' : 'Processing...'}
              </>
            ) : (
              'Upload Inventory'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload; 

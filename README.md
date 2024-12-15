# GazaPharma Admin

A web application for managing pharmacy inventory uploads in Gaza.

## Setup

1. Install dependencies:

```bash
cd client

```

2. Configure Firebase:
   - Create a `.env` file in `client/src` with your Firebase credentials
   - Set up CORS configuration for Firebase Storage:
     ```bash
     # Create cors.json
     [
       {
         "origin": ["http://localhost:5173"],
         "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
         "responseHeader": ["Content-Type", "Content-Length", "Content-Range"],
         "maxAgeSeconds": 3600
       }
     ]

     # Apply CORS configuration
     gsutil cors set cors.json gs://gxza-inventory.firebasestorage.app
     ```

3. Start the development server:

```bash
npm run dev
```

## Features

- File upload interface for inventory management
- Progress tracking for uploads
- Responsive design for mobile and desktop
- Real-time upload status updates
- Support for various file types

## Tech Stack

- React
- TailwindCSS
- Firebase Storage
- Vite

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   └── Header.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Development

The application is built with React and uses:
- Vite for build tooling
- TailwindCSS for styling
- Firebase Storage for file uploads

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
```

Would you like me to add any additional sections or information to the README?

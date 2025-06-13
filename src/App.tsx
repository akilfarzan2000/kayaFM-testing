import { Routes, Route, Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { sites } from './data/sites';
import AttendanceForm from './components/AttendanceForm';
import Welcome from './components/Welcome';
import { useState } from 'react';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-8"
          >
            <ClipboardCheck className="h-10 w-10 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 ml-3">
              Online Attendance System
            </h1>
          </motion.div>

          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site, index) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/${encodeURIComponent(site.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className={`${site.color} hover:opacity-90 rounded-lg p-6 text-white text-center font-medium shadow-lg transform transition-all duration-200 hover:scale-105 block`}
                    >
                      {site.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            } />
            {sites.map((site) => (
              <Route
                key={site.id}
                path={`/${encodeURIComponent(site.name.toLowerCase().replace(/\s+/g, '-'))}`}
                element={<AttendanceForm site={site} />}
              />
            ))}
          </Routes>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <a 
              href="https://www.aibysolara.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              Created by Solara
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;
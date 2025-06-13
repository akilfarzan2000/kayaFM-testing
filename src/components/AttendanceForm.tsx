import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Loader2, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteConfig } from '../data/sites';

interface FormData {
  fullName: string;
  status: 'Sign In' | 'Sign Out' | '';
}

interface SubmittedData {
  fullName: string;
  status: 'Sign In' | 'Sign Out';
  date: string;
  time: string;
}

interface Props {
  site: SiteConfig;
}

export default function AttendanceForm({ site }: Props) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    status: '',
  });
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    status: false,
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-AU', {
        hour12: false,
        timeZone: 'Australia/Adelaide',
        timeZoneName: 'short'
      }));
      
      setCurrentDate(now.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Australia/Adelaide'
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTo12Hour = (time24: string): string => {
    const [timeStr] = time24.split(' ');
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${period}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      fullName: true,
      status: true,
    });

    if (!formData.fullName || !formData.status) {
      return;
    }

    if (isSubmitting) return;
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const time12Hour = convertTo12Hour(currentTime);

      const response = await fetch('https://n8n-customer-automations.onrender.com/webhook/d1d96d66-709b-4afd-87d9-fddd1d2e818e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site: site.name,
          name: formData.fullName,
          attendance: formData.status,
          date: currentDate,
          time: time12Hour
        }),
      });

      if (!response.ok) throw new Error('Failed to submit attendance');

      setSubmittedData({
        fullName: formData.fullName,
        status: formData.status,
        date: currentDate,
        time: currentTime
      });
      
      setShowSuccess(true);
      setFormData({ fullName: '', status: '' });
      setTouched({ fullName: false, status: false });
    } catch (error) {
      alert('Failed to record attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: keyof typeof touched) => {
    if (touched[field] && !formData[field]) {
      return 'This field is required';
    }
    return '';
  };

  return (
    <div className={`min-h-screen ${site.color} bg-opacity-10`}>
      <div className="w-full max-w-lg mx-auto p-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center mb-6 opacity-0 pointer-events-auto"
            style={{ color: 'transparent' }}
          >
            <ArrowLeft className="h-5 w-5 mr-2 opacity-0" />
            <span className="opacity-0">Back to Sites</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20"
        >
          <div className="flex items-center justify-center mb-8">
            <ClipboardCheck className="h-10 w-10 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 ml-3">
              {site.name}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                maxLength={50}
                placeholder="Enter your full name"
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                  ${getFieldError('fullName')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
              />
              {getFieldError('fullName') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('fullName')}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'Sign In' }));
                    setTouched(prev => ({ ...prev, status: true }));
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200
                    ${formData.status === 'Sign In'
                      ? 'bg-emerald-500 ring-4 ring-emerald-200 scale-105'
                      : formData.status === 'Sign Out'
                        ? 'bg-emerald-400 opacity-40'
                        : 'bg-emerald-400 hover:bg-emerald-500'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'Sign Out' }));
                    setTouched(prev => ({ ...prev, status: true }));
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200
                    ${formData.status === 'Sign Out'
                      ? 'bg-red-500 ring-4 ring-red-200 scale-105'
                      : formData.status === 'Sign In'
                        ? 'bg-red-400 opacity-40'
                        : 'bg-red-400 hover:bg-red-500'
                    }`}
                >
                  Sign Out
                </button>
              </div>
              {getFieldError('status') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('status')}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Current Date
              </label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 sm:text-sm">
                {currentDate}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Current Time (ACST)
              </label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 sm:text-sm">
                {currentTime}
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                'Confirm Attendance'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {/* Confirmation Modal */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Confirm Attendance Details</h2>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Site:</span>
                  <span className="ml-2">{site.name}</span>
                </div>
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{formData.fullName}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-white ${
                    formData.status === 'Sign In' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {formData.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{currentDate}</span>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <span className="ml-2">{currentTime}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Success Modal */}
        {showSuccess && submittedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center mb-6"
              >
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Attendance Successfully Recorded
                </h2>
              </motion.div>
              <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <span className="font-medium">Site:</span>
                  <span className="ml-2">{site.name}</span>
                </div>
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{submittedData.fullName}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-white ${
                    submittedData.status === 'Sign In' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {submittedData.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{submittedData.date}</span>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <span className="ml-2">{submittedData.time}</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
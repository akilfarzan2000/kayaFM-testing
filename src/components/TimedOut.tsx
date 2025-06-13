import React from 'react';
import { motion } from 'framer-motion';
import { Clock, QrCode } from 'lucide-react';

export default function TimedOut() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <div className="rounded-full bg-red-100 p-4 mx-auto w-20 h-20 flex items-center justify-center">
            <Clock className="h-10 w-10 text-red-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Session Timed Out
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6 leading-relaxed"
        >
          Your session has expired for security reasons. Please scan the QR code again to record your attendance.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center mb-6 p-4 bg-blue-50 rounded-lg"
        >
          <QrCode className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-blue-700 font-medium">Scan QR Code to Continue</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 mt-4"
        >
          Sessions automatically expire after 30 seconds of inactivity or when switching tabs
        </motion.p>
      </motion.div>
    </div>
  );
}
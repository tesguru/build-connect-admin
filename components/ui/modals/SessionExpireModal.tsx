// components/Modals/SessionExpiredModal.tsx
import React, { useState, useEffect } from 'react';

import Button from '@/components/ui/Button/Button';
import { useAuthStore } from '@/libs/store/Authstore';
import { useRefreshToken } from '@/libs/hooks/useRefreshToken';

const SessionExpiredModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute default
  const { authToken, refreshToken, clearAuthData } = useAuthStore();
  const { mutate: refreshTokenMutation, isPending } = useRefreshToken();

  // Check token expiry every 30 seconds
  useEffect(() => {
    const checkToken = () => {
      if (!authToken?.expiresAt) return;

      const expiryTime = new Date(authToken.expiresAt).getTime();
      const currentTime = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in ms

      // If token expires in less than 5 minutes, show modal
      if (expiryTime - currentTime < fiveMinutes) {
        const secondsLeft = Math.floor((expiryTime - currentTime) / 1000);
        setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    // Check immediately
    checkToken();

    // Check every 30 seconds
    const interval = setInterval(checkToken, 30000);
    return () => clearInterval(interval);
  }, [authToken]);

  // Countdown timer
  useEffect(() => {
    if (!showModal || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showModal, timeLeft]);

  const handleRefresh = () => {
    if (!refreshToken?.token) {
      handleLogout();
      return;
    }

    refreshTokenMutation(
      { refreshToken: refreshToken.token },
      {
        onSuccess: (data: any) => {
          if (data?.data?.statusCode === 200) {
            setShowModal(false);
            // Reload page to reset everything
            window.location.reload();
          }
        }
      }
    );
  };

  const handleLogout = () => {
    clearAuthData();
    setShowModal(false);
    window.location.href = '/';
  };

  const handleStayLoggedIn = () => {

    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Session About to Expire</h3>
              <p className="text-sm text-red-500 mt-1">
                Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </p>
            </div>
          </div>

    
          <p className="text-gray-600 mb-6">
            Your session will expire soon. Refresh your session to stay logged in.
          </p>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleRefresh}
              loading={isPending}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh Session
            </Button>

            <Button
              onClick={handleStayLoggedIn}
              disabled={isPending}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              Stay Logged In
            </Button>

            <Button
              onClick={handleLogout}
              disabled={isPending}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 text-red-600"
            >
              Logout
            </Button>
          </div>

          {!refreshToken?.token && (
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-600">
                No refresh token available. You will be logged out when session expires.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
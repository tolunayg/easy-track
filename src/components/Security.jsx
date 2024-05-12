import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Security = ({ token, children }) => {
  useEffect(() => {
    const validateToken = () => {
      // Check if token exists and is valid (using the same logic as in AppRouter)
      if (!token || !sessionStorage.getItem('token')) {
        // Redirect to login if token is not valid or not present
        return <Navigate to="/signin" replace />;
      } else {
        // Validate the token against your specific criteria (if needed)
        const storedToken = JSON.parse(sessionStorage.getItem('token'));
        if (storedToken !== token) {
          // Redirect to login if the stored token does not match the current token
          return <Navigate to="/signin" replace />;
        }
      }
      // If token is valid, you can optionally perform additional checks or actions here
    };

    validateToken();


    
  }, [token]);

  return <>{children}</>;
};

export default Security;
// src/components/ui/card.jsx
import React from "react";

// A simple Card component that wraps children in a white background with rounded corners and a shadow.
export const EditCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// CardContent provides padding for the content inside the Card.
export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

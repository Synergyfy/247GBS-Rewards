import React, { Suspense } from 'react';
import Login from './Login';

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        }
      >
        <Login />
      </Suspense>
    </div>
  );
};

export default page;

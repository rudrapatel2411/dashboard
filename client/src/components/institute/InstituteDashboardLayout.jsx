import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import InstituteSidebar from './InstituteSidebar';
import Header from '../Header';

const InstituteDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden font-sans relative">
      {/* Responsive mobile sidebar container */}
      <InstituteSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with hamburger toggle */}
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          searchTerm={globalSearchTerm}
          setSearchTerm={setGlobalSearchTerm}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-main p-4 md:p-6 lg:p-7">
          <Outlet context={{ searchTerm: globalSearchTerm, setSearchTerm: setGlobalSearchTerm }} />
        </main>
      </div>
    </div>
  );
};

export default InstituteDashboardLayout;

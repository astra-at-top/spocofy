import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/header';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="dashboard bg-gray-900 text-white flex min-h-screen  w-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex flex-col flex-grow">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-grow p-4 md:p-8 ">
                    <Outlet/>
                    <Toaster />
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Main from "../components/layout/Main";

import "./DashboardLayout.css";

function DashboardLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="dashboard-content">

                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <Main>
                    <Outlet />
                </Main>

            </div>

        </div>
    );
}

export default DashboardLayout;
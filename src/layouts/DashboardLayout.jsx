import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Main from "../components/layout/Main";

import "./DashboardLayout.css";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <Main>
                    <Outlet />
                </Main>
            </div>
        </div>
    );
}

export default DashboardLayout;
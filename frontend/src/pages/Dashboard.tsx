// @ts-ignore
import React, {useState} from "react";
import DashboardStats from "../components/dashboard/DashboardStats.tsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.tsx";

const DashboardPage = () => {

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Library Dashboard</h1>
        <DashboardStats />
        <DashboardCharts />
      </div>
    );
};

export default DashboardPage;

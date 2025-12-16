import React from 'react';
import MetricsCards from '../components/dashboard/MetricsCards';
import Charts from '../components/dashboard/Charts';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to MyPrintBot Admin Portal. Here's an overview of your platform.
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts */}
      <Charts />
    </div>
  );
};

export default Dashboard;

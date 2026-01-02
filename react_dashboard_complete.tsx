import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Droplets, Activity, AlertTriangle, Gauge, TrendingUp, TrendingDown, Wifi, WifiOff, Database } from 'lucide-react';

const WaterMonitoringDashboard = () => {
  const [currentData, setCurrentData] = useState({
    flowRate: 0,
    totalVolume: 0,
    pressure: 0,
    waterLevel: 0,
    leakDetected: false,
    timestamp: Date.now()
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor data
      const newData = {
        flowRate: Math.random() * 50 + 10,
        totalVolume: currentData.totalVolume + (Math.random() * 2),
        pressure: Math.random() * 5 + 15,
        waterLevel: Math.random() * 30 + 60,
        leakDetected: Math.random() > 0.95,
        timestamp: Date.now()
      };
      
      setCurrentData(newData);
      
      // Add to historical data
      setHistoricalData(prev => {
        const updated = [...prev, {
          time: new Date().toLocaleTimeString(),
          flowRate: newData.flowRate,
          pressure: newData.pressure,
          waterLevel: newData.waterLevel,
          volume: newData.totalVolume
        }];
        return updated.slice(-50); // Keep last 50 readings
      });

      // Generate random alerts
      if (newData.leakDetected && alerts.length < 5) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'leak',
          message: 'Leak detected in main pipeline',
          timestamp: new Date().toLocaleString(),
          severity: 'high'
        }, ...prev]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentData.totalVolume, alerts.length]);

  // Simulate node data
  useEffect(() => {
    const nodeData = [
      { id: 'ESP32_MAIN', location: 'Main Controller', status: 'active', flowRate: currentData.flowRate, waterLevel: currentData.waterLevel },
      { id: 'ESP8266_NODE_01', location: 'Building A - Floor 1', status: 'active', flowRate: Math.random() * 30 + 5, waterLevel: Math.random() * 40 + 50 },
      { id: 'ESP8266_NODE_02', location: 'Building A - Floor 2', status: 'active', flowRate: Math.random() * 25 + 8, waterLevel: Math.random() * 35 + 55 },
      { id: 'ESP8266_NODE_03', location: 'Building B - Floor 1', status: Math.random() > 0.9 ? 'offline' : 'active', flowRate: Math.random() * 40 + 12, waterLevel: Math.random() * 30 + 65 }
    ];
    setNodes(nodeData);
  }, [currentData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const waterUsageData = [
    { name: 'Building A', usage: 1200, target: 1000 },
    { name: 'Building B', usage: 800, target: 900 },
    { name: 'Building C', usage: 600, target: 700 },
    { name: 'Common Areas', usage: 400, target: 300 }
  ];

  const efficiencyData = [
    { name: 'Efficient Usage', value: 70, color: '#10B981' },
    { name: 'Wastage', value: 20, color: '#EF4444' },
    { name: 'Maintenance', value: 10, color: '#F59E0B' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Droplets className="text-blue-500" size={36} />
              Water Monitoring & Replenishment System
            </h1>
            <p className="text-gray-600 mt-2">Real-time water consumption tracking and leak detection</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
              <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(currentData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {currentData.leakDetected && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-3">
          <AlertTriangle size={24} />
          <div>
            <h3 className="font-bold">LEAK DETECTED!</h3>
            <p>Immediate attention required. Pressure drop detected in the main pipeline.</p>
          </div>
        </div>
      )}

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Flow Rate</h3>
              <p className="text-2xl font-bold text-blue-600">{currentData.flowRate.toFixed(1)}</p>
              <p className="text-sm text-gray-500">L/min</p>
            </div>
            <Activity className="text-blue-500" size={32} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">+5.2% from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Volume</h3>
              <p className="text-2xl font-bold text-green-600">{currentData.totalVolume.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Liters</p>
            </div>
            <Droplets className="text-green-500" size={32} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">Normal consumption</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Pressure</h3>
              <p className="text-2xl font-bold text-orange-600">{currentData.pressure.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Bar</p>
            </div>
            <Gauge className="text-orange-500" size={32} />
          </div>
          <div className="mt-4 flex items-center">
            {currentData.leakDetected ? (
              <>
                <TrendingDown className="text-red-500" size={16} />
                <span className="text-red-500 text-sm ml-1">Pressure drop detected</span>
              </>
            ) : (
              <>
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm ml-1">Stable pressure</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Water Level</h3>
              <p className="text-2xl font-bold text-cyan-600">{currentData.waterLevel.toFixed(1)}</p>
              <p className="text-sm text-gray-500">%</p>
            </div>
            <Database className="text-cyan-500" size={32} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">Optimal level</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Real-time Flow Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Flow Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="flowRate" stroke="#3B82F6" strokeWidth={2} name="Flow Rate (L/min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Usage by Building */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Water Usage by Building</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="#10B981" name="Current Usage (L)" />
              <Bar dataKey="target" fill="#6B7280" name="Target (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-parameter Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">System Parameters Over Time</h3>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="flowRate" stroke="#3B82F6" strokeWidth={2} name="Flow Rate (L/min)" />
            <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#F59E0B" strokeWidth={2} name="Pressure (Bar)" />
            <Line yAxisId="right" type="monotone" dataKey="waterLevel" stroke="#10B981" strokeWidth={2} name="Water Level (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Node Status</h3>
          <div className="space-y-4">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{node.id}</h4>
                  <p className="text-sm text-gray-600">{node.location}</p>
                  <p className="text-xs text-gray-500">Flow: {node.flowRate.toFixed(1)} L/min</p>
                </div>
                <div className={`flex items-center gap-2 ${getStatusColor(node.status)}`}>
                  <div className={`w-3 h-3 rounded-full ${node.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium capitalize">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water Efficiency */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Water Efficiency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={efficiencyData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {efficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Water Saved Today:</span>
              <span className="font-semibold text-green-600">342 L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost Savings:</span>
              <span className="font-semibold text-green-600">₹128</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent alerts</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} />
                    <span className="font-medium text-sm">{alert.type.toUpperCase()}</span>
                  </div>
                  <p className="text-sm mb-1">{alert.message}</p>
                  <p className="text-xs opacity-75">{alert.timestamp}</p>
                </div>
              ))
            )}
          </div>
          {alerts.length > 0 && (
            <button 
              onClick={() => setAlerts([])}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Clear All Alerts
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Water Monitoring System v1.0 | Team Neon Ninjas | Sakthi Hackathon 1.0</p>
        <p className="mt-1">Real-time monitoring • Leak detection • ESG compliance • Cost optimization</p>
      </div>
    </div>
  );
};

export default WaterMonitoringDashboard;
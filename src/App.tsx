import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Volume2, 
  TrendingUp, 
  Clock,
  Calendar,
  Building2,
  Bell,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  nameAr: string;
  currentNoise: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  hourlyData: number[];
  dailyData: number[];
}

interface Alert {
  id: string;
  department: string;
  departmentAr: string;
  level: number;
  timestamp: string;
  severity: 'warning' | 'critical';
}

function App() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'icu',
      name: 'ICU',
      nameAr: 'العناية المركزة',
      currentNoise: 45,
      threshold: 40,
      status: 'warning',
      hourlyData: [38, 42, 45, 48, 44, 46, 45, 43],
      dailyData: [42, 45, 38, 46, 44, 48, 45]
    },
    {
      id: 'emergency',
      name: 'Emergency',
      nameAr: 'الطوارئ',
      currentNoise: 65,
      threshold: 50,
      status: 'critical',
      hourlyData: [55, 62, 68, 65, 70, 64, 65, 58],
      dailyData: [58, 62, 55, 68, 65, 70, 65]
    },
    {
      id: 'surgery',
      name: 'Surgery',
      nameAr: 'العمليات',
      currentNoise: 35,
      threshold: 40,
      status: 'safe',
      hourlyData: [32, 35, 38, 35, 33, 36, 35, 34],
      dailyData: [34, 35, 32, 38, 35, 36, 35]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      nameAr: 'الأطفال',
      currentNoise: 48,
      threshold: 35,
      status: 'critical',
      hourlyData: [42, 45, 48, 52, 46, 49, 48, 44],
      dailyData: [44, 45, 42, 52, 48, 49, 48]
    },
    {
      id: 'general',
      name: 'General Ward',
      nameAr: 'الأجنحة العامة',
      currentNoise: 32,
      threshold: 40,
      status: 'safe',
      hourlyData: [28, 32, 35, 32, 30, 33, 32, 29],
      dailyData: [30, 32, 28, 35, 32, 33, 32]
    },
    {
      id: 'radiology',
      name: 'Radiology',
      nameAr: 'الأشعة',
      currentNoise: 42,
      threshold: 45,
      status: 'safe',
      hourlyData: [38, 42, 44, 42, 40, 43, 42, 39],
      dailyData: [40, 42, 38, 44, 42, 43, 42]
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      department: 'Emergency',
      departmentAr: 'الطوارئ',
      level: 65,
      timestamp: '14:30',
      severity: 'critical'
    },
    {
      id: '2',
      department: 'Pediatrics',
      departmentAr: 'الأطفال',
      level: 48,
      timestamp: '14:15',
      severity: 'critical'
    },
    {
      id: '3',
      department: 'ICU',
      departmentAr: 'العناية المركزة',
      level: 45,
      timestamp: '14:00',
      severity: 'warning'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time data updates
      setDepartments(prev => prev.map(dept => ({
        ...dept,
        currentNoise: Math.max(20, dept.currentNoise + (Math.random() - 0.5) * 4),
        status: dept.currentNoise > dept.threshold * 1.2 ? 'critical' : 
                dept.currentNoise > dept.threshold ? 'warning' : 'safe'
      })));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const criticalDepartments = departments.filter(d => d.status === 'critical').length;
  const warningDepartments = departments.filter(d => d.status === 'warning').length;
  const avgNoise = Math.round(departments.reduce((sum, d) => sum + d.currentNoise, 0) / departments.length);

  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-6 sm:h-8 gap-0.5 sm:gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className={`w-1.5 sm:w-2 ${color} rounded-t-sm transition-all duration-300`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '3px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Hospital Noise Monitor</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">نظام مراقبة الضوضاء في المستشفى</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Time display */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-500">Current Time</div>
                  <div className="font-mono text-sm sm:text-lg font-semibold text-gray-800">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="h-8 sm:h-12 w-px bg-gray-200" />
              </div>
              
              {/* View mode buttons */}
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setViewMode('hourly')}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'hourly' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                  <span className="hidden sm:inline">Hourly</span>
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'daily' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                  <span className="hidden sm:inline">Daily</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{departments.length}</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">إجمالي الأقسام</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{criticalDepartments}</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">تنبيهات حرجة</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Warning Alerts</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{warningDepartments}</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">تنبيهات تحذيرية</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Average Noise</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{avgNoise} dB</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">متوسط الضوضاء</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <Volume2 className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Recent Alerts Section */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Recent Alerts
              <span className="text-sm font-normal text-gray-500">التنبيهات الأخيرة</span>
            </h2>
            
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-base text-gray-800">{alert.department}</p>
                      <p className="text-sm text-gray-600">{alert.departmentAr}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base text-gray-900">{alert.level} dB</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Department Monitoring */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Department Noise Levels
                  <span className="text-xs sm:text-sm font-normal text-gray-500 mr-2 hidden sm:inline">مستويات الضوضاء</span>
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    Safe
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    Warning
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    Critical
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {departments.map((dept) => (
                  <div key={dept.id} className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${getStatusColor(dept.status)}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-800">{dept.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{dept.nameAr}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <div className="text-lg sm:text-2xl font-bold text-gray-900">
                            {Math.round(dept.currentNoise)} dB
                          </div>
                          <div className="text-xs text-gray-500">
                            Limit: {dept.threshold} dB
                          </div>
                        </div>
                        <div className="w-16 sm:w-24">
                          <MiniChart 
                            data={viewMode === 'hourly' ? dept.hourlyData : dept.dailyData}
                            color={getProgressColor(dept.status)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-3">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                        <span>Noise Level</span>
                        <span>{Math.round((dept.currentNoise / 80) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${getProgressColor(dept.status)}`}
                          style={{ width: `${Math.min((dept.currentNoise / 80) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* Recent Alerts - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                Recent Alerts
                <span className="text-xs sm:text-sm font-normal text-gray-500 hidden sm:inline">التنبيهات الأخيرة</span>
              </h2>
              
              <div className="space-y-2 sm:space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' 
                      ? 'bg-red-50 border-red-400' 
                      : 'bg-yellow-50 border-yellow-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-800">{alert.department}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{alert.departmentAr}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm sm:text-base text-gray-900">{alert.level} dB</p>
                        <p className="text-xs text-gray-500">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Noise Level Chart - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Noise Trends
                <span className="text-xs sm:text-sm font-normal text-gray-500 hidden sm:inline">اتجاهات الضوضاء</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">
                    {viewMode === 'hourly' ? 'Last 8 Hours' : 'Last 7 Days'}
                  </span>
                  <span className="text-gray-600 hidden sm:inline">
                    {viewMode === 'hourly' ? 'آخر 8 ساعات' : 'آخر 7 أيام'}
                  </span>
                </div>
                
                {departments.slice(0, 3).map((dept) => (
                  <div key={dept.id} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-700 truncate">
                      {dept.name}
                    </div>
                    <div className="flex-1">
                      <MiniChart 
                        data={viewMode === 'hourly' ? dept.hourlyData : dept.dailyData}
                        color={getProgressColor(dept.status)}
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 w-10 sm:w-12 text-right">
                      {Math.round(dept.currentNoise)}dB
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
              
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Generate Report
                </button>
                <button className="w-full p-2 sm:p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Export Data
                </button>
                <button className="w-full p-2 sm:p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Configure Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Noise Trends Section */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Noise Trends
            <span className="text-sm font-normal text-gray-500">اتجاهات الضوضاء</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {viewMode === 'hourly' ? 'Last 8 Hours' : 'Last 7 Days'}
              </span>
              <span className="text-gray-600">
                {viewMode === 'hourly' ? 'آخر 8 ساعات' : 'آخر 7 أيام'}
              </span>
            </div>
            
            {departments.slice(0, 3).map((dept) => (
              <div key={dept.id} className="flex items-center gap-3">
                <div className="w-20 text-sm font-medium text-gray-700 truncate">
                  {dept.name}
                </div>
                <div className="flex-1">
                  <MiniChart 
                    data={viewMode === 'hourly' ? dept.hourlyData : dept.dailyData}
                    color={getProgressColor(dept.status)}
                  />
                </div>
                <div className="text-sm font-semibold text-gray-800 w-12 text-right">
                  {Math.round(dept.currentNoise)}dB
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Quick Actions Section - Moved to the end */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-base font-medium transition-colors">
              Generate Report
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-base font-medium transition-colors">
              Export Data
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-base font-medium transition-colors">
              Configure Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
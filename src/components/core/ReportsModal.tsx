import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart3,
  Activity,
  Wifi,
  Building2,
  Users,
  Settings,
  Printer,
} from "lucide-react";
import axios from "axios";
import GeneralModal from "./GeneralModal";
import getTodayDate from "../../utils/getTodayDate";
import SoundValue from "./SoundValue";
// import getTodayDate from '../../'
interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hideSection: boolean;
  departments: any;
}

type ReportPeriod = "daily" | "weekly" | "monthly";
type ReportType =
  | "overview"
  | "trends"
  | "weekdays"
  | "timeperiods"
  | "medical"
  | "kpis"
  | "technical"
  | "executive"
  | "general"
  | "custom";

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  hideSection,
  departments,
}) => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("daily");
  const [reportType, setReportType] = useState<ReportType>("overview");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ـ, setDepartments] = useState<any[]>([]);
  const [timePeriods, setTimePeriods] = useState<any>([]);
  const [weeklyData, setWeeklyData] = useState<any>([]);
  // const [generalModal, setGeneralModal] = useState<any>([]);

  useEffect(() => {
    if (isOpen) {
      fetchReportData();
      fetchTimePeriodData();
      fetchWeeklyData();
    }
  }, [isOpen, reportPeriod, selectedDate, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://sound-level-django-xkm4b.ondigitalocean.app/soundlevel/dashboard/",
        headers: {},
      };

      const response = await axios.request(config);
      setDepartments(response.data);

      processReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimePeriodData = async () => {
    setLoading(true);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://sound-level-dashboard.vision-jo.com/soundlevel/dashboard/report/sensor_daily_report?date=${selectedDate}`,
        headers: {},
      };

      const response = await axios.request(config);
      setTimePeriods(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    setLoading(true);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://sound-level-dashboard.vision-jo.com/soundlevel/dashboard/report/weekday-analysis/`,
        headers: {},
      };

      const response = await axios.request(config);
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (data: any[]) => {
    const report = {
      // Basic Statistics
      totalDepartments: data.length,
      totalSensors: data.reduce((sum, dept) => sum + dept.sensors.length, 0),
      averageNoise: calculateOverallAverage(data),
      noisestDepartment: findNoisestDepartment(data),
      quietestDepartment: findQuietestDepartment(data),
      criticalAlerts: findCriticalAlerts(data),

      // Advanced Analytics
      trendAnalysis: analyzeTrends(data),
      weekdayAnalysis: analyzeWeekdays(data),
      timePeriodsAnalysis: analyzeTimePeriods(data),
      departmentTypes: analyzeDepartmentTypes(data),
      medicalImpact: analyzeMedicalImpact(data),
      kpis: calculateKPIs(data),
      compliance: analyzeCompliance(data),
      technicalStatus: analyzeTechnicalStatus(data),
      maintenanceReport: analyzeMaintenanceNeeds(data),
      executiveSummary: generateExecutiveSummary(data),
      standardsCompliance: analyzeStandardsCompliance(data),

      departmentStats: data.map((dept) => ({
        name: dept.name,
        nameEn: dept.name_en,
        avgNoise: parseFloat(dept.avg),
        status: dept.color,
        sensorsCount: dept.sensors.length,
        criticalSensors: dept.sensors.filter((s: any) => s.color === "red")
          .length,
        offlineSensors: dept.sensors.filter((s: any) => !s.is_active).length,
        peakHours: analyzeDepartmentPeakHours(dept),
        quietHours: analyzeDepartmentQuietHours(dept),
        uptime: calculateDepartmentUptime(dept),
        signalStrength: calculateAverageSignalStrength(dept),
      })),
    };

    setReportData(report);
  };

  // Analysis Functions
  const calculateOverallAverage = (data: any[]) => {
    const total = data.reduce((sum, dept) => sum + parseFloat(dept.avg), 0);
    return Math.round(total / data.length);
  };

  const findNoisestDepartment = (data: any[]) => {
    return data.reduce((max, dept) =>
      parseFloat(dept.avg) > parseFloat(max.avg) ? dept : max
    );
  };

  const findQuietestDepartment = (data: any[]) => {
    return data.reduce((min, dept) =>
      parseFloat(dept.avg) < parseFloat(min.avg) ? dept : min
    );
  };

  const findCriticalAlerts = (data: any[]) => {
    const criticalSensors: any = [];
    data.forEach((dept) => {
      dept.sensors.forEach((sensor: any) => {
        if (sensor.color === "red" && sensor.is_active) {
          criticalSensors.push({
            department: dept.name,
            departmentEn: dept.name_en,
            sensor: sensor.name,
            sensorEn: sensor.name_en,
            level: Math.round(parseFloat(sensor.avg)),
            threshold: sensor.red,
          });
        }
      });
    });
    return criticalSensors;
  };

  const analyzeTrends = (data: any[]) => {
    // Mock trend analysis - in real implementation, compare with historical data
    return {
      weeklyChange: "+5.2%",
      monthlyChange: "-2.1%",
      trend: "improving",
      prediction: "Noise levels expected to decrease by 3% next week",
    };
  };

  const analyzeWeekdays = (data: any[]) => {
    // Mock weekday analysis
    return {
      noisestDay: "Monday",
      quietestDay: "Friday",
      weekendVsWeekday: {
        weekend: 85,
        weekday: 95,
        difference: "-10.5%",
      },
      dailyAverages: [
        { day: "Sunday", avg: 88, status: "normal" },
        { day: "Monday", avg: 102, status: "high" },
        { day: "Tuesday", avg: 98, status: "high" },
        { day: "Wednesday", avg: 94, status: "normal" },
        { day: "Thursday", avg: 91, status: "normal" },
        { day: "Friday", avg: 82, status: "low" },
        { day: "Saturday", avg: 85, status: "low" },
      ],
    };
  };

  const analyzeTimePeriods = (data: any[]) => {
    return {
      morning: { period: "06:00-12:00", avg: 92, status: "normal" },
      afternoon: { period: "12:00-18:00", avg: 105, status: "high" },
      evening: { period: "18:00-24:00", avg: 88, status: "normal" },
      night: { period: "00:00-06:00", avg: 75, status: "low" },
    };
  };

  const analyzeDepartmentTypes = (data: any[]) => {
    // Categorize departments by type
    return {
      icu: { count: 2, avgNoise: 78, status: "good" },
      emergency: { count: 1, avgNoise: 115, status: "critical" },
      outpatient: { count: 3, avgNoise: 85, status: "normal" },
      surgery: { count: 2, avgNoise: 82, status: "good" },
    };
  };

  const analyzeMedicalImpact = (data: any[]) => {
    return {
      patientSleep: "Noise levels may affect patient sleep in 3 departments",
      healingEnvironment: "Overall environment quality: B+",
      recommendations: [
        "Reduce noise in Emergency Department during night hours",
        "Install sound dampening materials in high-traffic areas",
        "Implement quiet hours policy from 22:00 to 06:00",
      ],
    };
  };

  const calculateKPIs = (data: any[]) => {
    const totalSensors = data.reduce(
      (sum, dept) => sum + dept.sensors.length,
      0
    );
    const activeSensors = data.reduce(
      (sum, dept) => sum + dept.sensors.filter((s: any) => s.is_active).length,
      0
    );
    const criticalSensors = data.reduce(
      (sum, dept) =>
        sum + dept.sensors.filter((s: any) => s.color === "red").length,
      0
    );

    return {
      safeTimePercentage: 85.2,
      criticalExceedances: criticalSensors,
      responseTime: "2.3 minutes",
      systemUptime: Math.round((activeSensors / totalSensors) * 100),
      complianceScore: "A-",
    };
  };

  const analyzeCompliance = (data: any[]) => {
    return {
      whoStandards: "Compliant",
      localRegulations: "Compliant",
      qualityCertification: "ISO 14001 Certified",
      auditScore: 92,
      nextAudit: "2025-12-15",
    };
  };

  const analyzeTechnicalStatus = (data: any[]) => {
    const allSensors = data.flatMap((dept) => dept.sensors);
    const activeSensors = allSensors.filter((s) => s.is_active);
    const avgSignal =
      allSensors.reduce((sum, s) => {
        const lastRecord = s.records?.[s.records.length - 1];
        return sum + (lastRecord?.wifi_signal || 0);
      }, 0) / allSensors.length;

    return {
      systemUptime: Math.round(
        (activeSensors.length / allSensors.length) * 100
      ),
      averageSignalStrength: Math.round(avgSignal),
      sensorsNeedingMaintenance: allSensors.filter(
        (s) =>
          !s.is_active ||
          (s.records?.[s.records.length - 1]?.wifi_signal || 0) < 30
      ).length,
      batteryStatus: "Good", // Mock data
      networkHealth: "Excellent",
    };
  };

  const analyzeMaintenanceNeeds = (data: any[]) => {
    return {
      scheduledMaintenance: [
        {
          sensor: "Sensor #3",
          department: "Emergency",
          date: "2025-08-20",
          type: "Battery Replacement",
        },
        {
          sensor: "Sensor #7",
          department: "ICU",
          date: "2025-08-25",
          type: "Calibration",
        },
      ],
      faultHistory: [
        {
          date: "2025-08-10",
          sensor: "Sensor #5",
          issue: "Signal Loss",
          resolved: true,
        },
        {
          date: "2025-08-08",
          sensor: "Sensor #2",
          issue: "Low Battery",
          resolved: true,
        },
      ],
      maintenanceCost: "$2,450",
      nextScheduledCheck: "2025-08-30",
    };
  };

  const generateExecutiveSummary = (data: any[]) => {
    return {
      overallStatus: "Good",
      keyFindings: [
        "Noise levels are within acceptable ranges in 85% of departments",
        "Emergency Department shows consistently high noise levels",
        "System uptime is excellent at 98.5%",
      ],
      recommendations: [
        "Implement noise reduction measures in Emergency Department",
        "Consider additional sensors in high-traffic areas",
        "Schedule quarterly staff training on noise management",
      ],
      budgetRequirements: "$15,000 for improvements",
      timeline: "3-6 months for full implementation",
    };
  };

  const analyzeStandardsCompliance = (data: any[]) => {
    return {
      whoGuidelines: { status: "Compliant", score: 92 },
      localStandards: { status: "Compliant", score: 88 },
      iso14001: { status: "Certified", validUntil: "2026-03-15" },
      jointCommission: { status: "Accredited", score: 95 },
      recommendations: [
        "Maintain current noise control measures",
        "Document all improvement initiatives",
        "Prepare for annual compliance review",
      ],
    };
  };

  // Helper functions for department analysis
  const analyzeDepartmentPeakHours = (dept: any) => {
    // Mock analysis - in real implementation, analyze historical data
    return "14:00-16:00";
  };

  const analyzeDepartmentQuietHours = (dept: any) => {
    return "02:00-06:00";
  };

  const calculateDepartmentUptime = (dept: any) => {
    const activeSensors = dept.sensors.filter((s: any) => s.is_active).length;
    return Math.round((activeSensors / dept.sensors.length) * 100);
  };

  const calculateAverageSignalStrength = (dept: any) => {
    const signals = dept.sensors.map((s: any) => {
      const lastRecord = s.records?.[s.records.length - 1];
      return lastRecord?.wifi_signal || 0;
    });
    return Math.round(
      signals.reduce((sum: any, signal: any) => sum + signal, 0) /
        signals.length
    );
  };

  // const getPeriodLabel = () => {
  //   switch (reportPeriod) {
  //     case "daily":
  //       return "Daily Report";
  //     case "weekly":
  //       return "Weekly Report";
  //     case "monthly":
  //       return "Monthly Report";
  //     default:
  //       return "Report";
  //   }
  // };

  const getReportTypeLabel = () => {
    const labels = {
      overview: "Overview Report",
      trends: "Trend Analysis",
      weekdays: "Weekday Analysis",
      timeperiods: "Time Periods Analysis",
      medical: "Medical Impact",
      kpis: "Performance Indicators",
      technical: "Technical Status",
      executive: "Executive Summary",
      custom: "Custom Report",
      general: "General Report",
    };
    return labels[reportType];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "text-green-600 bg-green-50";
      case "yellow":
        return "text-yellow-600 bg-yellow-50";
      case "red":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format: "csv" | "excel" | "pdf" | "powerpoint") => {
    if (format === "csv") {
      const csvData = reportData?.departmentStats.map((dept: any) => ({
        Department: dept.name,
        "Department (EN)": dept.nameEn,
        "Average Noise (LV)": dept.avgNoise,
        Status: dept.status,
        "Total Sensors": dept.sensorsCount,
        "Critical Sensors": dept.criticalSensors,
        "Offline Sensors": dept.offlineSensors,
        "Peak Hours": dept.peakHours,
        "Quiet Hours": dept.quietHours,
        "Uptime %": dept.uptime,
        "Signal Strength": dept.signalStrength,
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row: any) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `noise-report-${reportType}-${reportPeriod}-${selectedDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    // Other formats would be implemented similarly
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportType) {
      case "trends":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trend Analysis
                <span className="text-sm font-normal text-blue-600">
                  تحليل الاتجاهات
                </span>
              </h3>

              {/* Trend Chart */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Noise Level Trends Over Time
                </h4>
                <div className="h-64 flex items-end justify-between bg-gray-50 p-4 rounded">
                  {/* Mock trend data - 30 days */}
                  {Array.from({ length: 30 }, (_, i) => {
                    const baseValue = 85;
                    const variation =
                      Math.sin(i * 0.2) * 10 + Math.random() * 8;
                    const value = Math.max(baseValue + variation, 40);
                    const height = ((value - 40) / 120) * 100;
                    return (
                      <div
                        key={i}
                        className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-t flex-1 mx-0.5 relative group"
                        style={{ height: `${height}%`, minHeight: "8px" }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Day {i + 1}: <SoundValue lv={value} /> LV
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-600">Weekly Change</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.trendAnalysis.weeklyChange}
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-600">Monthly Change</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reportData.trendAnalysis.monthlyChange}
                  </p>
                </div>
              </div>

              {/* Prediction Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  7-Day Prediction
                </h4>
                <div className="h-32 flex items-end justify-between bg-gray-50 p-4 rounded">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, i) => {
                      const predictedValue = 85 - i * 2 + Math.random() * 5;
                      const height = ((predictedValue - 40) / 80) * 100;
                      return (
                        <div
                          key={day}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-green-400 rounded-t w-8 mb-2"
                            style={{ height: `${height}%`, minHeight: "8px" }}
                          />
                          <span className="text-xs text-gray-600">{day}</span>
                          <span className="text-xs font-semibold">
                            {predictedValue.toFixed(0)}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-sm font-medium text-gray-800">Prediction:</p>
                <p className="text-gray-600">
                  {reportData.trendAnalysis.prediction}
                </p>
              </div>
            </div>
          </div>
        );

      case "weekdays":
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekday Analysis
                <span className="text-sm font-normal text-purple-600">
                  تحليل أيام الأسبوع
                </span>
              </h3>

              {/* Weekday Bar Chart */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Average Noise by Day
                </h4>

                <div className="h-64 flex items-end justify-between bg-gray-50 p-4 rounded">
                  {weeklyData?.days?.map((day: any, index: number) => {
                    // عامل التكبير (كل ما تزوده الفرق يبان أوضح)
                    const scale = 2;
                    const height = (day.avg - 60) * scale;
                    // -60 هنا عشان مايبقاش كله طويل أوي، ممكن تزبطها حسب الداتا

                    const color =
                      day.level === "high"
                        ? "bg-red-500"
                        : day.level === "normal"
                        ? "bg-yellow-500"
                        : "bg-green-500";

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className={`${color} rounded-t w-12 mb-2 relative group`}
                          style={{ height: `${height}px`, minHeight: "12px" }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.avg.toFixed(2)} LV
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mb-1">
                          {day.long}
                        </span>
                        <span className="text-xs font-semibold">
                          {day.avg.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-600">Noisiest Day</p>
                  <p className="text-xl font-bold text-red-600">
                    {weeklyData.summary.noisiest_day.name}
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-600">Quietest Day</p>
                  <p className="text-xl font-bold text-green-600">
                    {weeklyData.summary.quietest_day.name}
                  </p>
                </div>
              </div>

              {/* Weekend vs Weekday Comparison */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Weekend vs Weekday Comparison
                </h4>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {weeklyData.summary.weekdays_avg}
                        </div>
                        <div className="text-xs text-blue-500">LV</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Weekdays
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">VS</div>
                    <div className="text-sm text-green-600 font-medium">
                      {weeklyData.summary.weekend_vs_weekday_pct}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {weeklyData.summary.weekends_avg}
                        </div>
                        <div className="text-xs text-green-500">LV</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Weekends
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {weeklyData?.days?.map((day: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded text-center ${
                      day.level == "high"
                        ? "bg-red-100 border-red-200"
                        : day.level == "normal"
                        ? "bg-yellow-100 border-yellow-200"
                        : "bg-green-100 border-green-200"
                    } border`}
                  >
                    <p className="text-xs font-medium">{day.long}</p>
                    <p className="text-lg font-bold">
                      {Number(day.avg).toFixed(1)} LV
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "timeperiods":
        const hasValidData =
          timePeriods?.hours?.some((h: any) => h?.avg != null) ||
          timePeriods?.periods?.some((p: any) => p?.avg != null);

        if (!hasValidData) {
          return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center text-gray-600">
              No Time Period Data Available
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Periods Analysis
                <span className="text-sm font-normal text-orange-600">
                  تحليل الفترات الزمنية
                </span>
              </h3>

              {/* 24-Hour Heatmap */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  24-Hour Noise Heatmap
                </h4>
                <div className="grid grid-cols-12 gap-1">
                  {timePeriods?.hours?.map((hour: any, index: number) => {
                    if (hour?.avg == null) {
                      return (
                        <div
                          key={index}
                          className="bg-gray-300 h-8 rounded flex items-center justify-center text-gray-600 text-xs font-bold"
                        ></div>
                      );
                    }

                    const bgColor =
                      hour.level === "high"
                        ? "bg-red-500"
                        : hour.level === "normal"
                        ? "bg-yellow-500"
                        : "bg-green-500";

                    return (
                      <div
                        key={index}
                        className={`${bgColor} h-8 rounded flex items-center justify-center text-white text-xs font-bold relative group`}
                      >
                        {hour?.hour}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {hour?.hour} - {hour?.avg?.toFixed(0)} LV
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:00</span>
                </div>
              </div>

              {/* Radial Chart for Time Periods */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Time Period Comparison
                </h4>
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    {/* SVG Radial Chart */}
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      {/* خلفية رمادية */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                      />

                      {timePeriods?.hours?.map((hour: any, index: number) => {
                        if (hour?.avg == null) return null; // نتجاهل الداتا الفاضية

                        const radius = 80;
                        const circumference = 2 * Math.PI * radius;
                        const segment = circumference / 24;
                        const offset = circumference - index * segment;

                        const color =
                          hour.level === "high"
                            ? "#ef4444"
                            : hour.level === "low"
                            ? "#22c55e"
                            : "#eab308";

                        return (
                          <circle
                            key={index}
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="20"
                            strokeDasharray={`${segment} ${
                              circumference - segment
                            }`}
                            strokeDashoffset={offset}
                            className="transition-all duration-500"
                            transform="rotate(-90 100 100)"
                          />
                        );
                      })}

                      {/* النص في المنتصف */}
                      <text
                        x="100"
                        y="105"
                        textAnchor="middle"
                        className="text-sm font-bold fill-gray-700"
                      >
                        24 Hours
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Periods Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {timePeriods?.periods
                  ?.filter((period: any) => period?.avg != null) // ⬅️ فلترة أي عنصر مفيهوش avg
                  .map((period: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded border ${
                        period.level === "high"
                          ? "bg-red-50 border-red-200"
                          : period.level === "low"
                          ? "bg-green-50 border-green-200"
                          : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <p className="text-sm font-medium capitalize">
                        {period.name}
                      </p>
                      <p className="text-xs text-gray-600">{period.range}</p>
                      <p className="text-xl font-bold">{period.avg} LV</p>
                      <p
                        className={`text-xs capitalize ${
                          period.level === "high"
                            ? "text-red-600"
                            : period.level === "low"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {period.range}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case "medical":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Medical Impact Analysis
                <span className="text-sm font-normal text-green-600">
                  تحليل التأثير الطبي
                </span>
              </h3>

              {/* Impact Gauge Chart */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Patient Care Impact Score
                </h4>
                <div className="flex justify-center">
                  <div className="relative  ">
                    {reportData.departmentStats
                      .slice(0, 5)
                      .map((dept: any, index: number) => {
                        const riskLevel =
                          dept.avgNoise > 100
                            ? "high"
                            : dept.avgNoise > 75
                            ? "medium"
                            : "low";

                        const riskColor =
                          riskLevel === "high"
                            ? "#ef4444" // أحمر
                            : riskLevel === "medium"
                            ? "#eab308" // أصفر
                            : "#22c55e"; // أخضر

                        const percentage = Math.min(
                          (dept.avgNoise / 120) * 100,
                          100
                        );
                        const radius = 40;
                        const circumference = 2 * Math.PI * radius;
                        const offset =
                          circumference - (percentage / 100) * circumference;

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center p-4"
                          >
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              {/* الخلفية الرمادية */}
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                              />
                              {/* الـ progress arc */}
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke={riskColor}
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)" // يبدأ من فوق
                              />
                              {/* النص */}
                              <text
                                x="50"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-sm font-bold fill-gray-800"
                              >
                                {dept.avgNoise} LV
                              </text>
                            </svg>
                            <span className="mt-2 text-xs font-medium text-gray-700">
                              {dept.name}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                riskLevel === "high"
                                  ? "text-red-600"
                                  : riskLevel === "medium"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {riskLevel.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Department Impact Chart */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Department Sleep Impact Risk
                </h4>
                <div className="space-y-3">
                  {reportData.departmentStats
                    .slice(0, 5)
                    .map((dept: any, index: number) => {
                      const riskLevel =
                        dept.avgNoise > 100
                          ? "high"
                          : dept.avgNoise > 75
                          ? "medium"
                          : "low";
                      const riskColor =
                        riskLevel === "high"
                          ? "bg-red-500"
                          : riskLevel === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500";
                      const riskWidth =
                        riskLevel === "high"
                          ? "100%"
                          : riskLevel === "medium"
                          ? "75%"
                          : "50%";
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium text-gray-700 truncate">
                            {dept.name}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                            <div
                              className={`${riskColor} h-4 rounded-full transition-all duration-500`}
                              style={{ width: riskWidth }}
                            />
                            <span className="absolute right-2 top-0 h-4 flex items-center text-xs text-gray-600">
                              {dept.avgNoise} LV
                            </span>
                          </div>
                          <div
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              riskLevel === "high"
                                ? "bg-red-100 text-red-700"
                                : riskLevel === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {riskLevel}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-gray-800">
                    Patient Sleep Impact
                  </p>
                  <p className="text-gray-600">
                    {/* {reportData.medicalImpact.patientSleep} */}
                    Noise levels may affect patient sleep in 1 departments
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-gray-800">
                    Healing Environment Quality
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.medicalImpact.healingEnvironment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "kpis":
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Key Performance Indicators
                <span className="text-sm font-normal text-indigo-600">
                  مؤشرات الأداء الرئيسية
                </span>
              </h3>

              {/* KPI Dashboard with Circular Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                  {
                    label: "Safe Time %",
                    value: reportData.kpis.safeTimePercentage,
                    color: "green",
                    target: 90,
                  },
                  {
                    label: "System Uptime",
                    value: reportData.kpis.systemUptime,
                    color: "blue",
                    target: 95,
                  },
                  {
                    label: "Response Time",
                    value: 85,
                    color: "purple",
                    target: 90,
                    suffix: "score",
                  },
                ].map((kpi, index) => {
                  const percentage = (kpi.value / 100) * 100;
                  const circumference = 2 * Math.PI * 45;
                  const strokeDasharray = `${
                    (percentage / 100) * circumference
                  } ${circumference}`;
                  const color =
                    kpi.color === "green"
                      ? "#22c55e"
                      : kpi.color === "blue"
                      ? "#3b82f6"
                      : "#8b5cf6";

                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg border text-center"
                    >
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={color}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className="text-2xl font-bold"
                              style={{ color }}
                            >
                              {kpi.value}
                              {kpi.suffix ? "" : "%"}
                            </div>
                            {kpi.suffix && (
                              <div className="text-xs text-gray-500">
                                {kpi.suffix}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {kpi.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        Target: {kpi.target}%
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Performance Trend Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Performance Trends (Last 12 Months)
                </h4>
                <div className="h-48 flex items-end justify-between bg-gray-50 p-4 rounded">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(2024, i, 1).toLocaleDateString(
                      "en",
                      { month: "short" }
                    );
                    const performance =
                      75 + Math.sin(i * 0.5) * 15 + Math.random() * 10;
                    const height = (performance / 100) * 100;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-t w-6 mb-2 relative group"
                          style={{ height: `${height}%`, minHeight: "8px" }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {performance.toFixed(1)}%
                          </div>
                        </div>
                        <span className="text-xs text-gray-600">{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border text-center">
                  <p className="text-sm text-gray-600">Safe Time %</p>
                  <p className="text-3xl font-bold text-green-600">
                    {reportData.kpis.safeTimePercentage}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded border text-center">
                  <p className="text-sm text-gray-600">System Uptime</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reportData.kpis.systemUptime}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded border text-center">
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {reportData.kpis.complianceScore}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "technical":
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Technical Status Report
                <span className="text-sm font-normal text-gray-600">
                  تقرير الحالة التقنية
                </span>
              </h3>

              {/* System Health Dashboard */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  System Health Overview
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "CPU Usage",
                      value: 45,
                      color: "bg-green-500",
                      icon: "🖥️",
                    },
                    {
                      label: "Memory",
                      value: 67,
                      color: "bg-yellow-500",
                      icon: "💾",
                    },
                    {
                      label: "Network",
                      value: 89,
                      color: "bg-blue-500",
                      icon: "🌐",
                    },
                    {
                      label: "Storage",
                      value: 34,
                      color: "bg-green-500",
                      icon: "💿",
                    },
                  ].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-2">{metric.icon}</div>
                      <div className="w-16 h-16 mx-auto mb-2 relative">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={metric.color
                              .replace("bg-", "#")
                              .replace(
                                "500",
                                metric.value > 80
                                  ? "ef4444"
                                  : metric.value > 60
                                  ? "eab308"
                                  : "22c55e"
                              )}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${metric.value} 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {metric.value}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensor Status Map */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Sensor Network Status
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {Array.from({ length: 32 }, (_, i) => {
                    const status = Math.random() > 0.1 ? "online" : "offline";
                    const signal = Math.random() * 100;
                    const color =
                      status === "offline"
                        ? "bg-gray-400"
                        : signal > 70
                        ? "bg-green-500"
                        : signal > 40
                        ? "bg-yellow-500"
                        : "bg-red-500";
                    return (
                      <div
                        key={i}
                        className={`${color} w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold relative group`}
                      >
                        {i + 1}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Sensor {i + 1}:{" "}
                          {status === "offline"
                            ? "Offline"
                            : `${signal.toFixed(0)}% signal`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Strong Signal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Weak Signal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Poor Signal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span>Offline</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium">System Uptime</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.technicalStatus.systemUptime}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium">Avg Signal Strength</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData.technicalStatus.averageSignalStrength}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium">Need Maintenance</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData.technicalStatus.sensorsNeedingMaintenance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "executive":
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Executive Summary
                <span className="text-sm font-normal text-slate-600">
                  الملخص التنفيذي
                </span>
              </h3>

              {/* Executive Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Overall Status Gauge */}
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Overall System Status
                  </h4>
                  <div className="flex justify-center">
                    <div className="relative w-32 h-16">
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        <path
                          d="M 10 40 A 40 40 0 0 1 90 40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <path
                          d="M 10 40 A 40 40 0 0 1 70 15"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                        <div className="text-2xl font-bold text-green-600">
                          Good
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Key Metrics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Departments Monitored
                      </span>
                      <span className="font-bold text-blue-600">
                        {reportData.totalDepartments}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Active Sensors
                      </span>
                      <span className="font-bold text-green-600">
                        {reportData.totalSensors}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Critical Alerts
                      </span>
                      <span className="font-bold text-red-600">
                        {reportData.criticalAlerts.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Avg Response Time
                      </span>
                      <span className="font-bold text-purple-600">2.3 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI and Budget Chart */}
              <div className="bg-white p-4 rounded-lg border mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Investment vs Impact Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">
                      Budget Allocation
                    </h5>
                    <div className="space-y-2">
                      {[
                        {
                          category: "Hardware",
                          amount: 8000,
                          color: "bg-blue-500",
                        },
                        {
                          category: "Software",
                          amount: 3000,
                          color: "bg-green-500",
                        },
                        {
                          category: "Maintenance",
                          amount: 2500,
                          color: "bg-yellow-500",
                        },
                        {
                          category: "Training",
                          amount: 1500,
                          color: "bg-purple-500",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 ${item.color} rounded`}
                          ></div>
                          <div className="flex-1 flex justify-between">
                            <span className="text-sm text-gray-700">
                              {item.category}
                            </span>
                            <span className="text-sm font-semibold">
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">
                      Expected Benefits
                    </h5>
                    <div className="space-y-2">
                      {[
                        {
                          benefit: "Patient Satisfaction",
                          improvement: "+15%",
                          color: "text-green-600",
                        },
                        {
                          benefit: "Staff Productivity",
                          improvement: "+12%",
                          color: "text-blue-600",
                        },
                        {
                          benefit: "Compliance Score",
                          improvement: "+8%",
                          color: "text-purple-600",
                        },
                        {
                          benefit: "Energy Savings",
                          improvement: "+5%",
                          color: "text-yellow-600",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-700">
                            {item.benefit}
                          </span>
                          <span
                            className={`text-sm font-semibold ${item.color}`}
                          >
                            {item.improvement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-gray-800 mb-2">
                    Overall Status
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.executiveSummary.overallStatus}
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-gray-800 mb-3">Key Findings</p>
                  <ul className="space-y-2">
                    {reportData.executiveSummary.keyFindings.map(
                      (finding: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-blue-600">•</span>
                          {finding}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <p className="font-medium text-gray-800">
                      Budget Requirements
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {reportData.executiveSummary.budgetRequirements}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="font-medium text-gray-800">
                      Implementation Timeline
                    </p>
                    <p className="text-lg font-semibold text-gray-700">
                      {reportData.executiveSummary.timeline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "general":
        return (
          <div className="space-y-6">
            <GeneralModal departments={departments} />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Department Noise Levels Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Department Noise Levels
                </h4>
                <div className="h-48 flex items-end justify-between bg-gray-50 p-4 rounded">
                  {reportData.departmentStats
                    .slice(0, 6)
                    .map((dept: any, index: number) => {
                      const height = ((dept.avgNoise - 40) / 80) * 100;
                      const color =
                        dept.status === "red"
                          ? "bg-red-500"
                          : dept.status === "yellow"
                          ? "bg-yellow-500"
                          : "bg-green-500";
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className={`${color} rounded-t w-8 mb-2 relative group`}
                            style={{ height: `${height}%`, minHeight: "12px" }}
                          >
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {dept.name}: {dept.avgNoise} LV
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 text-center leading-tight">
                            {dept.name.split(" ")[0]}
                          </span>
                          <span className="text-xs font-semibold">
                            {dept.avgNoise}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Status Distribution Pie Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Status Distribution
                </h4>
                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Safe - 60% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray="150.8 251.2"
                        strokeDashoffset="0"
                      />
                      {/* Warning - 25% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="20"
                        strokeDasharray="62.8 339.2"
                        strokeDashoffset="-150.8"
                      />
                      {/* Critical - 15% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray="37.7 364.3"
                        strokeDashoffset="-213.6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {reportData.totalSensors}
                        </div>
                        <div className="text-xs text-gray-500">Sensors</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Safe (60%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Warning (25%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Critical (15%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Total Departments
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {reportData.totalDepartments}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Total Sensors
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {reportData.totalSensors}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">
                      Average Noise
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {reportData.averageNoise} LV
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Critical Alerts
                    </p>
                    <p className="text-2xl font-bold text-red-900">
                      {reportData.criticalAlerts.length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Department Statistics Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Department Statistics
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    إحصائيات الأقسام
                  </span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Noise (LV)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sensors
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uptime %
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peak Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.departmentStats.map(
                      (dept: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {dept.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {dept.nameEn}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dept.avgNoise}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                dept.status
                              )}`}
                            >
                              {dept.status === "green"
                                ? "Safe"
                                : dept.status === "yellow"
                                ? "Warning"
                                : "Critical"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {dept.sensorsCount}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {dept.uptime}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {dept.peakHours}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal-print bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:border-b-2 print:border-black">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Advanced Noise Reports
              </h2>
              <p className="text-sm text-gray-600">
                تقارير متقدمة لمستويات الضوضاء
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print Report"
            >
              <Printer className="h-5 w-5 text-gray-600" />
            </button>
            {/* <button
              onClick={() => handleExport("csv")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export CSV"
            >
              <Download className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Excel"
            >
              <FileSpreadsheet className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleExport("powerpoint")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export PowerPoint"
            >
              <Presentation className="h-5 w-5 text-gray-600" />
            </button> */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="print-content p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6 ">
              {/* Report Controls */}
              <div className="flex flex-wrap gap-4 items-center justify-between print:hidden">
                <div className="flex flex-wrap gap-4">
                  {/* {
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-gray-700 self-center mr-3">
                        Period:
                      </span>
                      {(["daily", "weekly", "monthly"] as ReportPeriod[]).map(
                        (period) => (
                          <button
                            key={period}
                            onClick={() => setReportPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                              reportPeriod === period
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {period}
                          </button>
                        )
                      )}
                    </div>§
                  } */}
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-gray-700 self-center mr-3">
                      Type:
                    </span>
                    <select
                      value={reportType}
                      onChange={(e) =>
                        setReportType(e.target.value as ReportType)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {hideSection ? (
                        <>
                          <option value="overview">Overview</option>
                          <option value="general">General</option>
                          <option value="weekdays">Weekday Analysis</option>
                          <option value="timeperiods">Time Periods</option>
                          <option value="medical">Medical Impact</option>
                        </>
                      ) : (
                        <>
                          <option value="overview">Overview</option>
                          <option value="trends">Trend Analysis</option>
                          <option value="weekdays">Weekday Analysis</option>
                          <option value="timeperiods">Time Periods</option>
                          <option value="medical">Medical Impact</option>
                          <option value="kpis">Performance KPIs</option>
                          <option value="technical">Technical Status</option>
                          <option value="executive">Executive Summary</option>
                        </>
                      )}
                      {/* <option value="standards">Standards</option> */}
                    </select>
                  </div>
                </div>
                {reportType == "timeperiods" && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Report Header */}
              <div className="text-center border-b pb-4 print:pb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Hospital Noise Monitoring - {getReportTypeLabel()}
                </h1>
                <p className="text-gray-600">
                  Generated on {getTodayDate()}
                  {/* {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} */}
                </p>
                {/* <p className="text-sm text-gray-500">
                  Report Period: {selectedDate} ({reportPeriod})
                </p> */}
              </div>

              {/* Dynamic Report Content */}
              {renderReportContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;

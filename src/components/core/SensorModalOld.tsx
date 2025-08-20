import React, { useState, useEffect } from "react";
import {
  X,
  Activity,
  Wifi,
  WifiOff,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

interface SensorModalProps {
  sensor: any;
  department: any;
  isOpen: boolean;
  onClose: () => void;
}

type TimeFrame = "3600" | "21600" | "86400" | "604800";

const SensorModal: React.FC<SensorModalProps> = ({
  sensor,
  department,
  isOpen,
  onClose,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("3600");
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sensor) {
      fetchSensorData();
    }
  }, [isOpen, sensor, timeFrame]);

  const fetchSensorData = async () => {
    setLoading(true);
    try {
      // Validate sensor.id before making the request
      if (
        !sensor.id ||
        (typeof sensor.id !== "string" && typeof sensor.id !== "number")
      ) {
        console.error("Invalid sensor ID:", sensor.id);
        setSensorData(sensor);
        return;
      }

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://sound-level-dashboard.vision-jo.com/soundlevel/dashboard/sensor/${sensor.id}?time=${timeFrame}`,
        headers: {},
      };

      const response = await axios.request(config);
      // The API returns an array with one department containing the sensor data
      if (
        response.data &&
        response.data.length > 0 &&
        response.data[0].sensors &&
        response.data[0].sensors.length > 0
      ) {
        setSensorData(response.data[0].sensors[0]);
      } else {
        setSensorData(sensor);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      // Use existing sensor data as fallback
      setSensorData(sensor);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "text-green-600 bg-green-50 border-green-200";
      case "yellow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "red":
        return "text-red-600 bg-red-50 border-red-200";
      case "offline":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  const getSensorStatusIcon = (signal?: number) => {
    if (signal === undefined || signal === null) {
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    }

    if (signal < 20) {
      return <Wifi className="h-4 w-4 text-red-500" />;
    } else if (signal < 40) {
      return <Wifi className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Wifi className="h-4 w-4 text-green-500" />;
    }
  };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "3600":
        return "Last Hour";
      case "21600":
        return "Last 6 Hours";
      case "86400":
        return "Last 24 Hours";
      case "604800":
        return "Last Week";
      default:
        return "Last Hour";
    }
  };

  const getTimeFrameDisplayName = (frame: TimeFrame) => {
    switch (frame) {
      case "3600":
        return "1 Hour";
      case "21600":
        return "6 Hours";
      case "86400":
        return "24 Hours";
      case "604800":
        return "1 Week";
      default:
        return "1 Hour";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  //   const sampleData = (data: any[], maxPoints: number = 100) => {
  //     if (!data || data.length <= maxPoints) return data;

  //     const step = Math.ceil(data.length / maxPoints);
  //     const sampled = [];

  //     for (let i = 0; i < data.length; i += step) {
  //       sampled.push(data[i]);
  //     }

  //     return sampled;
  //   };

  const DetailedChart = ({
    data,
    color,
  }: {
    data: number[];
    color: string;
  }) => {
    if (!data || data.length === 0 || !currentData?.records) return null;

    // Use all data points without sampling
    const allRecords = currentData.records;
    const allData = allRecords.map((record: any) =>
      Math.min(parseFloat(record.avg), 200)
    );

    const minRange = 35;
    const maxRange = 200;
    const range = maxRange - minRange;
    const maxValue = Math.max(...allData);
    const minValue = Math.min(...allData);

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Noise Level Trend
          </h4>
          <div className="text-xs text-gray-500">
            Range: {minValue.toFixed(1)} - {maxValue.toFixed(1)} LV (
            {allData.length} points)
          </div>
        </div>
        <div className="flex items-end h-32 gap-1 bg-white p-3 rounded border">
          {allData.map((value: any, index: any) => (
            <div
              key={index}
              className={`flex-1 ${color} rounded-t-sm transition-all duration-300 relative group`}
              style={{
                height: `${Math.max(((value - minRange) / range) * 100, 5)}%`,
                minHeight: "3px",
              }}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div>{value.toFixed(1)} LV</div>
                {allRecords[index]?.date_time && (
                  <div className="text-xs opacity-75">
                    {formatDateTime(allRecords[index].date_time)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>
            {allRecords[0]?.date_time
              ? formatDateTime(allRecords[0].date_time)
              : "Start"}
          </span>
          <span>{getTimeFrameLabel()}</span>
          <span>
            {allRecords[allRecords.length - 1]?.date_time
              ? formatDateTime(allRecords[allRecords.length - 1].date_time)
              : "Now"}
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const currentData = sensorData || sensor;
  const chartData =
    currentData?.records?.map((record: any) => parseFloat(record.avg)) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg border-2 ${getStatusColor(
                sensor.is_active ? sensor.color : "offline"
              )}`}
            >
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{sensor.name}</h2>
              <p className="text-sm text-gray-600">{sensor.name_en}</p>
              <p className="text-xs text-gray-500">
                {department.name} - {department.name_en}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Time Frame Selection */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 self-center mr-3">
                  Time Frame:
                </span>
                {(["3600", "21600", "86400", "604800"] as TimeFrame[]).map(
                  (frame) => (
                    <button
                      key={frame}
                      onClick={() => setTimeFrame(frame)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timeFrame === frame
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {getTimeFrameDisplayName(frame)}
                    </button>
                  )
                )}
              </div>

              {/* Current Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Current Level
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {currentData.is_active
                          ? Math.round(parseFloat(currentData.avg))
                          : "--"}{" "}
                        LV
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${getStatusColor(
                        currentData.is_active ? currentData.color : "offline"
                      )}`}
                    >
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Signal Strength
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {currentData?.records?.at(-1)?.wifi_signal || "--"}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {getSensorStatusIcon(
                        currentData?.records?.at(-1)?.wifi_signal
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Status
                      </p>
                      <p
                        className={`text-lg font-semibold mt-1 ${
                          !currentData.is_active
                            ? "text-gray-600"
                            : currentData.color === "red"
                            ? "text-red-600"
                            : currentData.color === "yellow"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {!currentData.is_active
                          ? "Offline"
                          : currentData.color === "red"
                          ? "Critical"
                          : currentData.color === "yellow"
                          ? "Warning"
                          : "Safe"}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${getStatusColor(
                        currentData.is_active ? currentData.color : "offline"
                      )}`}
                    >
                      {currentData.color === "red" ? (
                        <AlertTriangle className="h-6 w-6" />
                      ) : (
                        <Activity className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Chart */}
              {chartData.length > 0 && (
                <DetailedChart
                  data={chartData}
                  color={getProgressColor(
                    currentData.is_active ? currentData.color : "offline"
                  )}
                />
              )}

              {/* Threshold Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Threshold Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">
                      Warning Level
                    </span>
                    <span className="text-lg font-bold text-yellow-900">
                      {currentData.yellow} LV
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm font-medium text-red-800">
                      Critical Level
                    </span>
                    <span className="text-lg font-bold text-red-900">
                      {currentData.red} LV
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Records Table */}
              {currentData?.records && currentData.records.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Recent Readings
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Noise Level
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Signal
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.records
                          .slice(-10)
                          .reverse()
                          .map((record: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {record.date_time
                                  ? formatDateTime(record.date_time)
                                  : `#${record.id}`}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {parseFloat(record.avg).toFixed(1)} LV
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center gap-2">
                                  {getSensorStatusIcon(record.wifi_signal)}
                                  {record.wifi_signal}%
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    parseFloat(record.avg) >= currentData.red
                                      ? "bg-red-100 text-red-800"
                                      : parseFloat(record.avg) >=
                                        currentData.yellow
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {parseFloat(record.avg) >= currentData.red
                                    ? "Critical"
                                    : parseFloat(record.avg) >=
                                      currentData.yellow
                                    ? "Warning"
                                    : "Safe"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorModal;

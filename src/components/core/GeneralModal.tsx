import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import SoundValue from "./SoundValue";

type TimeFrame = "3600" | "21600" | "86400" | "604800";

const GeneralModal = ({ departments }: any) => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [timeFrame, setTimeFrame] = useState("1h");
  const [sensorId, setSensorId] = useState<any>(null);
  const [department, setDepartment] = useState<any>(1);
  const [loading, setLoading] = useState(false);

  const toLocalISOString = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split(".")[0] + "Z"; // ISO بدون milliseconds
  };

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setHours(now.getHours() - 24);

  const [startDate, setStartDate] = useState<Date>(yesterday);
  const [endDate, setEndDate] = useState<Date>(now);

  const sensors = [
    ...new Set(departments?.flatMap((item: any) => item?.sensors)),
  ];

  useEffect(() => {
    fetchSensorData();
  }, [sensorId, timeFrame, department, startDate, endDate]);

  const fetchSensorData = async () => {
    setLoading(true);

    const defaultSensors = "1,2,3,4,5";

    const sensors = sensorId && sensorId.length > 0 ? sensorId : defaultSensors;

    const params = new URLSearchParams();

    if (startDate) {
      params.append("start", toLocalISOString(startDate));
    }
    if (endDate) {
      params.append("end", toLocalISOString(endDate));
    }

    if (department && department !== "") {
      params.append("department_ids", department);
    }

    // http://127.0.0.1:8000/soundlevel/dashboard/sensor_timeseries/?sensor_ids=1,2&start=2025-08-31T12:00:00Z&end=2025-09-01T00:00:00Z

    const url = `https://sound-level-dashboard.vision-jo.com/soundlevel/dashboard/sensor_timeseries/?sensor_ids=${sensors}${
      params.toString() ? `&${params.toString()}` : ""
    }`;

    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url,
        headers: {},
      };

      const response: any = await axios.request(config);
      if (response.data) {
        setSensorData(response.data.results);
      }
    } catch (error: any) {
      console.error("Error fetching sensor data:", error);
      toast.error(error?.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions =
    departments?.map((dept: any) => ({
      value: dept.id,
      label: dept.name || dept.name,
    })) || [];

  // const timeFrameOptions = [
  //   { value: "1m", label: "1 Minute" },
  //   { value: "1h", label: "1 Hour" },
  //   { value: "1d", label: "1 Day" },
  //   { value: "1w", label: "1 Week" },
  //   { value: "1mo", label: "1 Month" },
  //   { value: "1q", label: "1 Quarter" },
  //   { value: "1y", label: "1 Year" },
  // ];

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

  const analyzePeakAndQuietHours = (records: any[]) => {
    if (!records || records.length === 0) return null;

    // Group records by hour
    const hourlyData: { [hour: string]: number[] } = {};

    records.forEach((record) => {
      if (record.timestamp) {
        const date = new Date(record.timestamp);
        const hour = date.getHours().toString().padStart(2, "0") + ":00";
        if (!hourlyData[hour]) {
          hourlyData[hour] = [];
        }
        hourlyData[hour].push(parseFloat(record.avg));
      }
    });

    // Calculate average for each hour
    const hourlyAverages = Object.entries(hourlyData).map(([hour, values]) => ({
      hour,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length,
    }));

    if (hourlyAverages.length === 0) return null;

    // Find peak and quiet hours
    const peakHour = hourlyAverages.reduce((max, current) =>
      current.average > max.average ? current : max
    );

    const quietHour = hourlyAverages.reduce((min, current) =>
      current.average < min.average ? current : min
    );

    return {
      peakHour: {
        hour: peakHour.hour,
        average: Math.round(peakHour.average * 100) / 100,
        count: peakHour.count,
      },
      quietHour: {
        hour: quietHour.hour,
        average: Math.round(quietHour.average * 100) / 100,
        count: quietHour.count,
      },
    };
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

  const getBarColor = (value: number) => {
    if (value >= 200) {
      return "bg-red-500"; // إزعاج عالي
    } else if (value >= 100) {
      return "bg-yellow-500"; // إزعاج متوسط
    } else {
      return "bg-green-500"; // عادي
    }
  };

  const DetailedChart = ({ data }: { data: number[] }) => {
    console.log("data", data);
    if (!data || data.length === 0 || !currentData) return null;

    // كل الـ records جايين من الـ API مباشرة
    const allRecords = currentData;

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
            Range: <SoundValue lv={minValue} /> - <SoundValue lv={maxValue} /> (
            {allData.length} points)
          </div>
        </div>

        <div className="flex items-end h-32 gap-1 bg-white p-3 rounded border">
          {allData.map((value: any, index: any) => (
            <div
              key={index}
              className={`flex-1 ${getBarColor(
                value
              )} rounded-t-sm transition-all duration-300 relative group`}
              style={{
                height: `${Math.max(((value - minRange) / range) * 100, 5)}%`,
                minHeight: "3px",
              }}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div>
                  <SoundValue lv={value} />
                </div>
                {allRecords[index]?.timestamp && (
                  <div className="text-xs opacity-75">
                    {formatDateTime(allRecords[index].timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {allRecords.map((record: any, index: number) =>
            index % 4 === 0 || index === allRecords.length - 1 ? ( // كل 4 أعمدة + آخر واحد
              <span key={index} className="flex-1 text-center">
                {formatDateTime(record.timestamp)}
              </span>
            ) : (
              <span key={index} className="flex-1" />
            )
          )}
        </div>
      </div>
    );
  };

  const currentData = sensorData;
  const chartData =
    currentData?.map((record: any) => parseFloat(record.avg)) || [];

  // const peakQuietAnalysis = analyzePeakAndQuietHours(currentData || []);

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => date && setStartDate(date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="chakra-input w-full border rounded-md px-3 py-2"
                maxDate={endDate ? new Date(endDate) : undefined}
              />
            </div>

            {/* End Date */}
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="chakra-input w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Department */}
            <div className="w-full">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department
              </label>
              <Select
                id="department"
                options={departmentOptions}
                value={
                  department
                    ? departmentOptions.find((d: any) => d.value === department)
                    : null
                }
                onChange={(selectedOption: any) =>
                  setDepartment(selectedOption ? selectedOption.value : null)
                }
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Sensors */}
            <div className="w-full">
              <label
                htmlFor="sensor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sensors
              </label>
              {!sensors ? (
                <p className="text-sm text-gray-500">Loading sensors...</p>
              ) : (
                <Select
                  id="sensor"
                  placeholder="All sensors selected..."
                  options={(sensors || []).map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  isMulti
                  value={(sensorId || []).map((id: any) => {
                    const sensor: any = sensors?.find((s: any) => s.id === id);
                    return { value: id, label: sensor?.name || `Sensor ${id}` };
                  })}
                  onChange={(selectedOptions) =>
                    setSensorId(
                      selectedOptions
                        ? selectedOptions.map((i: any) => i.value)
                        : []
                    )
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    valueContainer: (base) => ({
                      ...base,
                      display: "flex",
                      flexWrap: "nowrap", // 👈 خلى القيم جنب بعض
                      overflowX: "auto", // 👈 يخلي فيه scroll افقي
                      maxWidth: "100%",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      flex: "0 0 auto", // 👈 يخلي كل value تاخد حجمها الطبيعي
                    }),
                  }}
                />
              )}
            </div>
          </div>

          <DetailedChart data={chartData} />

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
                  {100} LV
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm font-medium text-red-800">
                  Critical Level
                </span>
                <span className="text-lg font-bold text-red-900">{200} LV</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralModal;

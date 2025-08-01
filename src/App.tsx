import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Volume2,
  Building2,
  Bell,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import LoginForm from "./pages/Login";
import axios from "axios";

// interface Sensor {
//   id: string;
//   name: string;
//   location: string;
//   locationAr: string;
//   currentNoise: number;
//   status: "safe" | "warning" | "critical" | "offline";
//   batteryLevel: number;
//   lastUpdate: string;
//   hourlyData: number[];
// }

// interface Department {
//   id: string;
//   name: string;
//   nameAr: string;
//   currentNoise: number;
//   threshold: number;
//   status: "safe" | "warning" | "critical";
//   hourlyData: number[];
//   dailyData: number[];
//   tenMinData: number[];
//   sixHourData: number[];
//   sensors: Sensor[];
// }

interface Alert {
  id: string;
  department: string;
  departmentAr: string;
  sensor?: string;
  level: number;
  timestamp: string;
  severity: "warning" | "critical";
}

interface User {
  username: string;
  role: "admin" | "doctor" | "nurse";
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [departments, setDepartments] = useState([]);

  // const data = fetch(
  //   "https://sound-level-django-xkm4b.ondigitalocean.app/soundlevel/dashboard/"
  // );

  // console.log("data", data);

  // const [departments, setDepartments] = useState<Department[]>([
  //   {
  //     id: "icu",
  //     name: "ICU",
  //     nameAr: "العناية المركزة",
  //     currentNoise: 45,
  //     threshold: 40,
  //     status: "warning",
  //     hourlyData: [38, 42, 45, 48, 44, 46, 45, 43],
  //     dailyData: [42, 45, 38, 46, 44, 48, 45],
  //     tenMinData: [44, 45, 46, 45, 44, 45, 46, 47, 45, 44, 46, 45],
  //     sixHourData: [40, 42, 44, 46],
  //     sensors: [
  //       {
  //         id: "icu-s1",
  //         name: "Sensor 1",
  //         location: "Patient Room A",
  //         locationAr: "غرفة المريض أ",
  //         currentNoise: 42,
  //         status: "warning",
  //         batteryLevel: 85,
  //         lastUpdate: "14:32",
  //         hourlyData: [38, 40, 42, 44, 41, 43, 42, 40],
  //       },
  //       {
  //         id: "icu-s2",
  //         name: "Sensor 2",
  //         location: "Patient Room B",
  //         locationAr: "غرفة المريض ب",
  //         currentNoise: 38,
  //         status: "safe",
  //         batteryLevel: 92,
  //         lastUpdate: "14:32",
  //         hourlyData: [35, 37, 38, 40, 36, 39, 38, 36],
  //       },
  //       {
  //         id: "icu-s3",
  //         name: "Sensor 3",
  //         location: "Nurses Station",
  //         locationAr: "محطة التمريض",
  //         currentNoise: 48,
  //         status: "critical",
  //         batteryLevel: 78,
  //         lastUpdate: "14:32",
  //         hourlyData: [45, 47, 48, 50, 46, 49, 48, 46],
  //       },
  //       {
  //         id: "icu-s4",
  //         name: "Sensor 4",
  //         location: "Equipment Area",
  //         locationAr: "منطقة المعدات",
  //         currentNoise: 52,
  //         status: "critical",
  //         batteryLevel: 65,
  //         lastUpdate: "14:32",
  //         hourlyData: [48, 50, 52, 54, 50, 53, 52, 49],
  //       },
  //       {
  //         id: "icu-s5",
  //         name: "Sensor 5",
  //         location: "Corridor",
  //         locationAr: "الممر",
  //         currentNoise: 35,
  //         status: "safe",
  //         batteryLevel: 88,
  //         lastUpdate: "14:32",
  //         hourlyData: [32, 34, 35, 37, 33, 36, 35, 33],
  //       },
  //       {
  //         id: "icu-s6",
  //         name: "Sensor 6",
  //         location: "Family Area",
  //         locationAr: "منطقة الأسرة",
  //         currentNoise: 40,
  //         status: "safe",
  //         batteryLevel: 45,
  //         lastUpdate: "14:31",
  //         hourlyData: [37, 39, 40, 42, 38, 41, 40, 38],
  //       },
  //       {
  //         id: "icu-s7",
  //         name: "Sensor 7",
  //         location: "Storage Room",
  //         locationAr: "غرفة التخزين",
  //         currentNoise: 0,
  //         status: "offline",
  //         batteryLevel: 12,
  //         lastUpdate: "13:45",
  //         hourlyData: [28, 30, 0, 0, 0, 0, 0, 0],
  //       },
  //     ],
  //   },
  //   {
  //     id: "emergency",
  //     name: "Emergency",
  //     nameAr: "الطوارئ",
  //     currentNoise: 65,
  //     threshold: 50,
  //     status: "critical",
  //     hourlyData: [55, 62, 68, 65, 70, 64, 65, 58],
  //     dailyData: [58, 62, 55, 68, 65, 70, 65],
  //     tenMinData: [63, 65, 67, 66, 64, 65, 68, 69, 65, 64, 66, 65],
  //     sixHourData: [58, 62, 66, 65],
  //     sensors: [
  //       {
  //         id: "em-s1",
  //         name: "Sensor 1",
  //         location: "Triage Area",
  //         locationAr: "منطقة الفرز",
  //         currentNoise: 68,
  //         status: "critical",
  //         batteryLevel: 90,
  //         lastUpdate: "14:32",
  //         hourlyData: [62, 65, 68, 70, 66, 69, 68, 64],
  //       },
  //       {
  //         id: "em-s2",
  //         name: "Sensor 2",
  //         location: "Treatment Room 1",
  //         locationAr: "غرفة العلاج 1",
  //         currentNoise: 58,
  //         status: "critical",
  //         batteryLevel: 82,
  //         lastUpdate: "14:32",
  //         hourlyData: [52, 55, 58, 60, 56, 59, 58, 54],
  //       },
  //       {
  //         id: "em-s3",
  //         name: "Sensor 3",
  //         location: "Treatment Room 2",
  //         locationAr: "غرفة العلاج 2",
  //         currentNoise: 72,
  //         status: "critical",
  //         batteryLevel: 76,
  //         lastUpdate: "14:32",
  //         hourlyData: [68, 70, 72, 74, 70, 73, 72, 69],
  //       },
  //       {
  //         id: "em-s4",
  //         name: "Sensor 4",
  //         location: "Waiting Area",
  //         locationAr: "منطقة الانتظار",
  //         currentNoise: 62,
  //         status: "critical",
  //         batteryLevel: 88,
  //         lastUpdate: "14:32",
  //         hourlyData: [58, 60, 62, 64, 60, 63, 62, 59],
  //       },
  //       {
  //         id: "em-s5",
  //         name: "Sensor 5",
  //         location: "Ambulance Bay",
  //         locationAr: "خليج الإسعاف",
  //         currentNoise: 75,
  //         status: "critical",
  //         batteryLevel: 55,
  //         lastUpdate: "14:32",
  //         hourlyData: [70, 72, 75, 78, 74, 77, 75, 71],
  //       },
  //       {
  //         id: "em-s6",
  //         name: "Sensor 6",
  //         location: "Staff Area",
  //         locationAr: "منطقة الموظفين",
  //         currentNoise: 48,
  //         status: "safe",
  //         batteryLevel: 93,
  //         lastUpdate: "14:32",
  //         hourlyData: [44, 46, 48, 50, 46, 49, 48, 45],
  //       },
  //       {
  //         id: "em-s7",
  //         name: "Sensor 7",
  //         location: "Supply Room",
  //         locationAr: "غرفة الإمدادات",
  //         currentNoise: 42,
  //         status: "safe",
  //         batteryLevel: 67,
  //         lastUpdate: "14:32",
  //         hourlyData: [38, 40, 42, 44, 40, 43, 42, 39],
  //       },
  //     ],
  //   },
  //   {
  //     id: "surgery",
  //     name: "Surgery",
  //     nameAr: "العمليات",
  //     currentNoise: 35,
  //     threshold: 40,
  //     status: "safe",
  //     hourlyData: [32, 35, 38, 35, 33, 36, 35, 34],
  //     dailyData: [34, 35, 32, 38, 35, 36, 35],
  //     tenMinData: [34, 35, 36, 35, 34, 35, 36, 37, 35, 34, 36, 35],
  //     sixHourData: [32, 34, 36, 35],
  //     sensors: [
  //       {
  //         id: "sur-s1",
  //         name: "Sensor 1",
  //         location: "OR 1",
  //         locationAr: "غرفة العمليات 1",
  //         currentNoise: 32,
  //         status: "safe",
  //         batteryLevel: 95,
  //         lastUpdate: "14:32",
  //         hourlyData: [28, 30, 32, 34, 30, 33, 32, 29],
  //       },
  //       {
  //         id: "sur-s2",
  //         name: "Sensor 2",
  //         location: "OR 2",
  //         locationAr: "غرفة العمليات 2",
  //         currentNoise: 38,
  //         status: "safe",
  //         batteryLevel: 87,
  //         lastUpdate: "14:32",
  //         hourlyData: [34, 36, 38, 40, 36, 39, 38, 35],
  //       },
  //       {
  //         id: "sur-s3",
  //         name: "Sensor 3",
  //         location: "OR 3",
  //         locationAr: "غرفة العمليات 3",
  //         currentNoise: 35,
  //         status: "safe",
  //         batteryLevel: 91,
  //         lastUpdate: "14:32",
  //         hourlyData: [31, 33, 35, 37, 33, 36, 35, 32],
  //       },
  //       {
  //         id: "sur-s4",
  //         name: "Sensor 4",
  //         location: "Prep Room",
  //         locationAr: "غرفة التحضير",
  //         currentNoise: 40,
  //         status: "safe",
  //         batteryLevel: 73,
  //         lastUpdate: "14:32",
  //         hourlyData: [36, 38, 40, 42, 38, 41, 40, 37],
  //       },
  //       {
  //         id: "sur-s5",
  //         name: "Sensor 5",
  //         location: "Recovery",
  //         locationAr: "الإنعاش",
  //         currentNoise: 28,
  //         status: "safe",
  //         batteryLevel: 84,
  //         lastUpdate: "14:32",
  //         hourlyData: [24, 26, 28, 30, 26, 29, 28, 25],
  //       },
  //       {
  //         id: "sur-s6",
  //         name: "Sensor 6",
  //         location: "Scrub Area",
  //         locationAr: "منطقة التعقيم",
  //         currentNoise: 36,
  //         status: "safe",
  //         batteryLevel: 79,
  //         lastUpdate: "14:32",
  //         hourlyData: [32, 34, 36, 38, 34, 37, 36, 33],
  //       },
  //       {
  //         id: "sur-s7",
  //         name: "Sensor 7",
  //         location: "Anesthesia Room",
  //         locationAr: "غرفة التخدير",
  //         currentNoise: 33,
  //         status: "safe",
  //         batteryLevel: 88,
  //         lastUpdate: "14:32",
  //         hourlyData: [29, 31, 33, 35, 31, 34, 33, 30],
  //       },
  //     ],
  //   },
  //   {
  //     id: "pediatrics",
  //     name: "Pediatrics",
  //     nameAr: "الأطفال",
  //     currentNoise: 48,
  //     threshold: 35,
  //     status: "critical",
  //     hourlyData: [42, 45, 48, 52, 46, 49, 48, 44],
  //     dailyData: [44, 45, 42, 52, 48, 49, 48],
  //     tenMinData: [46, 47, 48, 49, 47, 48, 50, 51, 48, 47, 49, 48],
  //     sixHourData: [44, 46, 50, 48],
  //     sensors: [
  //       {
  //         id: "ped-s1",
  //         name: "Sensor 1",
  //         location: "Infant Ward",
  //         locationAr: "جناح الرضع",
  //         currentNoise: 52,
  //         status: "critical",
  //         batteryLevel: 89,
  //         lastUpdate: "14:32",
  //         hourlyData: [46, 48, 52, 54, 50, 53, 52, 48],
  //       },
  //       {
  //         id: "ped-s2",
  //         name: "Sensor 2",
  //         location: "Toddler Room",
  //         locationAr: "غرفة الأطفال الصغار",
  //         currentNoise: 58,
  //         status: "critical",
  //         batteryLevel: 76,
  //         lastUpdate: "14:32",
  //         hourlyData: [52, 55, 58, 60, 56, 59, 58, 54],
  //       },
  //       {
  //         id: "ped-s3",
  //         name: "Sensor 3",
  //         location: "Play Area",
  //         locationAr: "منطقة اللعب",
  //         currentNoise: 45,
  //         status: "critical",
  //         batteryLevel: 92,
  //         lastUpdate: "14:32",
  //         hourlyData: [39, 42, 45, 48, 44, 47, 45, 41],
  //       },
  //       {
  //         id: "ped-s4",
  //         name: "Sensor 4",
  //         location: "Family Room",
  //         locationAr: "غرفة الأسرة",
  //         currentNoise: 42,
  //         status: "critical",
  //         batteryLevel: 68,
  //         lastUpdate: "14:32",
  //         hourlyData: [36, 39, 42, 45, 41, 44, 42, 38],
  //       },
  //       {
  //         id: "ped-s5",
  //         name: "Sensor 5",
  //         location: "Nurses Station",
  //         locationAr: "محطة التمريض",
  //         currentNoise: 48,
  //         status: "critical",
  //         batteryLevel: 85,
  //         lastUpdate: "14:32",
  //         hourlyData: [42, 45, 48, 51, 47, 50, 48, 44],
  //       },
  //       {
  //         id: "ped-s6",
  //         name: "Sensor 6",
  //         location: "Treatment Room",
  //         locationAr: "غرفة العلاج",
  //         currentNoise: 38,
  //         status: "critical",
  //         batteryLevel: 71,
  //         lastUpdate: "14:32",
  //         hourlyData: [32, 35, 38, 41, 37, 40, 38, 34],
  //       },
  //       {
  //         id: "ped-s7",
  //         name: "Sensor 7",
  //         location: "Isolation Room",
  //         locationAr: "غرفة العزل",
  //         currentNoise: 35,
  //         status: "safe",
  //         batteryLevel: 94,
  //         lastUpdate: "14:32",
  //         hourlyData: [29, 32, 35, 38, 34, 37, 35, 31],
  //       },
  //     ],
  //   },
  //   {
  //     id: "general",
  //     name: "General Ward",
  //     nameAr: "الأجنحة العامة",
  //     currentNoise: 32,
  //     threshold: 40,
  //     status: "safe",
  //     hourlyData: [28, 32, 35, 32, 30, 33, 32, 29],
  //     dailyData: [30, 32, 28, 35, 32, 33, 32],
  //     tenMinData: [30, 31, 32, 33, 31, 32, 34, 35, 32, 31, 33, 32],
  //     sixHourData: [30, 31, 34, 32],
  //     sensors: [
  //       {
  //         id: "gen-s1",
  //         name: "Sensor 1",
  //         location: "Ward A",
  //         locationAr: "الجناح أ",
  //         currentNoise: 35,
  //         status: "safe",
  //         batteryLevel: 88,
  //         lastUpdate: "14:32",
  //         hourlyData: [31, 33, 35, 37, 33, 36, 35, 32],
  //       },
  //       {
  //         id: "gen-s2",
  //         name: "Sensor 2",
  //         location: "Ward B",
  //         locationAr: "الجناح ب",
  //         currentNoise: 30,
  //         status: "safe",
  //         batteryLevel: 92,
  //         lastUpdate: "14:32",
  //         hourlyData: [26, 28, 30, 32, 28, 31, 30, 27],
  //       },
  //       {
  //         id: "gen-s3",
  //         name: "Sensor 3",
  //         location: "Ward C",
  //         locationAr: "الجناح ج",
  //         currentNoise: 28,
  //         status: "safe",
  //         batteryLevel: 75,
  //         lastUpdate: "14:32",
  //         hourlyData: [24, 26, 28, 30, 26, 29, 28, 25],
  //       },
  //       {
  //         id: "gen-s4",
  //         name: "Sensor 4",
  //         location: "Common Area",
  //         locationAr: "المنطقة المشتركة",
  //         currentNoise: 38,
  //         status: "safe",
  //         batteryLevel: 83,
  //         lastUpdate: "14:32",
  //         hourlyData: [34, 36, 38, 40, 36, 39, 38, 35],
  //       },
  //       {
  //         id: "gen-s5",
  //         name: "Sensor 5",
  //         location: "Nurses Station",
  //         locationAr: "محطة التمريض",
  //         currentNoise: 32,
  //         status: "safe",
  //         batteryLevel: 90,
  //         lastUpdate: "14:32",
  //         hourlyData: [28, 30, 32, 34, 30, 33, 32, 29],
  //       },
  //       {
  //         id: "gen-s6",
  //         name: "Sensor 6",
  //         location: "Visitor Area",
  //         locationAr: "منطقة الزوار",
  //         currentNoise: 36,
  //         status: "safe",
  //         batteryLevel: 67,
  //         lastUpdate: "14:32",
  //         hourlyData: [32, 34, 36, 38, 34, 37, 36, 33],
  //       },
  //       {
  //         id: "gen-s7",
  //         name: "Sensor 7",
  //         location: "Medication Room",
  //         locationAr: "غرفة الأدوية",
  //         currentNoise: 25,
  //         status: "safe",
  //         batteryLevel: 95,
  //         lastUpdate: "14:32",
  //         hourlyData: [21, 23, 25, 27, 23, 26, 25, 22],
  //       },
  //     ],
  //   },
  //   {
  //     id: "radiology",
  //     name: "Radiology",
  //     nameAr: "الأشعة",
  //     currentNoise: 42,
  //     threshold: 45,
  //     status: "safe",
  //     hourlyData: [38, 42, 44, 42, 40, 43, 42, 39],
  //     dailyData: [40, 42, 38, 44, 42, 43, 42],
  //     tenMinData: [40, 41, 42, 43, 41, 42, 44, 45, 42, 41, 43, 42],
  //     sixHourData: [40, 41, 44, 42],
  //     sensors: [
  //       {
  //         id: "rad-s1",
  //         name: "Sensor 1",
  //         location: "X-Ray Room 1",
  //         locationAr: "غرفة الأشعة السينية 1",
  //         currentNoise: 45,
  //         status: "safe",
  //         batteryLevel: 86,
  //         lastUpdate: "14:32",
  //         hourlyData: [41, 43, 45, 47, 43, 46, 45, 42],
  //       },
  //       {
  //         id: "rad-s2",
  //         name: "Sensor 2",
  //         location: "X-Ray Room 2",
  //         locationAr: "غرفة الأشعة السينية 2",
  //         currentNoise: 48,
  //         status: "critical",
  //         batteryLevel: 79,
  //         lastUpdate: "14:32",
  //         hourlyData: [44, 46, 48, 50, 46, 49, 48, 45],
  //       },
  //       {
  //         id: "rad-s3",
  //         name: "Sensor 3",
  //         location: "CT Scan Room",
  //         locationAr: "غرفة الأشعة المقطعية",
  //         currentNoise: 52,
  //         status: "critical",
  //         batteryLevel: 91,
  //         lastUpdate: "14:32",
  //         hourlyData: [48, 50, 52, 54, 50, 53, 52, 49],
  //       },
  //       {
  //         id: "rad-s4",
  //         name: "Sensor 4",
  //         location: "MRI Room",
  //         locationAr: "غرفة الرنين المغناطيسي",
  //         currentNoise: 38,
  //         status: "safe",
  //         batteryLevel: 74,
  //         lastUpdate: "14:32",
  //         hourlyData: [34, 36, 38, 40, 36, 39, 38, 35],
  //       },
  //       {
  //         id: "rad-s5",
  //         name: "Sensor 5",
  //         location: "Waiting Area",
  //         locationAr: "منطقة الانتظار",
  //         currentNoise: 35,
  //         status: "safe",
  //         batteryLevel: 88,
  //         lastUpdate: "14:32",
  //         hourlyData: [31, 33, 35, 37, 33, 36, 35, 32],
  //       },
  //       {
  //         id: "rad-s6",
  //         name: "Sensor 6",
  //         location: "Control Room",
  //         locationAr: "غرفة التحكم",
  //         currentNoise: 40,
  //         status: "safe",
  //         batteryLevel: 82,
  //         lastUpdate: "14:32",
  //         hourlyData: [36, 38, 40, 42, 38, 41, 40, 37],
  //       },
  //       {
  //         id: "rad-s7",
  //         name: "Sensor 7",
  //         location: "Equipment Storage",
  //         locationAr: "مخزن المعدات",
  //         currentNoise: 32,
  //         status: "safe",
  //         batteryLevel: 65,
  //         lastUpdate: "14:32",
  //         hourlyData: [28, 30, 32, 34, 30, 33, 32, 29],
  //       },
  //     ],
  //   },
  // ]);

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      department: "Emergency",
      departmentAr: "الطوارئ",
      sensor: "Ambulance Bay",
      level: 75,
      timestamp: "14:30",
      severity: "critical",
    },
    {
      id: "2",
      department: "Pediatrics",
      departmentAr: "الأطفال",
      sensor: "Toddler Room",
      level: 58,
      timestamp: "14:15",
      severity: "critical",
    },
    {
      id: "3",
      department: "ICU",
      departmentAr: "العناية المركزة",
      sensor: "Equipment Area",
      level: 52,
      timestamp: "14:00",
      severity: "critical",
    },
  ]);

  const [currentTime, _] = useState(new Date());
  const [timeFrame] = useState<"10m" | "1h" | "6h" | "1d">("1h");
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );

  // Demo users for authentication
  const demoUsers = {
    admin: { password: "admin123", role: "admin" as const },
    doctor: { password: "doctor123", role: "doctor" as const },
    nurse: { password: "nurse123", role: "nurse" as const },
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setLoginError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = demoUsers[username as keyof typeof demoUsers];

    if (user && user.password === password) {
      setUser({ username, role: user.role });
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setLoginError("");
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 5000);

  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    const fetchData = () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://sound-level-django-xkm4b.ondigitalocean.app/soundlevel/dashboard/",
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          console.log("Fetched data:", response.data);
          setDepartments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData(); // أول مرة

    const interval = setInterval(() => {
      fetchData(); // كل 5 ثواني
    }, 5000);

    return () => clearInterval(interval); // تنظيف لما يتشال الكمبوننت
  }, []);

  const toggleDepartment = (deptId: string) => {
    setExpandedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "offline":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        error={loginError}
        isLoading={isLoading}
      />
    );
  }

  const getSensorStatusIcon = (status: string) => {
    switch (status) {
      case "offline":
        return <WifiOff className="h-3 w-3 text-gray-500" />;
      default:
        return <Wifi className="h-3 w-3 text-green-500" />;
    }
  };

  // const getTimeFrameData = (dept: Department) => {
  //   switch (timeFrame) {
  //     case "10m":
  //       return dept.tenMinData;
  //     case "1h":
  //       return dept.hourlyData;
  //     case "6h":
  //       return dept.sixHourData;
  //     case "1d":
  //       return dept.dailyData;
  //     default:
  //       return dept.hourlyData;
  //   }
  // };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "10m":
        return "Last 2 Hours (10min intervals)";
      case "1h":
        return "Last 8 Hours (hourly)";
      case "6h":
        return "Last 24 Hours (6hr intervals)";
      case "1d":
        return "Last 7 Days (daily)";
      default:
        return "Hourly View";
    }
  };

  const criticalDepartments = departments.filter(
    (d: any) => d.status === "critical"
  ).length;
  // const warningDepartments = departments.filter(
  //   (d) => d.status === "warning"
  // ).length;
  const avgNoise = Math.round(
    departments.reduce((sum: any, d: any) => sum + d.currentNoise, 0) /
      departments.length
  );
  const totalSensors = departments.reduce(
    (sum: any, d: any) => sum + d.sensors.length,
    0
  );
  const offlineSensors = departments.reduce(
    (sum: any, d: any) =>
      sum + d.sensors.filter((s: any) => s.status === "offline").length,
    0
  );

  const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    console.log("datasss", data);

    return (
      <div className="flex items-end h-6 sm:h-8 gap-0.5 sm:gap-1">
        {data?.map((value, index) => (
          <div
            key={index}
            className={`w-1.5 sm:w-2 ${color} rounded-t-sm transition-all duration-300`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: "3px",
            }}
          />
        ))}
      </div>
    );
  };

  console.log(departments, "departments");

  const getSensoresStatus = (sensor: any) => {
    console.log("sensor-------", sensor);

    if (!sensor.records || sensor.records.length === 0) return 0;

    const total = sensor.records.reduce((sum: any, record: any) => {
      return sum + parseFloat(record.avg);
    }, 0);

    const average = total / sensor.records.length;
    console.log("getSensoresAvg", average);
    return average;
  };

  const getNoiseLevel = (house: any, red: any, yellow: any) => {
    for (const sensor of house.sensors) {
      if (!sensor.records || sensor.records.length === 0) continue;

      const total = sensor.records.reduce((sum: number, record: any) => {
        return sum + parseFloat(record.avg);
      }, 0);

      const average = total / sensor.records.length;

      console.log(`Sensor ${sensor.name} avg: ${average}`);

      // getSensoresStatus(sensor) >= sensor?.yellow &&
      // getSensoresStatus(sensor) < sensor?.red
      //   ? "warning"
      //   : getSensoresStatus(sensor) >= sensor?.red
      //   ? "critical"
      //   : "safe";

      console.log("average average", average);

      if (average >= yellow && average <= red) return "warning";
      if (average >= red) return "critical";
    }

    return "safe";
  };

  const getNoiseAverageDb = (house: any) => {
    let totalDb = 0;
    let totalRecords = 0;

    for (const sensor of house.sensors) {
      if (!sensor.records || sensor.records.length === 0) continue;

      for (const record of sensor.records) {
        totalDb += parseFloat(record.avg);
        totalRecords++;
      }
    }

    if (totalRecords === 0) return 0;

    const averageDb = totalDb / totalRecords;
    return averageDb;
  };

  const departmentStatus = (department: any, red: any, yellow: any) => {
    // departments.map((house: any) => ({
    //   name: house.name,
    //   noiseLevel: getNoiseLevel(house),
    // }));

    // console.log("departmentStatus", getNoiseLevel(department, red, yellow));
    return {
      name: department.name,
      noiseLevel: getNoiseLevel(department, red, yellow),
    };
  };

  const getSensorAvgValues = (house: any, sensorId: any) => {
    const sensor = house.sensors.find((s: any) => s.id === sensorId);

    if (!sensor || !sensor.records || sensor.records.length === 0) {
      return []; // مفيش بيانات نرجع array فاضية
    }

    return sensor.records.map((record: any) => parseFloat(record.avg));
  };

  const getAllSensorsAvgValues = (house: any) => {
    return house.sensors.map((sensor: any) => {
      const values = sensor.records.map((record: any) =>
        parseFloat(record.avg)
      );
      const sum = values.reduce((acc: any, val: any) => acc + val, 0);
      const avg = values.length > 0 ? sum / values.length : 0;
      return Math.round(avg * 100) / 100; // تقريبه إلى رقم عشريين
    });
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
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Hospital Noise Monitor
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
                  نظام مراقبة الضوضاء في المستشفى
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Time display */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Current Time
                  </div>
                  <div className="font-mono text-sm sm:text-lg font-semibold text-gray-800">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="h-8 sm:h-12 w-px bg-gray-200" />
              </div>

              {/* View mode buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-2">
                <div className="text-xs text-gray-500 hidden sm:block self-center mr-2">
                  Time Frame:
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTimeFrame("10m")}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      timeFrame === "10m"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    10m
                  </button>
                  <button
                    onClick={() => setTimeFrame("1h")}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      timeFrame === "1h"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    1h
                  </button>
                  <button
                    onClick={() => setTimeFrame("6h")}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      timeFrame === "6h"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    6h
                  </button>
                  <button
                    onClick={() => setTimeFrame("1d")}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      timeFrame === "1d"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    1d
                  </button>
                </div>
              </div> */}

              {/* Mobile User Info */}
              <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-800">
                    {user?.username}
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Departments
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {departments.length}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                  إجمالي الأقسام
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Sensors
                </p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">
                  {totalSensors}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                  إجمالي أجهزة الاستشعار
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Critical Alerts
                </p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">
                  {criticalDepartments}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                  تنبيهات حرجة
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Offline Sensors
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-600 mt-0.5 sm:mt-1">
                  {offlineSensors}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                  أجهزة غير متصلة
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <WifiOff className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Average Noise
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {avgNoise} dB
                </p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                  متوسط الضوضاء
                </p>
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
              <span className="text-sm font-normal text-gray-500">
                التنبيهات الأخيرة
              </span>
            </h2>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === "critical"
                      ? "bg-red-50 border-red-400"
                      : "bg-yellow-50 border-yellow-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-base text-gray-800">
                        {alert.department}
                      </p>
                      <p className="text-sm text-gray-600">
                        {alert.departmentAr}
                      </p>
                      {alert.sensor && (
                        <p className="text-xs text-gray-500">{alert.sensor}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base text-gray-900">
                        {alert.level} dB
                      </p>
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
                  <span className="text-xs sm:text-sm font-normal text-gray-500 mr-2 hidden sm:inline">
                    مستويات الضوضاء
                  </span>
                </h2>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {getTimeFrameLabel()}
                </div>
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
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                    Offline
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {departments?.map((dept: any) => (
                  <div
                    key={dept.id}
                    className={`rounded-lg border-2 transition-all duration-300 ${getStatusColor(
                      departmentStatus(dept, dept.red, dept.yellow).noiseLevel
                    )}`}
                  >
                    {/* Department Header */}
                    <div
                      className="p-3 sm:p-4 cursor-pointer"
                      onClick={() => toggleDepartment(dept.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                              {dept.name}
                              {expandedDepartments.has(dept.id) ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {dept.name_en}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="text-left sm:text-right">
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                              {Math.round(getNoiseAverageDb(dept))} dB
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              Limit: {dept.threshold} dB
                            </div> */}
                          </div>
                          <div className="w-16 sm:w-24">
                            <MiniChart
                              data={getAllSensorsAvgValues(dept)}
                              color={getProgressColor(
                                departmentStatus(dept, dept.red, dept.yellow)
                                  .noiseLevel
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div className="mt-2 sm:mt-3">
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                          <span>Noise Level</span>
                          <span>
                            {Math.round((getNoiseAverageDb(dept) / 80) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${getProgressColor(
                              dept.status
                            )}`}
                            style={{
                              width: `${Math.min(
                                (getNoiseAverageDb(dept) / 80) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div> */}
                    </div>

                    {/* Expanded Sensor Details */}
                    {expandedDepartments.has(dept.id) && (
                      <div className="border-t border-gray-200 bg-gray-50/50 p-3 sm:p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Individual Sensors ({dept.sensors.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {dept.sensors.map((sensor: any) => (
                            <div
                              key={sensor.id}
                              className={`p-3 rounded-lg border ${getStatusColor(
                                sensor.is_active
                                  ? getSensoresStatus(sensor) >=
                                      sensor?.yellow &&
                                    getSensoresStatus(sensor) < sensor?.red
                                    ? "warning"
                                    : getSensoresStatus(sensor) >= sensor?.red
                                    ? "critical"
                                    : "safe"
                                  : "offline"
                              )}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="text-sm font-medium text-gray-800">
                                      {sensor.name}
                                    </h5>
                                    {}
                                    {getSensorStatusIcon(sensor.status)}
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {sensor.name_en}
                                  </p>
                                  {/* <p className="text-xs text-gray-500">
                                    {sensor.locationAr}
                                    asdsad
                                  </p> */}
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900">
                                    {!sensor.is_active
                                      ? "--"
                                      : Math.round(
                                          getSensoresStatus(sensor)
                                        )}{" "}
                                    dB
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {sensor.lastUpdate}
                                  </div>
                                </div>
                              </div>
                              {/* 
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                <span>Battery</span>
                                <span
                                  className={`font-medium ${getBatteryColor(
                                    sensor.batteryLevel
                                  )}`}
                                >
                                  {sensor.batteryLevel}%
                                </span>
                              </div> */}

                              {/* <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full transition-all duration-500 ${getProgressColor(
                                    sensor.status
                                  )}`}
                                  style={{
                                    width:
                                      sensor.status === "offline"
                                        ? "0%"
                                        : `${Math.min(
                                            (sensor.currentNoise / 80) * 100,
                                            100
                                          )}%`,
                                  }}
                                />
                              </div> */}

                              <div className="mt-2">
                                <MiniChart
                                  data={getSensorAvgValues(dept, sensor.id)}
                                  color={getProgressColor(
                                    getSensoresStatus(sensor) >=
                                      sensor?.yellow &&
                                      getSensoresStatus(sensor) < sensor?.red
                                      ? "warning"
                                      : getSensoresStatus(sensor) >= sensor?.red
                                      ? "critical"
                                      : "safe"
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                <span className="text-xs sm:text-sm font-normal text-gray-500 hidden sm:inline">
                  التنبيهات الأخيرة
                </span>
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                      alert.severity === "critical"
                        ? "bg-red-50 border-red-400"
                        : "bg-yellow-50 border-yellow-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-800">
                          {alert.department}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {alert.departmentAr}
                        </p>
                        {alert.sensor && (
                          <p className="text-xs text-gray-500">
                            {alert.sensor}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm sm:text-base text-gray-900">
                          {alert.level} dB
                        </p>
                        <p className="text-xs text-gray-500">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Status Overview */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Sensor Status
                <span className="text-xs sm:text-sm font-normal text-gray-500 hidden sm:inline">
                  حالة أجهزة الاستشعار
                </span>
              </h2>

              <div className="space-y-3">
                {departments.map((dept: any) => {
                  const onlineSensors = dept.sensors.filter(
                    (s: any) => s.is_active
                  ).length;
                  const criticalSensors = dept.sensors.filter(
                    (s: any) => getSensoresStatus(s) >= s.red && "critical"
                  ).length;

                  //  getSensoresStatus(sensor) >= sensor?.yellow &&
                  //  getSensoresStatus(sensor) < sensor?.red
                  //    ? "warning"
                  //    : getSensoresStatus(sensor) >= sensor?.red
                  //    ? "critical"
                  //    : "safe";
                  return (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {dept.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {onlineSensors}/{dept.sensors.length} online
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {criticalSensors > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            {criticalSensors} critical
                          </span>
                        )}
                        <div className="flex gap-1">
                          {dept.sensors
                            .slice(0, 7)
                            .map((sensor: any, idx: any) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                  !sensor.is_active
                                    ? "bg-gray-400"
                                    : getSensoresStatus(sensor) >= sensor.red &&
                                      "critical"
                                    ? "bg-red-500"
                                    : getSensoresStatus(sensor) >=
                                        sensor.yellow &&
                                      getSensoresStatus(sensor) < sensor.red &&
                                      "warning"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                title={`${sensor.name}: ${
                                  getSensoresStatus(sensor) >= sensor.red
                                    ? "Critical"
                                    : "Safe"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Quick Actions
              </h2>

              <div className="space-y-2 sm:space-y-3">
                <button className="w-full p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Generate Report
                </button>
                <button className="w-full p-2 sm:p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Export Sensor Data
                </button>
                <button className="w-full p-2 sm:p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Configure Alerts
                </button>
                <button className="w-full p-2 sm:p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm sm:text-base font-medium transition-colors">
                  Sensor Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Sensor Status Overview */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Sensor Status
            <span className="text-sm font-normal text-gray-500">
              حالة أجهزة الاستشعار
            </span>
          </h2>

          <div className="space-y-3">
            {departments.map((dept: any) => {
              const onlineSensors = dept.sensors.filter(
                (s: any) => s.is_active
              ).length;
              const criticalSensors = dept.sensors.filter(
                (s: any) => getSensoresStatus(s) >= s.red && "critical"
              ).length;

              return (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {dept.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {onlineSensors}/{dept.sensors.length} online
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {criticalSensors > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {criticalSensors} critical
                      </span>
                    )}
                    <div className="flex gap-1">
                      {dept.sensors.slice(0, 7).map((sensor: any, idx: any) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            !sensor.is_active
                              ? "bg-gray-400"
                              : getSensoresStatus(sensor) >= sensor.red &&
                                "critical"
                              ? "bg-red-500"
                              : getSensoresStatus(sensor) >= sensor.yellow &&
                                getSensoresStatus(sensor) < sensor.red &&
                                "warning"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          title={`${sensor.name}: ${sensor.status}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Quick Actions Section - Moved to the end */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-base font-medium transition-colors">
              Generate Report
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-base font-medium transition-colors">
              Export Sensor Data
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-base font-medium transition-colors">
              Configure Alerts
            </button>
            <button className="w-full p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-base font-medium transition-colors">
              Sensor Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import EmployeeIdOnlyCard from "../../components/employee/EmployeeIdOnlyCard";

export default function EmployeeIDCard() {
  const { id } = useParams();

  const [emp, setEmp] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch employee + today's attendance
  useEffect(() => {
    setLoading(true);

    // Get employee details
    API.get(`/public/employees/${id}`)
      .then((res) => {
        setEmp(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Invalid Employee ID");
        setLoading(false);
      });

    // Get today's attendance
    API.get(`/attendance/today/${id}`)
      .then((res) => setAttendance(res.data))
      .catch(() => setAttendance(null));
  }, [id]);

  // 🔹 Mark attendance (IN / OUT)
  const handleAttendanceScan = async () => {
    if (!emp) return;

    try {
      const res = await API.post("/attendance", {
        employeeId: emp.employeeId,
      });

      setAttendance(res.data.attendance);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance");
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (!emp) {
    return <p className="text-center mt-4 text-danger">{message}</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center gap-4">

        {/* LEFT SIDE – EMPLOYEE ID CARD */}
        <div className="col-md-4">
          <EmployeeIdOnlyCard emp={emp} />
        </div>

        {/* RIGHT SIDE – ATTENDANCE CARD */}
        <div className="col-md-4">
          <div className="card p-3 shadow text-center">
            <h5 className="mb-3">Scan your ID for Attendance</h5>

            <button
              className="btn btn-primary w-100"
              onClick={handleAttendanceScan}
            >
              Scan / Mark Attendance
            </button>

            {attendance && (
              <p className="mt-3">
                <strong>IN:</strong>{" "}
                {attendance.inTime
                  ? new Date(attendance.inTime).toLocaleTimeString()
                  : "-"}
                <br />
                <strong>OUT:</strong>{" "}
                {attendance.outTime
                  ? new Date(attendance.outTime).toLocaleTimeString()
                  : "-"}
              </p>
            )}

            {message && (
              <p
                className="mt-2"
                style={{
                  color: message.includes("❌") ? "red" : "green",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

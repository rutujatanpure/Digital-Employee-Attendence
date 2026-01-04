import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import EmployeeIdOnlyCard from "../../components/employee/EmployeeIdOnlyCard";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function EmployeeIDCard() {
  const { id } = useParams();

  const [emp, setEmp] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    API.get(`/public/employees/${id}`)
      .then((res) => {
        setEmp(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Invalid Employee ID");
        setLoading(false);
      });

    API.get(`/attendance/today/${id}`)
      .then((res) => setAttendance(res.data))
      .catch(() => setAttendance(null));
  }, [id]);

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

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!emp) return <p className="text-center mt-4 text-danger">{message}</p>;

  return (
    <EmployeeLayout>
      {/* FLUID container to avoid side shift */}
      <div className="container-fluid px-3 py-3">
        <div className="row justify-content-center g-4">

          {/* ID CARD */}
          <div className="col-12 d-flex justify-content-center">
            <div
              className="d-flex justify-content-center w-100"
              style={{ maxWidth: "360px" }}
            >
              <EmployeeIdOnlyCard emp={emp} />
            </div>
          </div>

          {/* ATTENDANCE */}
          <div className="col-12 d-flex justify-content-center">
            <div
              className="card shadow p-4 text-center w-100"
              style={{ maxWidth: "360px" }}
            >
              <h5 className="mb-3">Scan your ID for Attendance</h5>

              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleAttendanceScan}
              >
                Scan / Mark Attendance
              </button>

              {attendance && (
                <div className="border rounded p-3">
                  <p className="mb-1">
                    <strong>IN:</strong>{" "}
                    {attendance.inTime
                      ? new Date(attendance.inTime).toLocaleTimeString()
                      : "-"}
                  </p>
                  <p className="mb-0">
                    <strong>OUT:</strong>{" "}
                    {attendance.outTime
                      ? new Date(attendance.outTime).toLocaleTimeString()
                      : "-"}
                  </p>
                </div>
              )}

              {message && (
                <p
                  className="mt-3 fw-semibold"
                  style={{ color: message.includes("❌") ? "red" : "green" }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </EmployeeLayout>
  );
}

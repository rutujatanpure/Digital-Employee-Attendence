import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaIdCard } from "react-icons/fa";
import EmployeeIdCardPopup from "./EmployeeIdCardPopup";

const BASE_URL = "http://localhost:5000";

export default function EmployeeTable() {
  const [emps, setEmps] = useState([]);
  const [filteredEmps, setFilteredEmps] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD =================
  const load = async () => {
    try {
      const res = await API.get("/employees");
      setEmps(res.data);
      setFilteredEmps(res.data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= GLOBAL SEARCH =================
  useEffect(() => {
    const q = search.toLowerCase();

    const filtered = emps.filter((e) => {
      const dob = e.dob ? formatDate(e.dob).toLowerCase() : "";

      return (
        e.employeeId?.toLowerCase().includes(q) ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.mobile?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q) ||
        dob.includes(q)
      );
    });

    setFilteredEmps(filtered);
  }, [search, emps]);

  // ================= DELETE =================
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      toast.success("Employee deleted successfully");
      load();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const handleEdit = (id) => navigate(`/admin/edit/${id}`);

  const handleShowIdCard = async (employeeId) => {
    try {
      const res = await API.get(`/public/employees/${employeeId}`);
      setSelectedEmployee(res.data);
      setShowPopup(true);
    } catch {
      toast.error("Failed to load ID Card");
    }
  };

  const formatDate = (dob) => {
  if (!dob) return "-";

  const d = new Date(dob);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

  return (
    <div className="container-fluid px-0">
      <ToastContainer position="top-right" autoClose={3000} />

      {/*  SEARCH BOX */}
      <div className="d-flex justify-content-end mb-2 px-2">
        <input
          type="text"
          className="form-control form-control-sm"
          style={{ width: 320 }}
          placeholder="Search by ID, name, role, email, mobile, DOB"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/*  TABLE WITH SCROLL */}
      <div
        className="table-responsive"
        style={{
          maxHeight: "70vh",
          overflowX: "auto",
          overflowY: "auto",
          border: "1px solid #dee2e6",
        }}
      >
        <table
          className="table table-sm table-bordered table-hover align-middle text-center"
          style={{ minWidth: "1400px" }}
        >
          <thead className="table-light sticky-top">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>DOB</th>
              <th>Photo</th>
              <th>Barcode</th>
              <th>ID Card</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmps.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No employees found
                </td>
              </tr>
            )}

            {filteredEmps.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.employeeId}</td>

                <td className="fw-medium">{e.name}</td>

                <td style={{ maxWidth: 220, wordBreak: "break-word" }}>
                  {e.email || "-"}
                </td>

                <td>{e.mobile || "-"}</td>

                <td className="text-capitalize">{e.role || "-"}</td>

                <td>{formatDate(e.dob)}</td>

                <td>
                  {e.photo ? (
                    <img
                      src={`${BASE_URL}/${e.photo}`}
                      alt={e.name}
                      width="36"
                      height="36"
                      className="rounded d-block mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {e.barcode ? (
                    <img
                      src={`${BASE_URL}/${e.barcode}`}
                      alt="barcode"
                      width="70"
                      height="30"
                      className="d-block mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => handleShowIdCard(e.employeeId)}
                  >
                    <FaIdCard />
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-light me-1"
                    onClick={() => handleEdit(e.employeeId)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => remove(e.employeeId)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && selectedEmployee && (
        <EmployeeIdCardPopup
          emp={selectedEmployee}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

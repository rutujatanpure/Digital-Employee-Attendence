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
  const [filters, setFilters] = useState({
    employeeId: "",
    name: "",
    email: "",
    mobile: "",
    role: "",
  });

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

  // ================= FILTER (LIKE SEARCH) =================
  useEffect(() => {
    const filtered = emps.filter((emp) => {
      return (
        emp.employeeId?.toLowerCase().includes(filters.employeeId.toLowerCase()) &&
        emp.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
        emp.email?.toLowerCase().includes(filters.email.toLowerCase()) &&
        emp.mobile?.toLowerCase().includes(filters.mobile.toLowerCase()) &&
        emp.role?.toLowerCase().includes(filters.role.toLowerCase())
      );
    });
    setFilteredEmps(filtered);
  }, [filters, emps]);

  // ================= DELETE =================
  const remove = async (id) => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.4)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    modal.innerHTML = `
      <div style="background:#fff; padding:20px; border-radius:8px; min-width:300px; text-align:center;">
        <p>Are you sure you want to delete this employee?</p>
        <button id="yesBtn" style="margin-right:10px;">Yes</button>
        <button id="noBtn">No</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("noBtn").onclick = () => document.body.removeChild(modal);
    document.getElementById("yesBtn").onclick = async () => {
      try {
        await API.delete(`/employees/${id}`);
        toast.success("Employee deleted successfully");
        load();
      } catch {
        toast.error("Failed to delete employee");
      }
      document.body.removeChild(modal);
    };
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
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <div className="container-fluid px-0">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: 130 }}>
                Employee ID
                <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Filter by ID"
                  value={filters.employeeId}
                  onChange={(e) =>
                    setFilters({ ...filters, employeeId: e.target.value })
                  }
                />
              </th>

              <th style={{ minWidth: 150 }}>
                Name
                <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Filter by name"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </th>

              <th style={{ minWidth: 200 }}>
                Email
                <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Filter by email"
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                />
              </th>

              <th style={{ minWidth: 140 }}>
                Mobile
                <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Filter by mobile"
                  value={filters.mobile}
                  onChange={(e) =>
                    setFilters({ ...filters, mobile: e.target.value })
                  }
                />
              </th>

              <th style={{ minWidth: 120 }}>
                Role
                <input
                  className="form-control form-control-sm mt-1"
                  placeholder="Filter by role"
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                />
              </th>

              <th>DOB</th>
              <th>Photo</th>
              <th>Barcode</th>
              <th className="text-center">ID Card</th>
              <th className="text-center">Actions</th>
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
                <td>{e.name}</td>
                <td>{e.email || "-"}</td>
                <td>{e.mobile || "-"}</td>
                <td>{e.role || "-"}</td>
                <td>{formatDate(e.dob)}</td>

                <td>
                  {e.photo ? (
                    <img
                      src={`${BASE_URL}/${e.photo}`}
                      alt={e.name}
                      width="32"
                      height="32"
                      className="rounded"
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
                      width="60"
                      height="30"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => handleShowIdCard(e.employeeId)}
                  >
                    <FaIdCard />
                  </button>
                </td>

                <td className="text-center">
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

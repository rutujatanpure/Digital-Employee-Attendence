import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeLayout({ children }) {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    setShowLogout(false);
    navigate("/"); // redirect to login page
  };

  return (
    <div className="position-relative">
      {/* Logout Toggle Button at Top-Right */}
      <div className="position-absolute top-0 end-0 p-3">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowLogout(true)}
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowLogout(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to logout?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogout(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container-fluid mt-4">{children}</div>
    </div>
  );
}

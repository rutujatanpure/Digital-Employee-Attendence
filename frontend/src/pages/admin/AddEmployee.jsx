import Sidebar from "../../components/common/Sidebar";
import EmployeeForm from "../../components/admin/EmployeeForm";

export default function AddEmployee() {
  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className="p-4 overflow-auto"
        style={{
          marginLeft: "220px", // space for the fixed sidebar
          height: "calc(100vh - 56px)",
        }}
      >
        <div className="card shadow-sm w-100" style={{ backgroundColor: "#f8f9fa" }}>
          {/* Card Header */}
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Create Employee ID</h5>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <EmployeeForm />
          </div>
        </div>
      </div>
    </div>
  );
}

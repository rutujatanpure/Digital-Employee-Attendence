import Sidebar from "../../components/common/Sidebar";
import EmployeeForm from "../../components/admin/EmployeeForm";

export default function AddEmployee() {
  return (
    <>
      {/* Main Layout: Sidebar + Content */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="p-4 w-100 overflow-auto">
          <div
            className="card shadow-sm mx-auto"
            style={{
              maxWidth: "700px", // increased width
              width: "100%",      // responsive on small screens
              backgroundColor: "#f8f9fa",
            }}
          >
            {/* Card Header */}
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Create Employee ID</h5>
            </div>

            {/* Card Body */}
            <div className="card-body">
              
              <EmployeeForm submitLabel="Submit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import EmployeeForm from "../../components/admin/EmployeeForm";

export default function AddEmployee() {
  return (
    <>
      {/* Header */}
      <Header title="Admin Dashboard" />

      {/* Main Layout: Sidebar + Content */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="p-4 w-100 overflow-auto">
          <div
            className="card shadow-sm mx-auto"
            style={{ maxWidth: "550px", backgroundColor: "#f8f9fa" }}
          >
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Add New Employee</h5>
            </div>
            <div className="card-body">
              <EmployeeForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

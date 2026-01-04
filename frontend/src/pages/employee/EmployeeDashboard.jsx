import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <div className="container text-center">
        <h4 className="mb-3">Welcome to Employee Dashboard</h4>
        <p>Please scan your ID or proceed with attendance.</p>
      </div>
    </EmployeeLayout>
  );
}

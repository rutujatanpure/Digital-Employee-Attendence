import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import EmployeeTable from "../../components/admin/EmployeeTable";

export default function ViewEmployees() {
  return (
    <>
      <Header title="Employee List" />
      <div className="d-flex">
        <Sidebar
          links={[
            { label: "Add Employee", path: "/admin/add" },
            { label: "Employee List", path: "/admin/employees" }
          ]}
        />
        <div className="p-4 w-100">
          <EmployeeTable />
        </div>
      </div>
    </>
  );
}

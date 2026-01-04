import EmployeeNavbar from "../components/common/EmployeeNavbar";

export default function EmployeeLayout({ children }) {
  return (
    <>
      <EmployeeNavbar />
      <div className="container-fluid mt-4">
        {children}
      </div>
    </>
  );
}

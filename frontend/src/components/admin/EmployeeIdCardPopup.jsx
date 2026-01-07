import EmployeeIdOnlyCard from "../employee/EmployeeIdOnlyCard";

export default function EmployeeIdCardPopup({ emp, onClose }) {
  if (!emp) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <EmployeeIdOnlyCard emp={emp} />

        <div className="text-center mt-3">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

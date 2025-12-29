import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [id, setId] = useState("");
  const nav = useNavigate();

  return (
    <>
      <Header title="Employee Dashboard" />
      <div className="d-flex">
        <Sidebar
          links={[
            { label: "Enter ID", path: "/employee" }
          ]}
        />
        <div className="p-4 w-100">
          <h4>Enter Employee ID</h4>
          <input className="form-control"
            onChange={e=>setId(e.target.value)} />
          <button className="btn btn-primary mt-3"
            onClick={()=>nav(`/employee/${id}`)}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

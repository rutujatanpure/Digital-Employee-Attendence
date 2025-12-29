import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const BASE_URL = "http://localhost:5000";

export default function EmployeeTable() {
  const [emps, setEmps] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await API.get("/employees");
    setEmps(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (window.confirm("Delete employee?")) {
      await API.delete(`/employees/${id}`);
      load();
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Employee List</h5>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-secondary">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>DOB</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Barcode</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {emps.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No employees found
                    </td>
                  </tr>
                )}

                {emps.map((e) => (
                  <tr key={e.employeeId}>
                    <td>{e.employeeId}</td>
                    <td>{e.name}</td>

                    {/* PHOTO */}
                    <td>
  {e.photo ? (
    <img
      src={`http://localhost:5000/${e.photo}`}
      alt={e.name}
      width="40"
      height="40"
      className="rounded"
    />
  ) : (
    "-"
  )}
</td>


                    <td>{e.dob}</td>
                    <td>{e.mobile}</td>
                    <td>{e.email}</td>
                    <td>{e.role}</td>

                    {/* BARCODE */}
                    <td>
                      {e.barcode ? (
                        <img
                          src={`${BASE_URL}/${e.barcode}`}
                          alt="barcode"
                          width="70"
                          height="40"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEdit(e.employeeId)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(e.employeeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

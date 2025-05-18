import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReportManager } from "../utils/ReportManager";

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    const found = stored.find((p: any) => p.name === projectName);
    if (found) {
      setProject(found);
      setResults(found.results || []);
    }
  }, [projectName]);

  const handleEvaluate = async () => {
    if (!project || !project.students) return;
    setLoading(true);

    try {
      const result = await window.api.evaluateProject(project);

      if (result.success) {
        setResults(result.results);

        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const updatedProjects = allProjects.map((p: any) =>
          p.name === project.name ? { ...p, results: result.results } : p
        );
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      } else {
        alert(`Evaluation failed: ${result.error}`);
      }
    } catch (err: any) {
      alert("Evaluation crashed.");
      console.error(err);
    }

    setLoading(false);
  };

  const passedCount = results.filter(r => r.status === 'Success').length;
  const totalCount = Object.keys(project?.students || {}).length;

  return (
    <div className="create-project-container">
      <h2>Project: {project?.name}</h2>
      <p><strong>Created:</strong> {new Date(project?.createdAt).toLocaleString()}</p>
      <p><strong>Configuration:</strong> {project?.config?.configName}</p>

      <h3 style={{ marginTop: "2rem" }}>Evaluation Results</h3>

      {totalCount === 0 ? (
        <p>No student folders found.</p>
      ) : (
        <table style={{
          width: '100%',
          marginTop: '1rem',
          borderCollapse: 'collapse',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}>
          <thead style={{ backgroundColor: '#292929', color: '#fff' }}>
            <tr>
              <th style={{ padding: '10px' }}>#</th>
              <th style={{ padding: '10px' }}>Student ID</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Compile</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Run</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Compare</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(project.students).map((id, index) => {
              const r = results.find(res => res.studentId === id);
              const error = r?.error?.toLowerCase() || "";
              const compileStatus = r ? (error.includes("compile") ? "Failure" : "Success") : "-";
              const runStatus = r
                ? error.includes("timeout")
                  ? "Timeout"
                  : r.status === "Success"
                  ? "Success"
                  : "Failure"
                : "-";
              const compareStatus = r ? (r.status === "Success" ? "Success" : "Failure") : "-";

              const reason = error.includes("compile")
                ? "Compile Error"
                : error.includes("timeout")
                ? "Timeout"
                : error.includes("runtime")
                ? "Runtime Error"
                : r?.status === "Failure"
                ? "Output Mismatch"
                : "Success";

              return (
                <tr key={id} style={{ backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#252525' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{id}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{compileStatus}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{runStatus}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{compareStatus}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{
                      backgroundColor: '#2a2a2a',
                      color: '#ddd',
                      border: '1px solid #444',
                      borderRadius: "8px",
                      padding: "10px",
                      fontSize: "0.85rem",
                      lineHeight: "1.5"
                    }}>
                      {r?.status === "Success" ? (
                        <span style={{ fontWeight: 'bold' }}>Successful</span>
                      ) : (
                        <>
                          <div><strong>{reason}</strong></div>
                          {r?.error && <div><span style={{ color: "#bbb" }}>Error:</span> {r.error}</div>}
                          {r?.actualOutput && <div><span style={{ color: "#bbb" }}>Output:</span> {r.actualOutput}</div>}
                          <div><span style={{ color: "#bbb" }}>Expected:</span> {project.config?.outputFormat}</div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
        <span style={{
          backgroundColor: passedCount === totalCount ? '#4caf50' : '#333',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          {passedCount} of {totalCount} students passed
        </span>
      </div>

      <div className="button-row" style={{ marginTop: "2rem" }}>
        <button onClick={handleEvaluate} disabled={loading}>
          {loading ? "Evaluating..." : "Evaluate"}
        </button>
        <button onClick={() => navigate("/")}>Back</button>
        <button onClick={() => ReportManager.exportToCSV(results)}>Export CSV</button>
        <button onClick={() => ReportManager.exportToPDF(results)}>Export PDF</button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

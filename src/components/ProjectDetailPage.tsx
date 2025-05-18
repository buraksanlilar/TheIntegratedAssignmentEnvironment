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
        <>
          <table style={{ width: '100%', marginTop: '1rem', backgroundColor: '#1e1e1e', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#333', color: '#fff' }}>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #555' }}>#</th>
                <th style={{ padding: '8px', border: '1px solid #555' }}>Student ID</th>
                <th style={{ padding: '8px', border: '1px solid #555' }}>Compile Status</th>
                <th style={{ padding: '8px', border: '1px solid #555' }}>Run Status</th>
                <th style={{ padding: '8px', border: '1px solid #555' }}>Compare Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(project.students).map((id, index) => {
                const r = results.find(res => res.studentId === id);
                return (
                  <tr key={id}>
                    <td style={{ padding: '8px', border: '1px solid #444', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #444' }}>{id}</td>
                    <td style={{ padding: '8px', border: '1px solid #444' }}>
                      {r ? (r.error?.includes('gcc') || r.error?.includes('compile') ? 'Failure' : 'Success') : '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #444' }}>
                      {r ? (r.error?.includes('timeout') ? 'Timeout' : r.status === 'Success' ? 'Success' : 'Failure') : '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #444' }}>
                      {r ? (r.status === 'Success' ? 'Success' : 'Failure') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p style={{ marginTop: '1rem' }}>
            ✅ {passedCount} of {totalCount} students passed
          </p>
        </>
      )}

      <div className="button-row" style={{ marginTop: "2rem" }}>
        <button onClick={handleEvaluate} disabled={loading}>
          {loading ? "Evaluating..." : "Evaluate"}
        </button>
        <button onClick={() => navigate("/")}>Back</button>
        <button onClick={() => ReportManager.exportToCSV(results)}>📄 Export CSV</button>
        <button onClick={() => ReportManager.exportToPDF(results)}>🧾 Export PDF</button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

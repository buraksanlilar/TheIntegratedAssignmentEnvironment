import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

        // localStorage'ı güncelle
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

  const getStatus = (id: string) => {
    const result = results.find((r) => r.studentId === id);
    return result ? result.status : "";
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="create-project-container">
      <h2>Project: {project.name}</h2>
      <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
      <p><strong>Configuration:</strong> {project.config?.configName}</p>

      <h3 style={{ marginTop: "2rem" }}>Student Submissions</h3>
      {Object.keys(project.students || {}).length === 0 ? (
        <p>No student folders found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
  {Object.keys(project.students).map((id) => {
    const result = results.find((r) => r.studentId === id)
    return (
      <li
        key={id}
        style={{
          padding: "0.5rem 1rem",
          margin: "0.5rem 0",
          backgroundColor: "#2c2c2c",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{id}</span>
          <span style={{ fontWeight: "bold" }}>{result?.status}</span>
        </div>

        {result?.status === 'Failure' && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#ccc" }}>
            {result.error && <div>❌ Error: {result.error}</div>}
            {result.actualOutput && <div>📤 Output: {result.actualOutput}</div>}
            <div>✅ Expected: {project.config?.outputFormat}</div>
          </div>
        )}
      </li>
    )
  })}
</ul>

      )}

      <div className="button-row">
        <button onClick={handleEvaluate} disabled={loading}>
          {loading ? "Evaluating..." : "Evaluate"}
        </button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

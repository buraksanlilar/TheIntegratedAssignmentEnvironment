import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [studentFolders, setStudentFolders] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    const found = stored.find((p: any) => p.projectName === projectName);
    if (found) {
      setProject(found);
      setResults(found.results || []);

      // 📁 Öğrenci klasörlerini doğrudan proje klasöründen oku
      try {
        const fs = window.require("fs");
        const path = window.require("path");
        const folders = fs
          .readdirSync(found.path)
          .filter((f: string) => {
            const fullPath = path.join(found.path, f);
            return fs.statSync(fullPath).isDirectory();
          });
        setStudentFolders(folders);
      } catch (err) {
        console.error("Failed to read project directory:", err);
      }
    }
  }, [projectName]);

  const handleEvaluate = () => {
    const newResults = studentFolders.map((id) => ({
      studentId: id,
      status: Math.random() < 0.5 ? "Success" : "Failure", // Sahte sonuç
    }));

    setResults(newResults);

    // localStorage'daki projeyi güncelle
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = allProjects.map((p: any) =>
      p.projectName === projectName ? { ...p, results: newResults } : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const getStatus = (id: string) => {
    const result = results.find((r) => r.studentId === id);
    return result ? result.status : "";
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="create-project-container">
      <h2>Project: {project.projectName}</h2>
      <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
      <p><strong>Configuration:</strong> {project.configuration?.configName}</p>
      <p><strong>Project Path:</strong> {project.path}</p>

      <h3 style={{ marginTop: "2rem" }}>Student Submissions</h3>
      {studentFolders.length === 0 ? (
        <p>No student folders found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {studentFolders.map((id) => (
            <li
              key={id}
              style={{
                padding: "0.5rem 1rem",
                margin: "0.5rem 0",
                backgroundColor: "#2c2c2c",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{id}</span>
              <span style={{ fontWeight: "bold" }}>
                {getStatus(id)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="button-row">
        <button onClick={handleEvaluate}>Evaluate</button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

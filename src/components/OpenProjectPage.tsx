// OpenProjectPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OpenProjectPage.css";

const OpenProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [toDelete, setToDelete] = useState<string | null>(null);    // 👈
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(stored);
  }, []);

  const handleOpenProject = (projectName: string) => {
    navigate(`/project/${encodeURIComponent(projectName)}`);
  };

  // artık doğrudan silmiyoruz, önce modal’ı açıyoruz
  const confirmDelete = (name: string) => {
    setToDelete(name);
  };

  // modal’dan “Evet” gelince bu çalışıyor
  const doDelete = () => {
    if (!toDelete) return;
    const updated = projects.filter((p) => p.name !== toDelete);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    setToDelete(null);
  };

  const cancelDelete = () => {
    setToDelete(null);
  };

  return (
    <div className="open-project-container">
      <h2>Open Existing Project</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.name} className="project-card">
              <div className="card-content">
                <h3 className="project-title">{project.name}</h3>
                <p>
                  <strong>Configuration:</strong> {project.config?.configName}
                </p>
                <p>
                  <strong>Student Count:</strong>{" "}
                  {Object.keys(project.students || {}).length}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="card-buttons">
                <button onClick={() => handleOpenProject(project.name)}>
                  Open Project
                </button>
                <button
                  className="delete-button"
                  onClick={() => confirmDelete(project.name)}   // 👈
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/")}>Back</button>

      {/* === React Modal === */}
      {toDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>
              Are you sure you want to delete project &quot;{toDelete}
              &quot;?
            </p>
            <div className="confirm-actions">
              <button onClick={doDelete}>Yes, Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenProjectPage;

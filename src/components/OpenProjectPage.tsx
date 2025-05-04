import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OpenProjectPage.css";

const OpenProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(stored);
  }, []);

  const handleOpenProject = (projectName: string) => {
    navigate(`/project/${encodeURIComponent(projectName)}`);
  };

  return (
    <div className="open-project-container">
      <h2>📁 Open Existing Project</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project, index) => (
            <li key={index} className="project-card">
              <div className="card-content">
                <h3 className="project-title">{project.name}</h3>
                <p><strong>Configuration:</strong> {project.config?.configName}</p>
                <p><strong>Student Count:</strong> {Object.keys(project.students || {}).length}</p>
                <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
              </div>

              <div className="card-buttons">
                <button onClick={() => handleOpenProject(project.name)}>
                  Open Project
                </button>
                <button className="delete-button" disabled>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default OpenProjectPage;

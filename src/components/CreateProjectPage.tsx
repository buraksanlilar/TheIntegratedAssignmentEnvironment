import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProjectPage.css";

const CreateProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [selectedConfigName, setSelectedConfigName] = useState("");
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [zipFolderPath, setZipFolderPath] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editConfigName, setEditConfigName] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editInputFormat, setEditInputFormat] = useState("");
  const [editOutputFormat, setEditOutputFormat] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedConfigs = JSON.parse(localStorage.getItem("configurations") || "[]");
    setConfigurations(storedConfigs);
  }, []);

  const handleCreate = async () => {
    if (!projectName || !selectedConfigName) {
      setErrorMsg("Please fill in all fields!");
      return;
    }

    const selectedConfig = configurations.find(
      (config) => config.configName === selectedConfigName
    );
    if (!selectedConfig) {
      setErrorMsg("Selected configuration not found!");
      return;
    }

    try {
      const result = await window.api.createProject(projectName);
      if (!result.success) {
        setErrorMsg(`Failed to create project. ${result.error || ""}`);
        return;
      }

      let students: Record<string, string> = {};
      if (zipFolderPath) {
        const processResult = await window.api.processZipFolder(zipFolderPath, projectName);
        if (!processResult.success) {
          setErrorMsg(`ZIP extract failed: ${processResult.error}`);
          return;
        }
        for (const entry of processResult.students) {
          students[entry.studentId] = entry.path;
        }
      }

      const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const newProject = {
        name: projectName,
        config: selectedConfig,
        students,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("projects", JSON.stringify([...existingProjects, newProject]));

      setSuccessMsg(`Project "${projectName}" created successfully!`);
      // reset form
      setProjectName("");
      setSelectedConfigName("");
      setZipFolderPath(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const openEditModal = () => {
    if (!selectedConfigName) {
      setErrorMsg("Please select a configuration to edit!");
      return;
    }
    const config = configurations.find((c) => c.configName === selectedConfigName);
    if (!config) {
      setErrorMsg("Configuration not found!");
      return;
    }
    setEditConfigName(config.configName);
    setEditLanguage(config.language);
    setEditInputFormat(config.inputFormat);
    setEditOutputFormat(config.outputFormat);
    setShowEditModal(true);
  };

  const closeEditModal = () => setShowEditModal(false);

  const saveEdit = () => {
    const updated = configurations.map((cfg) =>
      cfg.configName === selectedConfigName
        ? {
            configName: editConfigName,
            language: editLanguage,
            inputFormat: editInputFormat,
            outputFormat: editOutputFormat,
          }
        : cfg
    );
    setConfigurations(updated);
    localStorage.setItem("configurations", JSON.stringify(updated));
    setSelectedConfigName(editConfigName);
    setShowEditModal(false);
  };

  const closeError = () => setErrorMsg(null);
  const closeSuccess = () => setSuccessMsg(null);

  const selectedConfig = configurations.find((cfg) => cfg.configName === selectedConfigName);

  return (
    <div className="create-project-container">
      <h2>Create New Project</h2>

      <div className="form-group">
        <label>Project Name:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Configuration:</label>
        <select
          value={selectedConfigName}
          onChange={(e) => setSelectedConfigName(e.target.value)}
        >
          <option value="">Select Configuration...</option>
          {configurations.map((config, idx) => (
            <option key={idx} value={config.configName}>
              {config.configName} ({config.language})
            </option>
          ))}
        </select>
      </div>

      {selectedConfig && (
        <div className="config-details">
          <h3>Configuration Details</h3>
          <p><strong>Config Name:</strong> {selectedConfig.configName}</p>
          <p><strong>Language:</strong> {selectedConfig.language}</p>
          <p><strong>Input Format:</strong> {selectedConfig.inputFormat}</p>
          <p><strong>Expected Output Format:</strong> {selectedConfig.outputFormat}</p>
        </div>
      )}

      <div className="form-group">
        <label>Student Submissions Folder:</label>
        <button
          onClick={async () => {
            const res = await window.api.selectZipFolder();
            if (res.success && res.folderPath) setZipFolderPath(res.folderPath);
          }}
        >
          Select ZIP Folder
        </button>
        {zipFolderPath && (
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{zipFolderPath}</p>
        )}
      </div>

      <div className="button-row">
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleCancel}>Cancel</button>
        {selectedConfigName && (
          <button onClick={openEditModal} className="edit-config-button">
            ✏️ Edit Configuration
          </button>
        )}
      </div>

      {showEditModal && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Edit Configuration</h3>
            <div className="form-group">
              <label>Configuration Name:</label>
              <input
                type="text"
                value={editConfigName}
                onChange={(e) => setEditConfigName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Language:</label>
              <input
                type="text"
                value={editLanguage}
                onChange={(e) => setEditLanguage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Input Format:</label>
              <input
                type="text"
                value={editInputFormat}
                onChange={(e) => setEditInputFormat(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expected Output Format:</label>
              <input
                type="text"
                value={editOutputFormat}
                onChange={(e) => setEditOutputFormat(e.target.value)}
              />
            </div>
            <div className="confirm-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{errorMsg}</p>
            <div className="confirm-actions">
              <button onClick={closeError}>OK</button>
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{successMsg}</p>
            <div className="confirm-actions">
              <button onClick={closeSuccess}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectPage;

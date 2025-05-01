import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProjectPage.css";

const CreateProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [selectedConfigName, setSelectedConfigName] = useState("");
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [zipFolderPath, setZipFolderPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editConfigName, setEditConfigName] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editInputFormat, setEditInputFormat] = useState("");
  const [editOutputFormat, setEditOutputFormat] = useState("");

  useEffect(() => {
    const storedConfigs = JSON.parse(localStorage.getItem("configurations") || "[]");
    setConfigurations(storedConfigs);
  }, []);

  const handleCreate = async () => {
    if (!projectName) {
      alert("Please enter a project name!");
      return;
    }

    try {
      const result = await window.api.createProject(projectName);

      if (result.success) {
        if (zipFolderPath) {
          const processResult = await window.api.processZipFolder(zipFolderPath, projectName);
          if (!processResult.success) {
            alert(`ZIP extract failed: ${processResult.error}`);
            return;
          }
        }

        alert("Project created successfully!");
        navigate("/");
      } else {
        alert(`Failed to create project. ${result.error || ""}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleOpenModal = () => {
    if (!selectedConfigName) {
      alert("Please select a configuration to edit!");
      return;
    }

    const config = configurations.find(
      (c) => c.configName === selectedConfigName
    );
    if (!config) return;

    setEditConfigName(config.configName);
    setEditLanguage(config.language);
    setEditInputFormat(config.inputFormat);
    setEditOutputFormat(config.outputFormat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveEdit = () => {
    const updatedConfigs = configurations.map((config) => {
      if (config.configName === selectedConfigName) {
        return {
          configName: editConfigName,
          language: editLanguage,
          inputFormat: editInputFormat,
          outputFormat: editOutputFormat,
        };
      }
      return config;
    });

    setConfigurations(updatedConfigs);
    localStorage.setItem("configurations", JSON.stringify(updatedConfigs));
    setSelectedConfigName(editConfigName);
    setShowModal(false);
  };

  const selectedConfig = configurations.find(
    (config) => config.configName === selectedConfigName
  );

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
          {configurations.map((config, index) => (
            <option key={index} value={config.configName}>
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
            const result = await window.api.selectZipFolder();
            if (result.success && result.folderPath) {
              setZipFolderPath(result.folderPath);
            }
          }}
        >
          Select ZIP Folder
        </button>

        {zipFolderPath && (
          <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>{zipFolderPath}</p>
        )}
      </div>

      <div className="button-row">
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleCancel}>Cancel</button>
        {selectedConfigName && (
          <button onClick={handleOpenModal} className="edit-config-button">
            ✏️ Edit
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-wrapper">
          <div className="modal-content">
            <h2>Edit Configuration</h2>

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

            <div className="modal-buttons">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectPage;

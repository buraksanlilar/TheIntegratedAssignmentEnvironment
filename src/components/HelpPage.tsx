import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";  // Yardım sayfasına özgü CSS

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <h1 className="help-title">📘 Help - Integrated Assignment Environment (IAE)</h1>

      <div className="help-section">
        <h3>🔹 How to Create a New Project</h3>
        <p>
          To create a new project, click on the <strong>Create New Project</strong> button from the homepage. Enter the project name and choose a configuration that suits the programming language you're using (e.g., C, Java, Python).
          You will then be prompted to upload the student ZIP submissions.
        </p>
      </div>

      <div className="help-section">
        <h3>🛠 How to Manage Configurations</h3>
        <p>
          Configurations define the process for compiling and running student code. To create or modify a configuration, navigate to <strong>Manage Configurations</strong>. Here, you can set compilation commands, parameters, and other necessary steps to ensure the correct execution of student submissions.
        </p>
      </div>

      <div className="help-section">
        <h3>⚙️ How to Import and Export Configurations</h3>
        <p>
          You can export configurations for backup or sharing purposes. Navigate to <strong>Manage Configurations</strong> and click on <strong>Export</strong>. To import a configuration from another project or system, simply click <strong>Import</strong> and select the configuration file you want to add.
        </p>
      </div>

      <div className="help-section">
        <h3>📂 How to Add Student Submissions</h3>
        <p>
          Student submissions should be in <strong>ZIP format</strong>. When you create a new project, upload the ZIP files for each student. The IAE will automatically extract the ZIP files into folders named after the student IDs. Inside each folder, the student's code (e.g., <code>main.c</code>) should be available for compilation.
        </p>
      </div>

      <div className="help-section">
        <h3>🔄 How to Evaluate Submissions</h3>
        <p>
          To evaluate student submissions, click on <strong>Run Evaluation</strong> after uploading the student ZIPs. The system will compile and run the students' code according to the selected configuration, compare the output with the expected results, and generate a report indicating success or failure.
        </p>
      </div>

      <div className="help-section">
        <h3>📊 Viewing Results</h3>
        <p>
          After running the evaluation, you can view the results of each student's submission by navigating to the <strong>Open Existing Project</strong> page. The results will show whether each student’s code passed or failed the evaluation. You can also re-run evaluations if needed.
        </p>
      </div>

      <div className="help-section">
        <h3>❓ Frequently Asked Questions (FAQ)</h3>
        <p><strong>Q: What should I do if compilation fails for a student?</strong><br />
          A: If there is a compilation error, it will be logged in the evaluation report. The system will continue evaluating other students automatically, and you can view the error logs for troubleshooting.
        </p>
        <p><strong>Q: Can I use a custom compiler or interpreter?</strong><br />
          A: Yes, configurations can be tailored to use any available compiler or interpreter by specifying the correct paths and arguments in the configuration settings.
        </p>
        <p><strong>Q: How can I track student progress?</strong><br />
          A: You can track the status of each student’s assignment by viewing the detailed results in the evaluation reports, which will indicate whether they passed or failed the tests.
        </p>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default HelpPage;

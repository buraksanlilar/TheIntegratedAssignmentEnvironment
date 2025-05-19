
# Integrated Assignment Environment (IAE)

**IAE** is a desktop application designed to automate the **import**, **compilation**, **execution**, and **evaluation** of programming assignments submitted by students. Developed using **Electron**, **React**, and **TypeScript**, it offers a clean and efficient interface for instructors to manage configurations, process student submissions, and view evaluation reports.


![image](https://github.com/user-attachments/assets/98379e44-33bc-4614-aa4a-2a1586ec9755)

---

##  Features

###  Project-based Evaluation
Create separate evaluation projects with their own configuration and student submissions.


###  Flexible Configuration System
Supports custom compiler and run commands for multiple programming languages (C, Java, Python).

###  Automatic ZIP Import
Student submissions are uploaded as ZIP files and automatically extracted into individual folders based on student IDs.

###  Automated Compilation and Execution
Submissions are compiled and executed with input parameters provided in the configuration.

###  Output Comparison Engine
Program output is compared with the expected output, and success/failure is determined.


### Detailed Result Reports
Each student's status is shown, including:
- ✅ Success or ❌ Failure
- Compilation/runtime errors
- Actual and expected outputs



### Built-in Help System
Integrated help page explains all key features and usage steps.

---

##  Installation and Running

###  Download Installer
Download the release from GitHub Releases and run the setup:
```bash
AutoMark_Setup.exe
````

###  Run from Source

```bash
# Clone the repository
git clone https://github.com/your-username/iae.git
cd iae

# Install dependencies
npm install

# Run in development
npm run dev

# To package the app
npm run build && electron-builder
```

---

##  Usage

### 1. Create New Project

* Go to **Create New Project** from the homepage.
* Enter a project name.
* Select a ZIP folder containing student submissions (named with student IDs).
* Choose an evaluation configuration (C, Java, Python).
* Click **Create**. The system will:

  * Extract ZIPs
  * Compile code
  * Run each program
  * Compare output
  * Store results
 
  -   * ![image](https://github.com/user-attachments/assets/388db493-65ee-49e1-b561-f5a666f89ad9)

### 2. Manage Configurations

* Go to **Manage Configurations**.
* Create or edit configurations:

  * Configuration Name
  * Programming Language
  * Input Parameters (space-separated)
  * Expected Output

![image](https://github.com/user-attachments/assets/4ac0e48e-f3d5-4f34-b48a-304527474dfc)


### 3. Evaluate Submissions

* Open any existing project from **Open Existing Project**.
* Click **Evaluate**.
* Results will show:

  * Status (Success / Failure)
  * Error messages if any
  * Output vs Expected Output
 
  * ![image](https://github.com/user-attachments/assets/69fc9b93-67ab-4370-94a6-4de4fbd53953)
    
- ![image](https://github.com/user-attachments/assets/562f803e-2403-4d7d-8efb-c3cc4dd6bcb4)

### 4. Help Section

* Go to **Help** to view instructions for:

  * Creating projects
  * Defining configurations
  * Evaluating submissions
  * Common issues

- ![image](https://github.com/user-attachments/assets/19ab49e3-38c4-43e2-9b63-553b1f940679)

---

## 📁 Project Structure

```
 src/
 ┣ 📁 components/
 ┃ ┣ CreateProjectPage.tsx
 ┃ ┣ OpenProjectPage.tsx
 ┃ ┣ ProjectDetailPage.tsx
 ┃ ┣ ManageConfigurationsPage.tsx
 ┃ ┣ HelpPage.tsx
 ┃ ┗ HomePage.tsx
 ┣ main.ts / main.js (Electron main process)
 ┣ App.tsx (Routing)
 ┗ global.d.ts (Electron API bindings)
```

---

##  Technologies Used

*  React + TypeScript
*  Electron
*  Node.js (for zip extraction and child process execution)
*  LocalStorage (to persist project/config data)

---

##  Reporting Issues

Please open an [issue](https://github.com/your-username/iae/issues) on GitHub for bugs, improvements, or feature suggestions.

---

##  License

This project was developed as part of a university software engineering course. It is open for educational use.

```

export {}

declare global {
  interface Window {
    api: {
      createProject: () => Promise<{ success: boolean, project?: any }>
      openProject: () => Promise<void>
      manageConfigurations: () => Promise<void>
      openHelp: () => Promise<void>
    }
  }
}

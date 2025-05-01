export {}

declare global {
  interface Window {
    api: {
      createProject: (name: string) => Promise<{ success: boolean; project?: any; path?: string }>
      openProject: () => Promise<void>
      manageConfigurations: () => Promise<void>
      openHelp: () => Promise<void>
      importZip: () => Promise<{ success: boolean; path?: string; error?: string }>
      selectZipFile: () => Promise<{ success: boolean; path?: string }>
      importZipToProject: (zipPath: string, projectPath: string) => Promise<{ success: boolean; error?: string }>
    }
  }
}

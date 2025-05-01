export {}

declare global {
  interface Window {
    api: {
      // Proje işlemleri
      createProject: (name: string) => Promise<{ success: boolean; project?: any; path?: string; error?: string }>
      openProject: () => Promise<void>
      manageConfigurations: () => Promise<void>
      openHelp: () => Promise<void>

      // ZIP işlemleri
      importZip: () => Promise<{ success: boolean; path?: string; error?: string }>
      selectZipFile: () => Promise<{ success: boolean; path?: string }>
      selectZipFiles: () => Promise<{ success: boolean; paths?: string[] }>
      selectZipFolder: () => Promise<{ success: boolean; folderPath?: string }>
      importZipToProject: (zipPath: string, projectPath: string) => Promise<{ success: boolean; error?: string }>
      listZipFilesInFolder: (folderPath: string) => Promise<string[]>
      processZipFolder: (zipFolderPath: string, projectName: string) => Promise<{
        students: any; success: boolean; error?: string 
}>

    }
  }
}

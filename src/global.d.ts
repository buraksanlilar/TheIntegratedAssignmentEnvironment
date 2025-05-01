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

      // 📁 Klasördeki ZIP dosyalarını listele (context isolation çözümü)
      listZipFilesInFolder: (folderPath: string) => Promise<string[]>

      // 📂 ZIP klasörünü işleyip proje klasörüne extract eden özel fonksiyon
      processZipFolder: (zipFolderPath: string, projectName: string) => Promise<{ success: boolean; error?: string }>
      
    }
  }
}

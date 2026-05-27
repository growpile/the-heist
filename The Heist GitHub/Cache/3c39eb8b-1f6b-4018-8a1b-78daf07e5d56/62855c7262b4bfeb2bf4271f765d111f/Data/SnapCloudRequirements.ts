@component
export class SnapCloudRequirements extends BaseScriptComponent {

  
  
  // Core Snap Cloud Requirement - Only SupabaseProject needs to be centralized
  // For InternetModule, use: private internetModule: InternetModule = require('LensStudio:InternetModule');
  @input
  @hint("SupabaseProject asset from Asset Browser (created via Supabase Plugin)")
  @allowUndefined
  public supabaseProject: SupabaseProject;

  // Status tracking
  private isFullyConfigured: boolean = false;
  private warningMessage: string = "Snap Cloud Requirements not configured! Please assign Supabase Project.";

  onAwake() {
    this.validateConfiguration();

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart();
    });
  }

  onStart() {
    if (this.isFullyConfigured) {
      this.log(`Snap Cloud Ready - Supabase Project: ${this.supabaseProject ? this.supabaseProject.url : 'Missing'}`);
      
    } else {
      // Show warning on text component
    }
  }

  /**
   * Validate that all required components are configured
   */
  private validateConfiguration(): void {
    const hasSupabaseProject = this.supabaseProject !== null && this.supabaseProject !== undefined;

    this.isFullyConfigured = hasSupabaseProject;

    if (!this.isFullyConfigured) {
      this.showWarning();
    }
  }

  /**
   * Display warning message when configuration is incomplete
   */
  private showWarning(): void {
    const warningPrefix = "SnapCloudRequirements Warning:";
    
    print("=".repeat(60));
    print(warningPrefix);
    print(this.warningMessage);
    print("");
    
    if (!this.supabaseProject) {
      print("Missing: Supabase Project");
      print("   → Create via Window > Supabase > Import Credentials");
    }
    
    print("For InternetModule, use in your script:");
    print("   private internetModule: InternetModule = require('LensStudio:InternetModule');");
    
    print("=".repeat(60));
  }


  /**
   * PUBLIC API - Get Supabase Project
   * Other scripts can call this to get the configured Supabase Project
   */
  public getSupabaseProject(): SupabaseProject {
    if (!this.supabaseProject) {
      this.log("Supabase Project not configured!");
        this.showWarning();
    }
    return this.supabaseProject;
  }

  /**
   * PUBLIC API - Check if all requirements are configured
   */
  public isConfigured(): boolean {
    return this.isFullyConfigured;
  }

  /**
   * PUBLIC API - Get Supabase URL
   * Convenience method to get the Supabase project URL
   */
  public getSupabaseUrl(): string {
    if (!this.supabaseProject) {
      this.log("Cannot get URL - Supabase Project not configured!");
      return "";
    }
    return this.supabaseProject.url;
  }

  /**
   * PUBLIC API - Get Supabase Public Token
   * Convenience method to get the Supabase public API token
   */
  public getSupabasePublicToken(): string {
    if (!this.supabaseProject) {
      this.log("Cannot get token - Supabase Project not configured!");
      return "";
    }
    return this.supabaseProject.publicToken;
  }

  /**
   * PUBLIC API - Get HTTP headers for Supabase requests
   * Convenience method to get pre-configured headers
   */
  public getSupabaseHeaders(): { [key: string]: string } {
    if (!this.supabaseProject) {
      this.log("Cannot get headers - Supabase Project not configured!");
      return {};
    }

    return {
      "Content-Type": "application/json",
      "apikey": this.supabaseProject.publicToken,
      "Authorization": `Bearer ${this.supabaseProject.publicToken}`
    };
  }

  /**
   * PUBLIC API - Get Storage API URL
   * Convenience method to get the Supabase Storage base URL
   */
  public getStorageApiUrl(): string {
    if (!this.supabaseProject) {
      this.log("Cannot get Storage URL - Supabase Project not configured!");
      return "";
    }
    return this.supabaseProject.url.replace(/\/$/, '') + "/storage/v1/object/public/";
  }

  /**
   * PUBLIC API - Get REST API URL
   * Convenience method to get the Supabase REST API base URL
   */
  public getRestApiUrl(): string {
    if (!this.supabaseProject) {
      this.log("Cannot get REST URL - Supabase Project not configured!");
      return "";
    }
    return this.supabaseProject.url.replace(/\/$/, '') + "/rest/v1/";
  }

  /**
   * PUBLIC API - Get Functions API URL
   * Convenience method to get the Supabase Edge Functions base URL
   */
  public getFunctionsApiUrl(): string {
    if (!this.supabaseProject) {
      this.log("Cannot get Functions URL - Supabase Project not configured!");
      return "";
    }
    return this.supabaseProject.url.replace(/\/$/, '') + "/functions/v1/";
  }

  /**
   * Logging helper
   */
  private log(message: string): void {
    print(`[SnapCloudRequirements] ${message}`);
  }

  /**
   * PUBLIC API - Manually trigger validation
   * Useful if configuration is set programmatically
   */
  public revalidate(): void {
    this.validateConfiguration();
  }
}

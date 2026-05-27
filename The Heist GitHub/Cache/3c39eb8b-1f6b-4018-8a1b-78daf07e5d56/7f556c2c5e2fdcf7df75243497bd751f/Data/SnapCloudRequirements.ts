/** Shared Supabase project asset — CoopNetworkController reads this via getSupabaseProject(). */
@component
export class SnapCloudRequirements extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Snap Cloud</span>')

  @input
  @allowUndefined
  @hint("SupabaseProject from Window → Supabase → Import Credentials.")
  supabaseProject: SupabaseProject

  private configured = false

  onAwake(): void {
    this.validateConfiguration()
    this.createEvent("OnStartEvent").bind(() => {
      if (this.configured) {
        this.log("ready — " + (this.supabaseProject?.url ?? "missing url"))
      }
    })
  }

  getSupabaseProject(): SupabaseProject {
    if (!this.supabaseProject) {
      this.warnMissing()
    }
    return this.supabaseProject
  }

  isConfigured(): boolean {
    return this.configured
  }

  getSupabaseUrl(): string {
    return this.supabaseProject?.url ?? ""
  }

  getSupabasePublicToken(): string {
    return this.supabaseProject?.publicToken ?? ""
  }

  /** Anon/public key headers only — never pass service-role tokens here. */
  getSupabaseHeaders(): {[key: string]: string} {
    if (!this.supabaseProject) {
      return {}
    }
    return {
      "Content-Type": "application/json",
      apikey: this.supabaseProject.publicToken,
      Authorization: "Bearer " + this.supabaseProject.publicToken
    }
  }

  getStorageApiUrl(): string {
    const base = this.getSupabaseUrl().replace(/\/$/, "")
    return base ? base + "/storage/v1/object/public/" : ""
  }

  getRestApiUrl(): string {
    const base = this.getSupabaseUrl().replace(/\/$/, "")
    return base ? base + "/rest/v1/" : ""
  }

  getFunctionsApiUrl(): string {
    const base = this.getSupabaseUrl().replace(/\/$/, "")
    return base ? base + "/functions/v1/" : ""
  }

  revalidate(): void {
    this.validateConfiguration()
  }

  private validateConfiguration(): void {
    this.configured = !!this.supabaseProject
    if (!this.configured) {
      this.warnMissing()
    }
  }

  private warnMissing(): void {
    print("[SnapCloudRequirements] Assign a SupabaseProject asset in the Inspector.")
  }

  private log(message: string): void {
    print("[SnapCloudRequirements] " + message)
  }
}

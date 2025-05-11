
import { SiteSettings as BaseSiteSettings, SiteSettingRecord } from "@/types/siteSettings";

export type { SiteSettingRecord } from "@/types/siteSettings";
export type SiteSettings = BaseSiteSettings;

export interface SettingsUpdateResponse {
  success: boolean;
  error?: string;
}


import { supabase } from "@/integrations/supabase/client";
import { SiteSettings, SiteSettingRecord } from "./types";

// Storage key for localStorage fallback
export const STORAGE_KEY = 'site_settings';

/**
 * Save a setting to Supabase
 */
export const saveSetting = async (key: string, value: any): Promise<boolean> => {
  try {
    console.log(`Saving setting ${key}:`, value);
    
    // Save to localStorage as backup
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Verify if the setting exists already
    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key);
    
    // If exists, update, otherwise insert
    if (existingSettings && existingSettings.length > 0) {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value, 
          updated_at: new Date().toISOString()
        })
        .eq('key', key);
        
      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert([{ key, value }]);
        
      if (error) {
        console.error(`Error inserting setting ${key}:`, error);
        return false;
      }
    }
    
    // Trigger an event after successful save to Supabase
    window.dispatchEvent(new CustomEvent('siteSettingsSaved', {
      detail: { key, value }
    }));
    
    return true;
  } catch (err) {
    console.error(`Error saving setting ${key}:`, err);
    return false;
  }
};

/**
 * Load settings from Supabase or fallback to localStorage
 * All site settings (including restaurant name and footer text) are stored in the site_settings table in Supabase
 */
export const loadSettings = async (): Promise<SiteSettings | null> => {
  try {
    // First try to load from Supabase
    const { data: supabaseSettings, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) {
      console.error("Error loading settings from Supabase:", error);
      throw error;
    }
    
    if (supabaseSettings && supabaseSettings.length > 0) {
      // Convert database format to application format
      const settingsObject: SiteSettings = {};
      
      supabaseSettings.forEach((record: SiteSettingRecord) => {
        settingsObject[record.key] = record.value;
      });
      
      console.log("Loaded site settings from Supabase:", settingsObject);
      return settingsObject;
    }
    
    // Fallback to localStorage
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      console.log("Loaded site settings from localStorage:", parsedSettings);
      
      // Optionally migrate settings from localStorage to Supabase
      try {
        const keys = Object.keys(parsedSettings);
        for (const key of keys) {
          await saveSetting(key, parsedSettings[key]);
        }
        console.log("Settings migrated from localStorage to Supabase");
      } catch (migrateError) {
        console.error("Failed to migrate settings:", migrateError);
      }
      
      return parsedSettings;
    }
  } catch (err) {
    console.error("Error loading site settings:", err);
    
    // Final fallback to localStorage
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log("Fallback to localStorage settings:", parsedSettings);
        return parsedSettings;
      }
    } catch (localErr) {
      console.error("Error loading from localStorage:", localErr);
    }
  }
  
  return null;
};

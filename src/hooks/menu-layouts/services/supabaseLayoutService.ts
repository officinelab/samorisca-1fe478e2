
// Re-export all services from the modular structure
export {
  fetchLayoutsFromSupabase,
  saveLayoutToSupabase,
  deleteLayoutFromSupabase,
  setLayoutAsDefault,
  transformDbToLayout,
  transformLayoutToDb,
  mapSupabaseToLayout,
  initializeDefaultLayouts
} from './index';


import { supabase } from '@/lib/supabase';
import { PrintLayout } from '@/types/printLayout';
import { toast } from "@/components/ui/sonner";

/**
 * Carica i layout da Supabase
 */
export const fetchLayoutsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('print_layouts')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Errore nel caricamento dei layout da Supabase:', error);
      throw error;
    }
    
    // Converte i layout recuperati al formato PrintLayout
    const layouts = data.map(transformDbLayoutToLayout);
    
    // Trova il layout predefinito
    const defaultLayout = layouts.find(layout => layout.isDefault) || null;
    
    return { layouts, defaultLayout, error: null };
  } catch (err) {
    console.error('Errore imprevisto nel caricamento dei layout:', err);
    return { layouts: [], defaultLayout: null, error: 'Errore nel caricamento dei layout' };
  }
};

/**
 * Salva un layout su Supabase
 */
export const saveLayoutToSupabase = async (layout: PrintLayout) => {
  try {
    // Converti il layout nel formato accettato dal database
    const dbLayout = transformLayoutToDbLayout(layout);
    
    // Salva/aggiorna il layout nel database
    const { error } = await supabase
      .from('print_layouts')
      .upsert(dbLayout)
      .select();
      
    if (error) {
      console.error('Errore nel salvataggio del layout su Supabase:', error);
      return { success: false, error: error.message };
    }
    
    toast.success('Layout salvato con successo');
    return { success: true, error: null };
  } catch (err) {
    console.error('Errore imprevisto nel salvataggio del layout:', err);
    return { success: false, error: 'Errore nel salvataggio del layout' };
  }
};

/**
 * Converte un layout dal formato del database al tipo PrintLayout
 */
function transformDbLayoutToLayout(dbLayout: any): PrintLayout {
  return {
    id: dbLayout.id,
    name: dbLayout.name,
    type: dbLayout.type || 'classic',
    isDefault: dbLayout.is_default || false,
    productSchema: dbLayout.product_schema || 'schema1',
    elements: dbLayout.elements || {
      category: getDefaultElementConfig(),
      title: getDefaultElementConfig(),
      description: getDefaultElementConfig(),
      price: getDefaultElementConfig(),
      allergensList: getDefaultElementConfig(),
      priceVariants: getDefaultElementConfig()
    },
    cover: dbLayout.cover || {
      logo: {
        maxWidth: 50,
        maxHeight: 30,
        alignment: 'center',
        marginTop: 20,
        marginBottom: 20,
        visible: true
      },
      title: getDefaultElementConfig(),
      subtitle: getDefaultElementConfig()
    },
    allergens: dbLayout.allergens || {
      title: getDefaultElementConfig(),
      description: getDefaultElementConfig(),
      item: {
        number: getDefaultElementConfig(),
        title: getDefaultElementConfig(),
        spacing: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
        padding: 10
      }
    },
    spacing: dbLayout.spacing || {
      betweenCategories: 15,
      betweenProducts: 5,
      categoryTitleBottomMargin: 10
    },
    page: dbLayout.page || {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      evenPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    }
  };
}

/**
 * Converte un layout dal tipo PrintLayout al formato del database
 */
function transformLayoutToDbLayout(layout: PrintLayout): any {
  return {
    id: layout.id,
    name: layout.name,
    type: layout.type,
    is_default: layout.isDefault,
    product_schema: layout.productSchema,
    elements: layout.elements,
    cover: layout.cover,
    allergens: layout.allergens,
    spacing: layout.spacing,
    page: layout.page
  };
}

/**
 * Crea una configurazione predefinita per gli elementi del layout
 */
function getDefaultElementConfig() {
  return {
    visible: true,
    fontFamily: 'Arial',
    fontSize: 12,
    fontColor: '#000000',
    fontStyle: 'normal',
    alignment: 'left',
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };
}


import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase.rpc('get_remaining_tokens');
    
    if (error) {
      console.error('Error checking remaining tokens:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante la verifica dei token disponibili"
      });
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking tokens:', error);
    return null;
  }
};


import { checkRemainingTokens } from '../api/tokenManager';
import { toast } from '@/components/ui/sonner';

/**
 * Valida la disponibilità dei token prima di procedere con la traduzione
 */
export const validateTokenAvailability = async (): Promise<{ isValid: boolean; tokensData: number | null }> => {
  const tokensData = await checkRemainingTokens();

  if (tokensData === null) {
    return {
      isValid: false,
      tokensData: null
    };
  }

  if (tokensData <= 0) {
    toast.error('Token esauriti. Acquista altri token oppure riprova il prossimo mese.');
    return {
      isValid: false,
      tokensData
    };
  }

  return {
    isValid: true,
    tokensData
  };
};

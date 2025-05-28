
/**
 * Calcola il primo giorno del mese successivo
 */
export const getNextMonthFirstDay = (): Date => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return nextMonth;
};

/**
 * Formatta una data in italiano (es. "1 giugno 2025")
 */
export const formatDateInItalian = (date: Date): string => {
  const months = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};


/**
 * Sample data for preview rendering
 */
export const getSampleData = () => {
  const sampleCategories = [
    { id: "1", title: "Antipasti", title_en: "Starters" },
    { id: "2", title: "Primi Piatti", title_en: "First Courses" }
  ];

  const sampleProducts = {
    "1": [
      {
        id: "101",
        title: "Bruschetta al pomodoro",
        description: "Pomodori freschi, basilico e olio extra vergine d'oliva su pane tostato",
        price_standard: "5.50",
        allergens: [{ number: 1, name: "Glutine" }, { number: 7, name: "Latticini" }]
      },
      {
        id: "102",
        title: "Carpaccio di manzo",
        description: "Fettine sottili di manzo crudo con rucola e scaglie di parmigiano",
        price_standard: "12.00",
        allergens: [{ number: 7, name: "Latticini" }],
        has_multiple_prices: true,
        price_variant_1_name: "Media",
        price_variant_1_value: "8.00",
        price_variant_2_name: "Grande",
        price_variant_2_value: "12.00"
      }
    ],
    "2": [
      {
        id: "201",
        title: "Spaghetti alla carbonara",
        description: "Spaghetti con uova, guanciale, pecorino romano e pepe nero",
        price_standard: "10.00",
        allergens: [{ number: 1, name: "Glutine" }, { number: 3, name: "Uova" }, { number: 7, name: "Latticini" }]
      }
    ]
  };

  return { sampleCategories, sampleProducts };
};

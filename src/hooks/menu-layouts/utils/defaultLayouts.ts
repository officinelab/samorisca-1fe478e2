
import { PrintLayout } from "@/types/printLayout";

// Classic layout
const classicLayout: PrintLayout = {
  id: "classic-default",
  name: "Classico",
  type: "classic",
  isDefault: true,
  elements: {
    category: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 18,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    title: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 },
    },
    description: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    price: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    allergensList: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 10,
      fontColor: "#888888",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 0, left: 0 },
    },
    priceVariants: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 2, right: 0, bottom: 0, left: 0 },
    },
  },
  spacing: {
    betweenCategories: 15,
    betweenProducts: 10,
    categoryTitleBottomMargin: 5,
  },
  page: {
    marginTop: 20,
    marginRight: 15,
    marginBottom: 20,
    marginLeft: 15,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
    },
    evenPages: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
    },
  },
  // Aggiungiamo le nuove sezioni
  cover: {
    logo: {
      maxWidth: 80,
      maxHeight: 50,
      alignment: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    title: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 26,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 20, right: 0, bottom: 10, left: 0 }
    },
    subtitle: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 16,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 5, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f5f5f5",
      borderRadius: 0,
      padding: 5
    }
  }
};

// Modern layout
const modernLayout: PrintLayout = {
  id: "modern-default",
  name: "Moderno",
  type: "modern",
  isDefault: false,
  elements: {
    category: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 20,
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 10, left: 0 },
    },
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 16,
      fontColor: "#333333",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 3, left: 0 },
    },
    description: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 12,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 8, left: 0 },
    },
    price: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 16,
      fontColor: "#9b87f5",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    allergensList: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 10,
      fontColor: "#777777",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 3, right: 0, bottom: 0, left: 0 },
    },
    priceVariants: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 12,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 3, right: 0, bottom: 0, left: 0 },
    },
  },
  spacing: {
    betweenCategories: 25,
    betweenProducts: 15,
    categoryTitleBottomMargin: 10,
  },
  page: {
    marginTop: 25,
    marginRight: 20,
    marginBottom: 25,
    marginLeft: 20,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20,
    },
    evenPages: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20,
    },
  },
  // Aggiungiamo le nuove sezioni con stile moderno
  cover: {
    logo: {
      maxWidth: 85,
      maxHeight: 60,
      alignment: 'center',
      marginTop: 30,
      marginBottom: 30
    },
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 32,
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 30, right: 0, bottom: 15, left: 0 }
    },
    subtitle: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 18,
      fontColor: "#555555",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 10, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 24,
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 14,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 12, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 12,
      backgroundColor: "#F1F0FB",
      borderRadius: 6,
      padding: 10
    }
  }
};

// Allergens layout
const allergensLayout: PrintLayout = {
  id: "allergens-default",
  name: "Focus Allergeni",
  type: "allergens",
  isDefault: false,
  elements: {
    category: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#403E43",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 },
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    price: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#403E43",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    allergensList: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#ea384c",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 4, right: 0, bottom: 0, left: 0 },
    },
    priceVariants: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 3, right: 0, bottom: 0, left: 0 },
    },
  },
  spacing: {
    betweenCategories: 20,
    betweenProducts: 12,
    categoryTitleBottomMargin: 8,
  },
  page: {
    marginTop: 22,
    marginRight: 18,
    marginBottom: 22,
    marginLeft: 18,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 22,
      marginRight: 18,
      marginBottom: 22,
      marginLeft: 18,
    },
    evenPages: {
      marginTop: 22,
      marginRight: 18,
      marginBottom: 22,
      marginLeft: 18,
    },
  },
  // Aggiungiamo le sezioni per copertina e allergeni con focus sugli allergeni
  cover: {
    logo: {
      maxWidth: 80,
      maxHeight: 50,
      alignment: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 28,
      fontColor: "#403E43",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 25, right: 0, bottom: 10, left: 0 }
    },
    subtitle: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 8, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 28,
      fontColor: "#ea384c",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 10, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 12,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 8
    }
  }
};

export const defaultLayouts: PrintLayout[] = [
  classicLayout,
  modernLayout,
  allergensLayout,
];

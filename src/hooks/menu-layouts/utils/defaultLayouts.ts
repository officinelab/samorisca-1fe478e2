import { PrintLayout, ProductSchema } from "@/types/printLayout";

// Classic layout - Schema 1 (layout originale)
const classicLayoutSchema1: PrintLayout = {
  id: "classic-schema1",
  name: "Classico - Schema 1",
  type: "classic",
  isDefault: true,
  productSchema: "schema1",
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

// Classic layout - Schema 2 (layout compatto)
const classicLayoutSchema2: PrintLayout = {
  id: "classic-schema2",
  name: "Classico - Schema 2",
  type: "classic",
  isDefault: false,
  productSchema: "schema2",
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
    betweenProducts: 8,
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

// Classic layout - Schema 3 (layout espanso)
const classicLayoutSchema3: PrintLayout = {
  id: "classic-schema3",
  name: "Classico - Schema 3",
  type: "classic",
  isDefault: false,
  productSchema: "schema3",
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
    betweenProducts: 12,
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

export const defaultLayouts: PrintLayout[] = [
  classicLayoutSchema1,
  classicLayoutSchema2,
  classicLayoutSchema3
];

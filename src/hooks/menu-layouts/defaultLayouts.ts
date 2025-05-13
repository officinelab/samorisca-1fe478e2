
import { PrintLayout } from '@/types/printLayout';
import { v4 as uuidv4 } from 'uuid';

export const defaultLayouts: PrintLayout[] = [
  {
    id: uuidv4(),
    name: "Layout Classico",
    type: "classic",
    isDefault: true,
    productSchema: "schema1", // Specifies the product schema to use
    elements: {
      category: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      priceVariants: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      }
    },
    cover: {
      logo: {
        visible: true,
        maxWidth: 150,
        maxHeight: 150,
        alignment: "center",
        margin: { top: 40, right: 0, bottom: 20, left: 0 }
      },
      title: {
        visible: true,
        text: "Il Nostro Menu",
        fontFamily: "Georgia",
        fontSize: 24,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      subtitle: {
        visible: true,
        text: "Specialità della casa",
        fontFamily: "Georgia",
        fontSize: 16,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 10, right: 0, bottom: 40, left: 0 }
      }
    },
    allergens: {
      title: {
        visible: true,
        text: "Allergeni",
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      description: {
        visible: true,
        text: "Questo menu contiene informazioni sugli allergeni presenti nei nostri piatti",
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 20, left: 0 }
      },
      itemNumber: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 10, bottom: 5, left: 0 }
      },
      itemTitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 5, left: 0 }
      },
      item: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 15,
      categoryTitleBottomMargin: 8,
      betweenProducts: 5
    },
    page: {
      marginTop: 25,
      marginRight: 25,
      marginBottom: 25,
      marginLeft: 25,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 25,
        marginRight: 25,
        marginBottom: 25,
        marginLeft: 25
      },
      evenPages: {
        marginTop: 25,
        marginRight: 25,
        marginBottom: 25,
        marginLeft: 25
      }
    }
  },
  {
    id: uuidv4(),
    name: "Layout Compatto",
    type: "classic",
    isDefault: false,
    productSchema: "schema2", // Using schema2 as default for this layout
    elements: {
      category: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 5, right: 0, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 9,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      priceVariants: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 9,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 1, right: 0, bottom: 0, left: 0 }
      }
    },
    cover: {
      logo: {
        visible: true,
        maxWidth: 150,
        maxHeight: 150,
        alignment: "center",
        margin: { top: 40, right: 0, bottom: 20, left: 0 }
      },
      title: {
        visible: true,
        text: "Il Nostro Menu",
        fontFamily: "Georgia",
        fontSize: 24,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      subtitle: {
        visible: true,
        text: "Specialità della casa",
        fontFamily: "Georgia",
        fontSize: 16,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 10, right: 0, bottom: 40, left: 0 }
      }
    },
    allergens: {
      title: {
        visible: true,
        text: "Allergeni",
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      description: {
        visible: true,
        text: "Questo menu contiene informazioni sugli allergeni presenti nei nostri piatti",
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 20, left: 0 }
      },
      itemNumber: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 10, bottom: 5, left: 0 }
      },
      itemTitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 5, left: 0 }
      },
      item: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 12,
      categoryTitleBottomMargin: 6,
      betweenProducts: 4
    },
    page: {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20
      },
      evenPages: {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20
      }
    }
  },
  {
    id: uuidv4(),
    name: "Layout Espanso",
    type: "classic",
    isDefault: false,
    productSchema: "schema3", // Using schema3 as default for this layout
    elements: {
      category: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 16,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 8, right: 0, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 2, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 13,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      priceVariants: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 10,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      }
    },
    cover: {
      logo: {
        visible: true,
        maxWidth: 180,
        maxHeight: 180,
        alignment: "center",
        margin: { top: 50, right: 0, bottom: 30, left: 0 }
      },
      title: {
        visible: true,
        text: "Il Nostro Menu",
        fontFamily: "Georgia",
        fontSize: 28,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 30, right: 0, bottom: 15, left: 0 }
      },
      subtitle: {
        visible: true,
        text: "Specialità della casa",
        fontFamily: "Georgia",
        fontSize: 18,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 15, right: 0, bottom: 50, left: 0 }
      }
    },
    allergens: {
      title: {
        visible: true,
        text: "Allergeni",
        fontFamily: "Georgia",
        fontSize: 18,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 25, right: 0, bottom: 15, left: 0 }
      },
      description: {
        visible: true,
        text: "Questo menu contiene informazioni sugli allergeni presenti nei nostri piatti",
        fontFamily: "Georgia",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 25, left: 0 }
      },
      itemNumber: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 13,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 6, right: 12, bottom: 6, left: 0 }
      },
      itemTitle: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 13,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 6, right: 0, bottom: 6, left: 0 }
      },
      item: {
        visible: true,
        fontFamily: "Georgia",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "normal",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 18,
      categoryTitleBottomMargin: 10,
      betweenProducts: 8
    },
    page: {
      marginTop: 30,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 30,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 30,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 30
      },
      evenPages: {
        marginTop: 30,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 30
      }
    }
  }
];


import * as z from "zod";

export const printLayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.union([z.literal('classic'), z.literal('custom'), z.literal('modern'), z.literal('allergens')]),
  isDefault: z.boolean(),
  productSchema: z.union([z.literal('schema1'), z.literal('schema2'), z.literal('schema3')]),
  elements: z.object({
    category: z.object({
      visible: z.boolean(),
      fontFamily: z.string(),
      fontSize: z.number().min(1),
      fontColor: z.string(),
      fontStyle: z.union([z.literal('normal'), z.literal('italic'), z.literal('bold')]),
      alignment: z.union([z.literal('left'), z.literal('center'), z.literal('right')]),
      margin: z.object({
        top: z.number().min(0),
        right: z.number().min(0),
        bottom: z.number().min(0),
        left: z.number().min(0),
      }),
    }),
    title: z.any(),
    description: z.any(),
    price: z.any(),
    allergensList: z.any(),
    priceVariants: z.any(),
  }),
  cover: z.object({
    logo: z.object({
      maxWidth: z.number(),
      maxHeight: z.number(),
      alignment: z.union([z.literal('left'), z.literal('center'), z.literal('right')]),
      marginTop: z.number(),
      marginBottom: z.number(),
      visible: z.boolean(),
    }),
    title: z.any(),
    subtitle: z.any()
  }),
  allergens: z.any(),
  spacing: z.object({
    betweenCategories: z.number(),
    betweenProducts: z.number(),
    categoryTitleBottomMargin: z.number(),
  }),
  page: z.object({
    marginTop: z.number().min(0),
    marginRight: z.number().min(0),
    marginBottom: z.number().min(0),
    marginLeft: z.number().min(0),
    useDistinctMarginsForPages: z.boolean(),
    oddPages: z.object({
      marginTop: z.number().min(0),
      marginRight: z.number().min(0),
      marginBottom: z.number().min(0),
      marginLeft: z.number().min(0),
    }),
    evenPages: z.object({
      marginTop: z.number().min(0),
      marginRight: z.number().min(0),
      marginBottom: z.number().min(0),
      marginLeft: z.number().min(0),
    }),
  })
});


import { PrintLayout } from "@/types/printLayout";

export const createPageConfig = (): PrintLayout['page'] => ({
  marginTop: 15,
  marginRight: 15,
  marginBottom: 15,
  marginLeft: 15,
  useDistinctMarginsForPages: false,
  oddPages: { marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15 },
  evenPages: { marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15 },
  coverMarginTop: 25,
  coverMarginRight: 25,
  coverMarginBottom: 25,
  coverMarginLeft: 25,
  allergensMarginTop: 20,
  allergensMarginRight: 15,
  allergensMarginBottom: 20,
  allergensMarginLeft: 15,
  useDistinctMarginsForAllergensPages: false,
  allergensOddPages: { marginTop: 20, marginRight: 15, marginBottom: 20, marginLeft: 15 },
  allergensEvenPages: { marginTop: 20, marginRight: 15, marginBottom: 20, marginLeft: 15 }
});

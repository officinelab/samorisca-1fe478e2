
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig, PageMargins } from "@/types/printLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ElementEditor from "./ElementEditor";
import { useForm } from "react-hook-form";

interface PrintLayoutEditorProps {
  layout: PrintLayout;
  onSave: (layout: PrintLayout) => void;
}

const PrintLayoutEditor = ({ layout, onSave }: PrintLayoutEditorProps) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>({ ...layout });
  const [activeTab, setActiveTab] = useState("generale");

  const handleGeneralChange = (field: keyof PrintLayout, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleElementChange = (
    elementKey: keyof PrintLayout["elements"],
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          [field]: value
        }
      }
    }));
  };

  const handleElementMarginChange = (
    elementKey: keyof PrintLayout["elements"],
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          margin: {
            ...prev.elements[elementKey].margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  const handleSpacingChange = (field: keyof PrintLayout["spacing"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  };

  const handlePageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [field]: value,
        // Se non stiamo usando margini distinti, aggiorniamo anche i margini per pagine pari e dispari
        ...((!prev.page.useDistinctMarginsForPages) ? {
          oddPages: {
            ...prev.page.oddPages,
            [field]: value
          },
          evenPages: {
            ...prev.page.evenPages,
            [field]: value
          }
        } : {})
      }
    }));
  };

  const handleOddPageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        oddPages: {
          ...prev.page.oddPages,
          [field]: value
        }
      }
    }));
  };

  const handleEvenPageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        evenPages: {
          ...prev.page.evenPages,
          [field]: value
        }
      }
    }));
  };

  const handleToggleDistinctMargins = (useDistinct: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: useDistinct,
        // Se disabilitiamo i margini distinti, sincronizziamo i margini
        ...((!useDistinct) ? {
          oddPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          },
          evenPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          }
        } : {})
      }
    }));
  };

  const handleSave = () => {
    onSave(editedLayout);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifica Layout: {editedLayout.name}</CardTitle>
        <CardDescription>
          Personalizza tutti gli aspetti del layout di stampa
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="generale">Generale</TabsTrigger>
            <TabsTrigger value="elementi">Elementi</TabsTrigger>
            <TabsTrigger value="spaziatura">Spaziatura</TabsTrigger>
            <TabsTrigger value="pagina">Impostazioni Pagina</TabsTrigger>
          </TabsList>

          <TabsContent value="generale" className="space-y-4">
            <div>
              <Label htmlFor="layout-name">Nome Layout</Label>
              <Input
                id="layout-name"
                value={editedLayout.name}
                onChange={(e) => handleGeneralChange("name", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-default"
                checked={editedLayout.isDefault}
                onCheckedChange={(checked) => handleGeneralChange("isDefault", Boolean(checked))}
              />
              <Label htmlFor="is-default">Layout predefinito</Label>
            </div>
          </TabsContent>

          <TabsContent value="elementi" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger>Categoria</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.category}
                    onChange={(field, value) => handleElementChange("category", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("category", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="title">
                <AccordionTrigger>Titolo Prodotto</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.title}
                    onChange={(field, value) => handleElementChange("title", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("title", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="description">
                <AccordionTrigger>Descrizione Prodotto</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.description}
                    onChange={(field, value) => handleElementChange("description", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("description", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Prezzo</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.price}
                    onChange={(field, value) => handleElementChange("price", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("price", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="allergens">
                <AccordionTrigger>Allergeni</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.allergensList}
                    onChange={(field, value) => handleElementChange("allergensList", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("allergensList", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="priceVariants">
                <AccordionTrigger>Varianti Prezzo</AccordionTrigger>
                <AccordionContent>
                  <ElementEditor
                    element={editedLayout.elements.priceVariants}
                    onChange={(field, value) => handleElementChange("priceVariants", field, value)}
                    onMarginChange={(field, value) => handleElementMarginChange("priceVariants", field, value)}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="spaziatura" className="space-y-4">
            <div>
              <Label htmlFor="between-categories">Spazio tra categorie (mm)</Label>
              <Input
                id="between-categories"
                type="number"
                min={0}
                value={editedLayout.spacing.betweenCategories}
                onChange={(e) => handleSpacingChange("betweenCategories", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="between-products">Spazio tra prodotti (mm)</Label>
              <Input
                id="between-products"
                type="number"
                min={0}
                value={editedLayout.spacing.betweenProducts}
                onChange={(e) => handleSpacingChange("betweenProducts", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category-margin">Margine inferiore titolo categoria (mm)</Label>
              <Input
                id="category-margin"
                type="number"
                min={0}
                value={editedLayout.spacing.categoryTitleBottomMargin}
                onChange={(e) => handleSpacingChange("categoryTitleBottomMargin", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </TabsContent>

          <TabsContent value="pagina" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Margini generali</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-distinct-margins"
                      checked={editedLayout.page.useDistinctMarginsForPages}
                      onCheckedChange={handleToggleDistinctMargins}
                    />
                    <Label htmlFor="use-distinct-margins">
                      Usa margini distinti per pagine pari e dispari
                    </Label>
                  </div>
                </div>

                {!editedLayout.page.useDistinctMarginsForPages ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="margin-top">Margine superiore (mm)</Label>
                      <Input
                        id="margin-top"
                        type="number"
                        min={0}
                        value={editedLayout.page.marginTop}
                        onChange={(e) => handlePageMarginChange("marginTop", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="margin-right">Margine destro (mm)</Label>
                      <Input
                        id="margin-right"
                        type="number"
                        min={0}
                        value={editedLayout.page.marginRight}
                        onChange={(e) => handlePageMarginChange("marginRight", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="margin-bottom">Margine inferiore (mm)</Label>
                      <Input
                        id="margin-bottom"
                        type="number"
                        min={0}
                        value={editedLayout.page.marginBottom}
                        onChange={(e) => handlePageMarginChange("marginBottom", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="margin-left">Margine sinistro (mm)</Label>
                      <Input
                        id="margin-left"
                        type="number"
                        min={0}
                        value={editedLayout.page.marginLeft}
                        onChange={(e) => handlePageMarginChange("marginLeft", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium mb-2">Margini pagine dispari (1, 3, 5, ...)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="odd-margin-top">Superiore (mm)</Label>
                          <Input
                            id="odd-margin-top"
                            type="number"
                            min={0}
                            value={editedLayout.page.oddPages.marginTop}
                            onChange={(e) => handleOddPageMarginChange("marginTop", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="odd-margin-right">Destro (mm)</Label>
                          <Input
                            id="odd-margin-right"
                            type="number"
                            min={0}
                            value={editedLayout.page.oddPages.marginRight}
                            onChange={(e) => handleOddPageMarginChange("marginRight", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="odd-margin-bottom">Inferiore (mm)</Label>
                          <Input
                            id="odd-margin-bottom"
                            type="number"
                            min={0}
                            value={editedLayout.page.oddPages.marginBottom}
                            onChange={(e) => handleOddPageMarginChange("marginBottom", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="odd-margin-left">Sinistro (mm)</Label>
                          <Input
                            id="odd-margin-left"
                            type="number"
                            min={0}
                            value={editedLayout.page.oddPages.marginLeft}
                            onChange={(e) => handleOddPageMarginChange("marginLeft", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-base font-medium mb-2">Margini pagine pari (2, 4, 6, ...)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="even-margin-top">Superiore (mm)</Label>
                          <Input
                            id="even-margin-top"
                            type="number"
                            min={0}
                            value={editedLayout.page.evenPages.marginTop}
                            onChange={(e) => handleEvenPageMarginChange("marginTop", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="even-margin-right">Destro (mm)</Label>
                          <Input
                            id="even-margin-right"
                            type="number"
                            min={0}
                            value={editedLayout.page.evenPages.marginRight}
                            onChange={(e) => handleEvenPageMarginChange("marginRight", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="even-margin-bottom">Inferiore (mm)</Label>
                          <Input
                            id="even-margin-bottom"
                            type="number"
                            min={0}
                            value={editedLayout.page.evenPages.marginBottom}
                            onChange={(e) => handleEvenPageMarginChange("marginBottom", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="even-margin-left">Sinistro (mm)</Label>
                          <Input
                            id="even-margin-left"
                            type="number"
                            min={0}
                            value={editedLayout.page.evenPages.marginLeft}
                            onChange={(e) => handleEvenPageMarginChange("marginLeft", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Salva modifiche</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutEditor;

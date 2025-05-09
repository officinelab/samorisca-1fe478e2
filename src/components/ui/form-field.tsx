
import React from "react";
import { FormControl, FormDescription, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  children: React.ReactNode;
}

const FormField = ({
  form,
  name,
  label,
  description,
  children
}: FormFieldProps) => {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { ...field })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;

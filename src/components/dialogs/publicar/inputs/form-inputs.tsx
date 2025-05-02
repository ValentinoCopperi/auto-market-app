"use client"

import type { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PublicarFormSchemaValues } from "@/types/publicar"

type FieldType = "text" | "number" | "textarea" | "select"

interface FieldConfig {
  label: string
  type?: FieldType
  placeholder?: string
  min?: number
  max?: number
  options?: string[]
  rows?: number
  width?: string
}

interface FieldConfigMap {
  [key: string]: {
    [key in keyof PublicarFormSchemaValues]?: FieldConfig
  }
}

interface FormSectionsProps {
  control: Control<PublicarFormSchemaValues>
  fieldConfig: FieldConfigMap
  loading: boolean
}

export function FormSections({ control, fieldConfig, loading }: FormSectionsProps) {
  // Helper function to render a form field based on its configuration
  const renderField = (name: keyof PublicarFormSchemaValues, config: FieldConfig) => {
    return (
      <FormField
        key={name as string}
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`space-y-2 ${config.width || ""}`}>
            <FormLabel className="flex items-center">
              {config.label} <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              {config.options ? (
                <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Selecciona ${config.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : config.type === "textarea" ? (
                <Textarea
                  disabled={loading}
                  placeholder={config.placeholder}
                  rows={config.rows || 3}
                  {...{ ...field, value: String(field.value) }}
                />
              ) : (
                <Input
                  disabled={loading}
                  type={config.type || "text"}
                  min={config.min}
                  max={config.max}
                  placeholder={config.placeholder}
                  {...field}
                  value={typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Special case for precio and tipo_moneda which need to be rendered together
  const renderPrecioSection = () => {
    const precioConfig = fieldConfig.specs?.precio
    const monedaConfig = fieldConfig.specs?.tipo_moneda

    if (!precioConfig || !monedaConfig) return null

    return (
      <div className="space-y-2">
        <FormLabel className="flex items-center">
          {precioConfig.label} <span className="text-red-500 ml-1">*</span>
        </FormLabel>
        <div className="flex gap-2">
          <FormField
            control={control}
            name="precio"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input type="number" min={precioConfig.min} placeholder={precioConfig.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="tipo_moneda"
            render={({ field }) => (
              <FormItem className={monedaConfig.width}>
                <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {monedaConfig.options?.map((moneda) => (
                      <SelectItem key={moneda} value={moneda}>
                        {moneda}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Basic Info Section */}
      <div className="space-y-4">
        {fieldConfig.basicInfo?.titulo && renderField("titulo", fieldConfig.basicInfo.titulo)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldConfig.basicInfo?.marca && renderField("marca", fieldConfig.basicInfo.marca)}
          {fieldConfig.basicInfo?.modelo && renderField("modelo", fieldConfig.basicInfo.modelo)}
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldConfig.details?.anio && renderField("anio", fieldConfig.details.anio)}
        {fieldConfig.details?.tipo_transmision && renderField("tipo_transmision", fieldConfig.details.tipo_transmision)}
      </div>

      {/* Specs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldConfig.specs?.kilometraje && renderField("kilometraje", fieldConfig.specs.kilometraje)}
        <div>{renderPrecioSection()}</div>
      </div>

      {/* Location Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldConfig.location?.categoria && renderField("categoria", fieldConfig.location.categoria)}
        {fieldConfig.location?.ciudad && renderField("ciudad", fieldConfig.location.ciudad)}
      </div>

      {/* Appearance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldConfig.appearance?.color && renderField("color", fieldConfig.appearance.color)}
        {fieldConfig.appearance?.tipo_combustible &&
          renderField("tipo_combustible", fieldConfig.appearance.tipo_combustible)}
      </div>

      {/* Description Section */}
      {fieldConfig.description?.descripcion && renderField("descripcion", fieldConfig.description.descripcion)}
    </>
  )
}


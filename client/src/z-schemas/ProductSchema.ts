import { z } from "zod";

export const AddProductSchema = z.object({
  product_title: z
    .string()
    .min(1, { message: "Le titre du produit est requis" }),
  product_description: z.string().optional(),
  product_price: z
    .number({ message: "Le prix du produit est requis" })
    .min(0.01, { message: "Le prix du produit doit être supérieur à zéro" }),
  product_category: z
    .string()
    .min(1, { message: "La catégorie du produit est requise" }),
  delivery: z
    .string()
    .min(1, { message: "Les informations de livraison sont requises" }),
  product_stock: z
    .number({ message: "Le stock du produit est requis" })
    .min(0, { message: "Le stock du produit doit être au moins de zéro" }),
  brand: z.string().optional(),
  itemModelNumber: z.string().optional(),
  color: z.string().optional(),
  operatingSystem: z.string().optional(),
  computerHardwarePlatform: z.string().optional(),
  keyboardDescription: z.string().optional(),
  processorBrand: z.string().optional(),
  typeOfProcessor: z.string().optional(),
  speedOfProcessor: z.string().optional(),
  numberOfHearts: z.string().optional(),
  sizeRam: z.string().optional(),
  sizeSsd: z.string().optional(),
  typeOfStorage: z.string().optional(),
  sizeScreen: z.string().optional(),
  gpu: z.string().optional(),
  gpuRam: z.string().optional(),
  connectivityType: z.string().optional(),
  wirelessTechnologyType: z.string().optional(),
  computerHardwareInterface: z.string().optional(),
  connectorType: z.string().optional(),
  softwareIncluded: z.string().optional(),
  itemDimensionsLxWxH: z.string().optional(),
  weight: z.string().optional(),
  resolution: z.string().optional(),
  series: z.string().optional(),
  keyboardAndLanguage: z.string().optional(),
});

export const EditProductSchema = z.object({
  product_title: z
    .string()
    .min(1, { message: "Le titre du produit est requis" }),
  product_description: z.string().optional(),
  product_price: z
    .number({ message: "Le prix du produit est requis" })
    .min(0.01, { message: "Le prix du produit doit être supérieur à zéro" }),
  product_category: z
    .string()
    .min(1, { message: "La catégorie du produit est requise" }),
  delivery: z
    .string()
    .min(1, { message: "Les informations de livraison sont requises" }),
  brand: z.string().optional(),
  itemModelNumber: z.string().optional(),
  color: z.string().optional(),
  operatingSystem: z.string().optional(),
  computerHardwarePlatform: z.string().optional(),
  keyboardDescription: z.string().optional(),
  processorBrand: z.string().optional(),
  typeOfProcessor: z.string().optional(),
  speedOfProcessor: z.string().optional(),
  numberOfHearts: z.string().optional(),
  sizeRam: z.string().optional(),
  sizeSsd: z.string().optional(),
  typeOfStorage: z.string().optional(),
  sizeScreen: z.string().optional(),
  gpu: z.string().optional(),
  gpuRam: z.string().optional(),
  connectivityType: z.string().optional(),
  wirelessTechnologyType: z.string().optional(),
  computerHardwareInterface: z.string().optional(),
  connectorType: z.string().optional(),
  softwareIncluded: z.string().optional(),
  itemDimensionsLxWxH: z.string().optional(),
  weight: z.string().optional(),
  resolution: z.string().optional(),
  series: z.string().optional(),
  keyboardAndLanguage: z.string().optional(),
});

export type AddProduct = z.infer<typeof AddProductSchema>;
export type EditProduct = z.infer<typeof EditProductSchema>;

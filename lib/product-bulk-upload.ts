import * as XLSX from "xlsx";
import type { Product } from "@/lib/api/products";

export interface BulkProductRow {
  sku: string;
  barcode: string;
  productName: string;
  genericName: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  unit: string;
  packSize: string;
  purchasePrice: string;
  costPrice: string;
  sellingPrice: string;
  offerPrice: string;
  taxPercent: string;
  discountPercent: string;
  stockQty: string;
  minStock: string;
  maxStock: string;
  batchNo: string;
  expiryDate: string;
  manufactureDate: string;
  supplier: string;
  manufacturer: string;
  weight: string;
  color: string;
  size: string;
  variant: string;
  imageUrl: string;
  status: string;
  featured: string;
  bestSeller: string;
  tags: string;
  notes: string;
}

export type BulkProductApiRow = Omit<BulkProductRow, "bestSeller"> & {
  imageUrls?: string[];
};

export const BULK_UPLOAD_COLUMNS: { key: keyof BulkProductRow; label: string }[] = [
  { key: "productName", label: "Product Name" },
  { key: "sku", label: "SKU" },
  { key: "barcode", label: "Barcode" },
  { key: "genericName", label: "Generic Name (BN)" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "subcategory", label: "Subcategory (BN)" },
  { key: "description", label: "Description" },
  { key: "unit", label: "Unit" },
  { key: "packSize", label: "Pack Size" },
  { key: "purchasePrice", label: "Purchase Price" },
  { key: "costPrice", label: "Cost Price" },
  { key: "sellingPrice", label: "Selling Price" },
  { key: "offerPrice", label: "Offer Price" },
  { key: "taxPercent", label: "Tax %" },
  { key: "discountPercent", label: "Discount %" },
  { key: "stockQty", label: "Stock Qty" },
  { key: "minStock", label: "Min Stock" },
  { key: "maxStock", label: "Max Stock" },
  { key: "batchNo", label: "Batch No" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "manufactureDate", label: "Manufacture Date" },
  { key: "supplier", label: "Supplier" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "weight", label: "Weight" },
  { key: "color", label: "Color" },
  { key: "size", label: "Size" },
  { key: "variant", label: "Variant" },
  { key: "imageUrl", label: "Image URL" },
  { key: "status", label: "Status" },
  { key: "featured", label: "Featured" },
  { key: "bestSeller", label: "Best Seller" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
];

const HEADER_ALIASES: Record<string, keyof BulkProductRow> = {
  sku: "sku",
  barcode: "barcode",
  "product name": "productName",
  "generic name": "genericName",
  "generic name (bn)": "genericName",
  brand: "brand",
  category: "category",
  subcategory: "subcategory",
  "subcategory (bn)": "subcategory",
  description: "description",
  unit: "unit",
  "pack size": "packSize",
  "purchase price": "purchasePrice",
  "cost price": "costPrice",
  "selling price": "sellingPrice",
  "offer price": "offerPrice",
  "tax %": "taxPercent",
  "tax percent": "taxPercent",
  "discount %": "discountPercent",
  "discount percent": "discountPercent",
  "stock qty": "stockQty",
  "stock quantity": "stockQty",
  stock: "stockQty",
  "min stock": "minStock",
  "max stock": "maxStock",
  "batch no": "batchNo",
  "batch number": "batchNo",
  "expiry date": "expiryDate",
  "manufacture date": "manufactureDate",
  "manufacturing date": "manufactureDate",
  supplier: "supplier",
  manufacturer: "manufacturer",
  weight: "weight",
  color: "color",
  colour: "color",
  size: "size",
  variant: "variant",
  "image url": "imageUrl",
  image: "imageUrl",
  status: "status",
  featured: "featured",
  "best seller": "bestSeller",
  bestseller: "bestSeller",
  tags: "tags",
  notes: "notes",
};

function normalizeHeader(header: string): keyof BulkProductRow | null {
  const normalized = header.trim().toLowerCase().replace(/[_-]+/g, " ");
  return HEADER_ALIASES[normalized] ?? null;
}

function emptyRow(): BulkProductRow {
  return {
    sku: "",
    barcode: "",
    productName: "",
    genericName: "",
    brand: "",
    category: "",
    subcategory: "",
    description: "",
    unit: "",
    packSize: "",
    purchasePrice: "",
    costPrice: "",
    sellingPrice: "",
    offerPrice: "",
    taxPercent: "",
    discountPercent: "",
    stockQty: "",
    minStock: "",
    maxStock: "",
    batchNo: "",
    expiryDate: "",
    manufactureDate: "",
    supplier: "",
    manufacturer: "",
    weight: "",
    color: "",
    size: "",
    variant: "",
    imageUrl: "",
    status: "",
    featured: "",
    bestSeller: "",
    tags: "",
    notes: "",
  };
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return String(value).trim();
}

function parseYesNo(value: string): boolean {
  return ["yes", "true", "1", "y"].includes(value.trim().toLowerCase());
}

export function mapRawRowsToBulkProducts(rawRows: Record<string, unknown>[]): BulkProductRow[] {
  if (rawRows.length === 0) return [];

  const headers = Object.keys(rawRows[0] ?? {});
  const headerMap = new Map<string, keyof BulkProductRow>();
  for (const header of headers) {
    const key = normalizeHeader(header);
    if (key) headerMap.set(header, key);
  }

  return rawRows
    .map((raw) => {
      const row = emptyRow();
      for (const [header, key] of headerMap) {
        row[key] = cellToString(raw[header]);
      }
      return row;
    })
    .filter((row) => Object.values(row).some((value) => value.length > 0));
}

export function prepareBulkRowForApi(
  row: BulkProductRow & { imageUrls?: string[] }
): BulkProductApiRow {
  const isBestSeller = parseYesNo(row.bestSeller);
  let tags = row.tags.trim();

  if (isBestSeller && !tags.toLowerCase().includes("bestseller")) {
    tags = tags ? `${tags},bestseller` : "bestseller";
  }

  const featured =
    isBestSeller || parseYesNo(row.featured) ? "yes" : row.featured.trim();

  const { bestSeller: _bestSeller, ...rest } = row;

  return {
    ...rest,
    tags,
    featured,
  };
}

export function getBulkUploadHeaderLabels(): string[] {
  return BULK_UPLOAD_COLUMNS.map((column) => column.label);
}

export function productToBulkRow(product: Product): BulkProductRow {
  const tags = product.tags ?? "";
  const isBestSeller = tags.toLowerCase().includes("bestseller");

  return {
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    productName: product.productName ?? "",
    genericName: product.genericName ?? "",
    brand: product.brand ?? "",
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    description: product.description ?? "",
    unit: product.unit ?? "",
    packSize: product.packSize ?? "",
    purchasePrice: String(product.purchasePrice ?? ""),
    costPrice: String(product.costPrice ?? ""),
    sellingPrice: String(product.sellingPrice ?? ""),
    offerPrice: String(product.offerPrice ?? ""),
    taxPercent: String(product.taxPercent ?? ""),
    discountPercent: String(product.discountPercent ?? ""),
    stockQty: String(product.stockQty ?? ""),
    minStock: String(product.minStock ?? ""),
    maxStock: String(product.maxStock ?? ""),
    batchNo: product.batchNo ?? "",
    expiryDate: product.expiryDate ?? "",
    manufactureDate: product.manufactureDate ?? "",
    supplier: product.supplier ?? "",
    manufacturer: product.manufacturer ?? "",
    weight: product.weight ?? "",
    color: product.color ?? "",
    size: product.size ?? "",
    variant: product.variant ?? "",
    imageUrl: product.imageUrl || product.images[0] || "",
    status: product.status ?? "",
    featured: product.featured ? "yes" : "no",
    bestSeller: isBestSeller ? "yes" : "no",
    tags,
    notes: product.notes ?? "",
  };
}

export function productsToSheetValues(products: Product[]): string[][] {
  const headers = getBulkUploadHeaderLabels();
  const rows = products.map((product) => rowToValues(productToBulkRow(product)));
  return [headers, ...rows];
}

const SAMPLE_SHEET_ROW_LIMIT = 8;

export function productsToSampleSheetValues(products: Product[]): string[][] {
  const headers = getBulkUploadHeaderLabels();
  const sampleProducts = products.slice(0, SAMPLE_SHEET_ROW_LIMIT);

  if (sampleProducts.length > 0) {
    const rows = sampleProducts.map((product) => rowToValues(productToBulkRow(product)));
    return [headers, ...rows];
  }

  const rows = getSampleRows()
    .slice(0, SAMPLE_SHEET_ROW_LIMIT)
    .map((row) => rowToValues(row));
  return [headers, ...rows];
}

function rowToValues(row: BulkProductRow): string[] {
  return BULK_UPLOAD_COLUMNS.map((column) => row[column.key]);
}

function getSampleRows(): BulkProductRow[] {
  return [
    {
      ...emptyRow(),
      productName: "Gawa Ghee 1kg",
      sku: "KF-GHEE-001",
      barcode: "8801234567890",
      genericName: "দেশি ঘি ১ কেজি",
      brand: "Ecommerce OS",
      category: "Ghee",
      subcategory: "ঘি",
      description: "Traditional cow ghee",
      unit: "kg",
      packSize: "1",
      purchasePrice: "1500",
      costPrice: "1600",
      sellingPrice: "1930",
      offerPrice: "1850",
      taxPercent: "5",
      discountPercent: "4",
      stockQty: "45",
      minStock: "10",
      maxStock: "200",
      batchNo: "B2026-01",
      expiryDate: "2027-01-15",
      manufactureDate: "2026-01-01",
      supplier: "Local Supplier",
      manufacturer: "Ecommerce OS",
      weight: "1kg",
      imageUrl: "https://example.com/ghee.jpg",
      status: "active",
      featured: "yes",
      bestSeller: "yes",
      tags: "ghee,dairy",
      notes: "Homepage top seller",
    },
    {
      ...emptyRow(),
      productName: "Pure Mustard Honey",
      sku: "KF-HONEY-001",
      barcode: "8801234567891",
      genericName: "খাঁটি সরিষার মধু",
      brand: "Ecommerce OS",
      category: "Honey",
      subcategory: "মধু",
      description: "Pure mustard flower honey",
      unit: "jar",
      packSize: "500g",
      purchasePrice: "650",
      costPrice: "700",
      sellingPrice: "850",
      offerPrice: "799",
      taxPercent: "5",
      discountPercent: "6",
      stockQty: "120",
      minStock: "15",
      maxStock: "300",
      batchNo: "B2026-02",
      expiryDate: "2027-06-01",
      manufactureDate: "2026-01-15",
      supplier: "Local Supplier",
      manufacturer: "Ecommerce OS",
      weight: "500g",
      imageUrl: "https://example.com/honey.jpg",
      status: "active",
      featured: "yes",
      bestSeller: "yes",
      tags: "honey,natural",
      notes: "",
    },
    {
      ...emptyRow(),
      productName: "Turmeric Powder",
      sku: "KF-SPICE-001",
      barcode: "8801234567892",
      genericName: "হলুদ গুঁড়া",
      brand: "Ecommerce OS",
      category: "Spices",
      subcategory: "মশলা",
      description: "Fresh ground turmeric powder",
      unit: "pack",
      packSize: "200g",
      purchasePrice: "120",
      costPrice: "130",
      sellingPrice: "180",
      offerPrice: "165",
      taxPercent: "5",
      discountPercent: "8",
      stockQty: "80",
      minStock: "10",
      maxStock: "500",
      batchNo: "B2026-03",
      expiryDate: "2027-03-01",
      manufactureDate: "2026-02-01",
      supplier: "Local Supplier",
      manufacturer: "Ecommerce OS",
      weight: "200g",
      imageUrl: "https://example.com/turmeric.jpg",
      status: "active",
      featured: "no",
      bestSeller: "no",
      tags: "spice,turmeric",
      notes: "",
    },
  ];
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function getSampleCsvContent(): string {
  const headers = BULK_UPLOAD_COLUMNS.map((col) => col.label).join(",");
  const rows = getSampleRows().map((row) =>
    rowToValues(row).map(escapeCsvCell).join(",")
  );
  return [headers, ...rows].join("\n");
}

export function downloadProductBulkTemplate() {
  const headers = BULK_UPLOAD_COLUMNS.map((column) => column.label);
  const rows = getSampleRows().map(rowToValues);
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "product-bulk-upload-template.xlsx");
}

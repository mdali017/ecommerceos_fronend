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
  tags: string;
  notes: string;
}

export const BULK_UPLOAD_COLUMNS: { key: keyof BulkProductRow; label: string }[] = [
  { key: "productName", label: "Product Name" },
  { key: "sku", label: "SKU" },
  { key: "barcode", label: "Barcode" },
  { key: "genericName", label: "Generic Name" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "subcategory", label: "Subcategory" },
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
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
];

const HEADER_ALIASES: Record<string, keyof BulkProductRow> = {
  sku: "sku",
  barcode: "barcode",
  "product name": "productName",
  "generic name": "genericName",
  brand: "brand",
  category: "category",
  subcategory: "subcategory",
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
    tags: "",
    notes: "",
  };
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return String(value).trim();
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

export function getSampleCsvContent(): string {
  const headers = BULK_UPLOAD_COLUMNS.map((col) => col.label).join(",");
  const sample = [
    "Gawa Ghee 1kg",
    "KF-GHEE-001",
    "8801234567890",
    "Ghee",
    "Khaas Food",
    "Ghee",
    "Dairy",
    "Traditional cow ghee",
    "kg",
    "1",
    "1500",
    "1600",
    "1930",
    "1850",
    "5",
    "4",
    "45",
    "10",
    "200",
    "B2026-01",
    "2027-01-15",
    "2026-01-01",
    "Local Supplier",
    "Khaas Food",
    "1kg",
    "",
    "",
    "",
    "https://example.com/ghee.jpg",
    "active",
    "yes",
    "ghee,dairy",
    "Best seller",
  ].join(",");
  return `${headers}\n${sample}`;
}

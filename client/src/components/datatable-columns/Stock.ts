import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import type { Stock } from "@/z-schemas/StockShema";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { useProductsStore } from "../../stores/productsStore";
const productStore = useProductsStore();
await productStore.fetchProducts();

export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: "productId",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column: column,
        title: "Produit",
        searchable: true,
      }),
    cell: ({ row }) => {
      const product = productStore.products.find(
        (product) => product._id === row.original.productId
      );

      return product ? product.product_title : "Loading...";
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Quantité" }),
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: "operationType",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Type d'opération" }),
    cell: ({ row }) => row.original.operationType,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Créer le" }),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Modifier le" }),
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
  {
    id: "actions",
    header: () => h("span", "Actions"),
    cell: ({ row }) =>
      h(DataTableRowActionsComponent, {
        row,
        editRoute: "/admin/stocks/edit",
      }),
  },
];

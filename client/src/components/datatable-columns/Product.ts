import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductsStore } from "@/stores/productsStore";
import type { Product } from "@/z-schemas/ProductSchema";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
        class: "translate-y-0.5",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
        class: "translate-y-0.5",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product_title",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column: column,
        title: "Nom du produit",
        searchable: true,
      }),
    cell: ({ row }) => row.original.product_title,
    enableSorting: true,
  },
  {
    accessorKey: "product_category",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column: column,
        title: "Catégorie",
        searchable: true,
      }),
    cell: ({ row }) => row.original.product_category,
    enableSorting: true,
  },
  {
    accessorKey: "product_price",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Prix" }),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.original.product_price);
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
      return h("div", { class: "text-left font-medium" }, formatted);
    },
  },
  {
    accessorKey: "imageUrls",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Images" }),
    cell: ({ row }) => {
      const imageUrls = row.original.imageUrls;
      return h(
        "div",
        imageUrls.map((url: string) =>
          h("img", {
            src: url,
            alt: "Product Image",
            style:
              "width: 50px; height: 50px; object-fit: cover; margin-right: 5px;",
          })
        )
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => h("span", "Actions"),
    cell: ({ row }) =>
      h(DataTableRowActionsComponent, {
        row,
        viewRoute: "/admin/products/view",
        editRoute: "/admin/products/edit",
        deleteRoute: "/admin/products/delete",
        deleteFunction: async (id: string) => {
          const productStore = useProductsStore();
          await productStore.deleteProduct(id);
        },
      }),
  },
];

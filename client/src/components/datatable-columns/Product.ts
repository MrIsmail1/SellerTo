import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

/* import { labels, priorities, statuses } from "../data/data";
 */ import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/schemas/ProductSchema";
/* import DataTableRowActions from "./DataTableRowActions.vue"; */

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
    accessorKey: "Nom du produit",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Nom du produit" }),

    cell: ({ row }) => row.original.product_title,
    enableSorting: true,
  },
  {
    accessorKey: "Prix",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Prix" }),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.original.product_price);
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
];

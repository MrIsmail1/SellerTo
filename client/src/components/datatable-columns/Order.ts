import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import type { Order } from "@/z-schemas/OrderSchema";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import Checkbox from "../ui/checkbox/Checkbox.vue";

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "orderUnique",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column: column,
        title: "Commande",
        searchable: true,
      }),
    cell: ({ row }) => row.original.orderUnique,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Quantité" }),
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: "amount",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Montant" }),
    cell: ({ row }) => row.original.amount.toFixed(2),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Statut" }),
    cell: ({ row }) => row.original.status,
  },
  {
    accessorKey: "trackingCode",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Code Suivi" }),
    cell: ({ row }) => row.original.trackingCode,
  },
  /*  {
    id: "actions",
    header: () => h("span", "Actions"),
    cell: ({ row }) =>
      h(DataTableRowActionsComponent, {
        row,
        viewRoute: "/admin/orders/view",
        editRoute: "/admin/orders/edit",
      }),
  }, */
];

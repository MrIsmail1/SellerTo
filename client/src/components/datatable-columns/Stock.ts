import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import { useStockStore } from "@/stores/stockStore";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type {Stock} from "@/z-schemas/StockShema";

export const columns: ColumnDef<Stock>[] = [
    {
        accessorKey: "productId",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Produit ID" }),
        cell: ({ row }) => row.original.productId,
    },
    {
        accessorKey: "quantity",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Quantité"}),
        cell: ({ row }) => row.original.quantity,
    },
    {
        accessorKey: "operationType",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Type d\'opération" }),
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
                viewRoute: "/admin/stocks/view",
                editRoute: "/admin/stocks/edit",
                deleteRoute: "/admin/stocks/delete",
                deleteFunction: async (id: string) => {
                    const stockStore = useStockStore();
                    await stockStore.deleteStock(id);
                    if (stockStore.error) {
                        return { error: { status: 403 } };
                    }
                },
            }),
    },
];

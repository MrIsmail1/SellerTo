import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import { usePromoCodeStore } from "@/stores/promoCodeStore";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type {PromoCode} from "@/z-schemas/PromoCodeSchema";

export const columns: ColumnDef<PromoCode>[] = [
    {
        accessorKey: "code",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Nom code promo" }),
        cell: ({ row }) => row.original.code,
    },
    {
        accessorKey: "discount",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Pourcentage de réduction" }),
        cell: ({ row }) => row.original.discount,
    },
    {
        accessorKey: "expiry_date",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Date d'expiration" }),
        cell: ({ row }) => new Date(row.original.expiry_date).toLocaleDateString(),
    },
    {
        accessorKey: "product_id",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Produit ID" }),
        cell: ({ row }) => row.original.product_id,
    },
    {
        accessorKey: "category",
        header: ({ column }) =>
            h(DataTableColumnHeader, { column: column, title: "Catégorie" }),
        cell: ({ row }) => row.original.category,
    },
    {
        id: "actions",
        header: () => h("span", "Actions"),
        cell: ({ row }) =>
            h(DataTableRowActionsComponent, {
                row,
                viewRoute: "/admin/promocodes/view",
                editRoute: "/admin/promocodes/edit",
                deleteRoute: "/admin/promocodes/delete",
                deleteFunction: async (id: string) => {
                    const promoCodeStore = usePromoCodeStore();
                    await promoCodeStore.deletePromoCode(id);
                    if (promoCodeStore.error) {
                        return { error: { status: 403 } };
                    }
                },
            }),
    },
];

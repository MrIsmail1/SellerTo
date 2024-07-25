import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import { useProductsStore } from "@/stores/productsStore";
import { usePromoCodeStore } from "@/stores/promoCodeStore";
import type { PromoCode } from "@/z-schemas/PromoCodeSchema";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export async function getPromoCodeColumns(): Promise<ColumnDef<PromoCode>[]> {
    const productStore = useProductsStore();
    await productStore.fetchProducts();

    return [
        {
            accessorKey: "code",
            header: ({ column }) =>
                h(DataTableColumnHeader, {
                    column: column,
                    title: "Nom code promo",
                    searchable: true,
                }),
            cell: ({ row }) => row.original.code,
        },
        {
            accessorKey: "discount",
            header: ({ column }) =>
                h(DataTableColumnHeader, {
                    column: column,
                    title: "Pourcentage de réduction",
                }),
            cell: ({ row }) => row.original.discount,
        },
        {
            accessorKey: "expiry_date",
            header: ({ column }) =>
                h(DataTableColumnHeader, {
                    column: column,
                    title: "Date d'expiration",
                }),
            cell: ({ row }) =>
                new Date(row.original.expiry_date).toLocaleDateString(),
        },
        {
            accessorKey: "product_id",
            header: ({ column }) =>
                h(DataTableColumnHeader, {
                    column: column,
                    title: "Produit",
                    searchable: true,
                }),
            cell: ({ row }) => {
                const product = productStore.products.find(
                    (product) => product._id === row.original.product_id
                );

                return product ? product.product_title : "";
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) =>
                h(DataTableColumnHeader, {
                    column: column,
                    title: "Catégorie",
                    searchable: true,
                }),
            cell: ({ row }) => row.original.category,
        },
        {
            id: "actions",
            header: () => h("span", "Actions"),
            cell: ({ row }) =>
                h(DataTableRowActionsComponent, {
                    row,
                    deleteFunction: async (id: string) => {
                        const promoCodeStore = usePromoCodeStore();
                        await promoCodeStore.deletePromoCode(id);
                    },
                }),
        },
    ];
}
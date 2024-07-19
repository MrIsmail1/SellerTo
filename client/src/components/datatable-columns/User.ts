import DataTableColumnHeader from "@/components/common/DataTableColumnHeaderComponent.vue";
import DataTableRowActionsComponent from "@/components/common/DataTableRowActionsComponent.vue";
import { useUsersStore } from "@/stores/userStore";
import type { User } from "@/z-schemas/UserSchema";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Prénom" }),
    cell: ({ row }) => row.original.firstname,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Nom" }),
    cell: ({ row }) => row.original.lastname,
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Email" }),
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column: column, title: "Rôle" }),
    cell: ({ row }) => {
      return row.original.role;
    },
  },
  {
    id: "actions",
    header: () => h("span", "Actions"),
    cell: ({ row }) =>
      h(DataTableRowActionsComponent, {
        row,
        viewRoute: "/admin/users/view",
        editRoute: "/admin/users/edit",
        deleteRoute: "/admin/users/delete",
        deleteFunction: async (id: string) => {
          const userStore = useUsersStore();
          await userStore.deleteUser(id);
          if (userStore.error) {
            return { error: { status: 403 } };
          }
        },
      }),
  },
];

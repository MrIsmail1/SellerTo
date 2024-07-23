import { z } from "zod";

export const WidgetSchema = z.object({
  displayType: z.enum(["KPI", "Chart", "Tableau"], {
    errorMap: (issue, ctx) => {
      return {
        message:
          "Type d'affichage invalide. Les options valides sont 'KPI', 'Chart' et 'Tableau'.",
      };
    },
  }),
  chartType: z.enum(["Ligne", "Camembert"], {
    errorMap: (issue, ctx) => {
      return {
        message:
          "Type de graphique invalide. Les options valides sont 'Ligne' et 'Camembert'.",
      };
    },
  }),
  timeFrame: z.enum(
    ["-1h", "-12h", "-1d", "-1w", "-1m", "-3m", "-6m", "-1y", "-3y"],
    {
      errorMap: (issue, ctx) => {
        return {
          message:
            "Période de temps invalide. Les options valides sont '-1h', '-12h', '-1d', '-1w', '-1m', '-3m', '-6m', '-1y', et '-3y'.",
        };
      },
    }
  ),
  dataType: z.enum(
    [
      "count_products",
      "ca_product",
      "count_orders",
      "ca_orders",
      "count_users",
    ],
    {
      errorMap: (issue, ctx) => {
        return {
          message:
            "Type de données invalide. Les options valides sont 'Total produits', 'Chiffre d'affaire produit', 'Total commandes', 'Chiffre d'affaire commandes', et 'Total utilisateurs'.",
        };
      },
    }
  ),
});

export type Widget = z.infer<typeof WidgetSchema>;

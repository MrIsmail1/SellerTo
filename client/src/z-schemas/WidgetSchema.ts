import { z } from "zod";

export const WidgetSchema = z.object({
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
    ["Meilleur ventes", "Nombre de commandes", "Nouveaux clients", "Stock"],
    {
      errorMap: (issue, ctx) => {
        return {
          message:
            "Type de données invalide. Les options valides sont 'Meilleur ventes', 'Nombre de commandes', 'Stock' et 'Nouveaux clients'.",
        };
      },
    }
  ),
  displayMode: z.enum(["Carte", "Graphique simple"], {
    errorMap: (issue, ctx) => {
      return {
        message:
          "Type de données invalide. Les options valides sont 'Carte', 'Graphique simple'.",
      };
    },
  }),
});

export type Widget = z.infer<typeof WidgetSchema>;

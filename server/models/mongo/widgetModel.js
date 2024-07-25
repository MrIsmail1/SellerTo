import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
    {
        displayType: {
            type: String,
            required: true,
            enum: ["KPI", "Chart", "Tableau"],
        },
        chartType: {
            type: String,
            enum: ["Ligne", "Camembert"],
            required: function () {
                return this.displayType === "Chart";
            },
        },
        timeFrame: {
            type: String,
            required: true,
            enum: ["-1h", "-12h", "-1d", "-1w", "-1m", "-3m", "-6m", "-1y", "-3y"],
        },
        dataType: {
            type: String,
            required: true,
            enum: [
                "count_products",
                "ca_product",
                "count_orders",
                "ca_orders",
                "count_users",
            ],
        },
        selectedStep: {
            type: String,
            required: function () {
                return this.displayType === "Chart";
            },
        },
        selectedProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: function () {
                return this.dataType === "ca_product";
            },
        },
        data: {
            labels: [String],
            datasets: [
                {
                    label: String,
                    data: [Number],
                },
            ],
        },
        KPIdata: {
            type: Number,
        },
        x: {
            type: Number,
            required: true,
            default: 0,
        },
        y: {
            type: Number,
            required: true,
            default: 0,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Widget = mongoose.model("Widget", widgetSchema);

export default Widget;

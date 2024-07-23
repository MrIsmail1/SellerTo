import Widget from "../models/mongo/widgetModel.js";
import { calculateData } from "./orderController.js";

export const testCalculateData = async (req, res) => {
  try {
    const widget = req.body;
    const data = await calculateData(widget);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWidget = async (req, res) => {
  try {
    console.log(req.body);
    const widget = new Widget(req.body);
    await widget.save();
    res.status(201).json(widget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.status(200).json(widgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWidget = async (req, res) => {
  try {
    console.log(req.body);
    const widget = await Widget.findByIdAndUpdate(req.params.id, req.body);
    if (!widget) return res.status(404).json({ message: "Widget not found" });
    res.status(200).json(widget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWidget = async (req, res) => {
  try {
    const widget = await Widget.findByIdAndDelete(req.params.id);
    if (!widget) return res.status(404).json({ message: "Widget not found" });
    res.status(200).json({ message: "Widget deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Widget from "../models/mongo/widgetModel.js";

export const createWidget = async (req, res) => {
  try {
    const widgetData = {
      ...req.body,
      userId: req.user.id
    };

    const widget = new Widget(widgetData);
    await widget.save();
    res.status(201).json(widget);
  } catch (error) {
    res.sendStatus(400);
  }
};


export const getAllWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.status(200).json(widgets);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateWidget = async (req, res) => {
  try {
    const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!widget) return res.sendStatus(404);
    res.status(200).json(widget);
  } catch (error) {
    res.sendStatus(400);
  }
};

export const deleteWidget = async (req, res) => {
  try {
    const widget = await Widget.findByIdAndDelete(req.params.id);
    if (!widget) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

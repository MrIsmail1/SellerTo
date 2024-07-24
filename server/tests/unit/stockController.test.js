import { describe, expect, it, vi } from "vitest";
import * as stockController from "../../controllers/stockController.js";
import Products from "../../models/postgres/productModel.js";
import Stock from "../../models/postgres/stockModel.js";

vi.mock("../../models/postgres/stockModel.js");
vi.mock("../../models/postgres/productModel.js");

describe("Stock Controller", () => {
  describe("getAllStock", () => {
    it("should return all stock entries", async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStockEntries = [{ id: 1, quantity: 10, operationType: "ADD" }];
      Stock.findAll.mockResolvedValue(mockStockEntries);

      await stockController.getAllStock(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStockEntries);
    });
  });

  describe("createStock", () => {
    it("should create a new stock entry", async () => {
      const req = {
        body: {
          productId: 1,
          quantity: 10,
          operationType: "ADD",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockProduct = { id: 1 };
      Products.findByPk.mockResolvedValue(mockProduct);

      const mockStockEntry = { id: 1, ...req.body };
      Stock.create.mockResolvedValue(mockStockEntry);

      await stockController.createStock(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockStockEntry);
    });

    it("should return 400 if operationType is invalid", async () => {
      const req = {
        body: {
          productId: 1,
          quantity: 10,
          operationType: "INVALID",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await stockController.createStock(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if product not found", async () => {
      const req = {
        body: {
          productId: 1,
          quantity: 10,
          operationType: "ADD",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      Products.findByPk.mockResolvedValue(null);

      await stockController.createStock(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteStock", () => {
    it("should delete a stock entry", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStock = { id: 1, destroy: vi.fn() };
      Stock.findByPk.mockResolvedValue(mockStock);

      await stockController.deleteStock(req, res);

      expect(mockStock.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 404 if stock not found", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      Stock.findByPk.mockResolvedValue(null);

      await stockController.deleteStock(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateStock", () => {
    it("should update a stock entry", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 20,
          operationType: "REMOVE",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStock = { id: 1, save: vi.fn() };
      Stock.findByPk.mockResolvedValue(mockStock);

      const mockProduct = { id: 1 };
      Products.findByPk.mockResolvedValue(mockProduct);

      await stockController.updateStock(req, res);

      expect(mockStock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStock);
    });

    it("should return 400 if operationType is invalid", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 20,
          operationType: "INVALID",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await stockController.updateStock(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if stock not found", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 20,
          operationType: "REMOVE",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      Stock.findByPk.mockResolvedValue(null);

      await stockController.updateStock(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 404 if product not found", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 20,
          operationType: "REMOVE",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStock = { id: 1, save: vi.fn() };
      Stock.findByPk.mockResolvedValue(mockStock);

      Products.findByPk.mockResolvedValue(null);

      await stockController.updateStock(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("findStockById", () => {
    it("should return a stock entry by id", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStock = { id: 1, quantity: 10, operationType: "ADD" };
      Stock.findByPk.mockResolvedValue(mockStock);

      await stockController.findStockById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStock);
    });

    it("should return 404 if stock not found", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      Stock.findByPk.mockResolvedValue(null);

      await stockController.findStockById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("patchStock", () => {
    it("should patch a stock entry", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 15,
          operationType: "ADD",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockStock = { id: 1, save: vi.fn() };
      Stock.findByPk.mockResolvedValue(mockStock);

      const mockProduct = { id: 1 };
      Products.findByPk.mockResolvedValue(mockProduct);

      await stockController.patchStock(req, res);

      expect(mockStock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStock);
    });

    it("should return 404 if stock not found", async () => {
      const req = {
        params: { id: 1 },
        body: {
          productId: 1,
          quantity: 15,
          operationType: "ADD",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      Stock.findByPk.mockResolvedValue(null);

      await stockController.patchStock(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if operationType is invalid", async () => {
      const req = {
        params: { id: 1 },
        body: {
          operationType: "INVALID",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await stockController.patchStock(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

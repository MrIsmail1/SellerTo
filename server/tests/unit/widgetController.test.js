import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as widgetController from '../../controllers/widgetController.js';
import Widget from '../../models/mongo/widgetModel.js';
import { calculateData } from '../../controllers/orderController.js';

// Mock des modèles et des fonctions
vi.mock('../../models/mongo/widgetModel.js');
vi.mock('../../controllers/orderController.js');

describe('Widget Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('testCalculateData', () => {
        it('should calculate data and return it', async () => {
            const req = { body: { someData: 'data' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockData = { result: 'calculatedData' };
            calculateData.mockResolvedValue(mockData);

            await widgetController.testCalculateData(req, res);

            expect(calculateData).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('should return 500 if an error occurs', async () => {
            const req = { body: { someData: 'data' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockError = new Error('Something went wrong');
            calculateData.mockRejectedValue(mockError);

            await widgetController.testCalculateData(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('createWidget', () => {
        it('should create a new widget', async () => {
            const req = { body: { displayType: 'KPI', timeFrame: '-1d', dataType: 'count_products' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockWidget = new Widget(req.body);
            Widget.prototype.save.mockResolvedValue(mockWidget);

            await widgetController.createWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockWidget);
        });

        it('should return 400 if an error occurs', async () => {
            const req = { body: { displayType: 'KPI', timeFrame: '-1d', dataType: 'count_products' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockError = new Error('Validation error');
            Widget.prototype.save.mockRejectedValue(mockError);

            await widgetController.createWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('getAllWidgets', () => {
        it('should return all widgets', async () => {
            const req = {};
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockWidgets = [{ displayType: 'KPI', timeFrame: '-1d', dataType: 'count_products' }];
            Widget.find.mockResolvedValue(mockWidgets);

            await widgetController.getAllWidgets(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockWidgets);
        });

        it('should return 500 if an error occurs', async () => {
            const req = {};
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockError = new Error('Something went wrong');
            Widget.find.mockRejectedValue(mockError);

            await widgetController.getAllWidgets(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('updateWidget', () => {
        it('should update a widget', async () => {
            const req = { params: { id: '1' }, body: { displayType: 'Chart', chartType: 'Ligne' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockWidget = { displayType: 'KPI', save: vi.fn() };
            Widget.findByIdAndUpdate.mockResolvedValue(mockWidget);

            await widgetController.updateWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockWidget);
        });

        it('should return 404 if widget not found', async () => {
            const req = { params: { id: '1' }, body: { displayType: 'Chart', chartType: 'Ligne' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            Widget.findByIdAndUpdate.mockResolvedValue(null);

            await widgetController.updateWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Widget not found' });
        });

        it('should return 400 if an error occurs', async () => {
            const req = { params: { id: '1' }, body: { displayType: 'Chart', chartType: 'Ligne' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockError = new Error('Validation error');
            Widget.findByIdAndUpdate.mockRejectedValue(mockError);

            await widgetController.updateWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('deleteWidget', () => {
        it('should delete a widget', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockWidget = { displayType: 'KPI', remove: vi.fn() };
            Widget.findByIdAndDelete.mockResolvedValue(mockWidget);

            await widgetController.deleteWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Widget deleted' });
        });

        it('should return 404 if widget not found', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            Widget.findByIdAndDelete.mockResolvedValue(null);

            await widgetController.deleteWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Widget not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const mockError = new Error('Something went wrong');
            Widget.findByIdAndDelete.mockRejectedValue(mockError);

            await widgetController.deleteWidget(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });
});

// tests/unit/userAlertController.test.js

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addUserAlert, getAlertsByUserId, getAlertsByUserIdAndProductId, getAlertsByUserIdAndCategory, updateUserAlerts } from '../../controllers/userAlertController';
import UserAlert from '../../models/postgres/userAlertsModel';

vi.mock('../../models/postgres/userAlertsModel');

describe('User Alert Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addUserAlert', () => {
        it('should create a new user alert', async () => {
            const req = {
                body: {
                    userId: 1,
                    alertId: 1,
                    productId: 1,
                    category: 'Electronics'
                }
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
            UserAlert.create.mockResolvedValue(req.body);

            await addUserAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should return 400 if userId or alertId is missing', async () => {
            const req = {
                body: {
                    productId: 1,
                    category: 'Electronics'
                }
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn()
            };

            await addUserAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on error', async () => {
            const req = {
                body: {
                    userId: 1,
                    alertId: 1,
                    productId: 1,
                    category: 'Electronics'
                }
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn()
            };
            UserAlert.create.mockRejectedValue(new Error('Database Error'));

            await addUserAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAlertsByUserId', () => {
        it('should return user alerts by userId', async () => {
            const req = {
                params: {
                    userId: 1
                }
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
            UserAlert.findAll.mockResolvedValue([{ userId: 1, alertId: 1 }]);

            await getAlertsByUserId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ userId: 1, alertId: 1 }]);
        });

        it('should return 500 on error', async () => {
            const req = {
                params: {
                    userId: 1
                }
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn()
            };
            UserAlert.findAll.mockRejectedValue(new Error('Database Error'));

            await getAlertsByUserId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateUserAlerts', () => {
        it('should update user alerts', async () => {
            const req = {
                body: [
                    {
                        userId: 1,
                        alertId: 1,
                        productId: 1,
                        category: 'Electronics',
                        isActive: false
                    }
                ]
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn()
            };
            UserAlert.findOrCreate.mockResolvedValue([{ isActive: true }, false]);
            UserAlert.prototype.save = vi.fn().mockResolvedValue({});

            await updateUserAlerts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            const req = {
                body: [
                    {
                        userId: 1,
                        alertId: 1,
                        productId: 1,
                        category: 'Electronics',
                        isActive: false
                    }
                ]
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn()
            };
            UserAlert.findOrCreate.mockRejectedValue(new Error('Database Error'));

            await updateUserAlerts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});

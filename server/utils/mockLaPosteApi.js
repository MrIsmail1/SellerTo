import express from 'express';
import Orders from '../models/postgres/orderModel.js';

const app = express();
const port = 3001;

app.get('/suivi/v2/idships/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Orders.findOne({ where: { trackingCode: id } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const trackingData = {
            "lang": "fr_FR",
            "scope": "open",
            "returnCode": 200,
            "shipment": {
                "holder": 1,
                "idShip": id,
                "product": order.productName,
                "isFinal": order.status === "Courrier distribué",
                "entryDate": order.createdAt,
                "event": [
                    {
                        "date": order.updatedAt,
                        "label": order.status,
                        "code": "AG1"
                    }
                ],
                "timeline": [
                    {
                        "id": 1,
                        "shortLabel": "Pris en charge par La Poste",
                            "status": order.status !== "Paiement validé, colis pris en charge par La Poste",
                        "type": 1
                    },
                    {
                        "id": 2,
                        "shortLabel": "En cours d'acheminement",
                        "status": order.status === "En cours d'acheminement",
                        "type": 1
                    },
                    {
                        "id": 3,
                        "shortLabel": "Arrivé sur le site de distribution",
                        "status": order.status === "Arrivé sur le site de distribution",
                        "type": 1
                    },
                    {
                        "id": 4,
                        "shortLabel": "A disposition en point de retrait",
                        "status": order.status === "A disposition en point de retrait",
                        "type": 1
                    },
                    {
                        "id": 5,
                        "shortLabel": "Courrier distribué",
                        "status": order.status === "Courrier distribué",
                        "type": 1
                    }
                ]
            }
        };

        res.json(trackingData);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        res.status(500).json({ message: 'An error occurred while fetching tracking data.', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Mock La Poste API écoute sur http://localhost:${port}`);
});

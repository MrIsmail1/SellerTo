import express from 'express';
const app = express();
const port = 3001;

const generateMockTrackingData = (idShip, productName) => ({
    "lang": "fr_FR",
    "scope": "open",
    "returnCode": 200,
    "shipment": {
        "holder": 1,
        "idShip": idShip,
        "product": productName,
        "isFinal": false,
        "entryDate": "2023-06-17T00:00:00+02:00",
        "event": [
            {
                "date": "2023-06-20T00:00:00+02:00",
                "label": "Votre courrier est disponible en point de retrait. Il y sera conservé pendant 15 jours et sera remis au destinataire sur présentation d'une pièce d'identité.",
                "code": "AG1"
            },
            {
                "date": "2023-06-18T00:00:00+02:00",
                "label": "Votre courrier est arrivé dans le site en vue de sa distribution.",
                "code": "ET1"
            },
            {
                "date": "2023-06-17T00:00:00+02:00",
                "label": "Votre courrier a été remis à La Poste par l'expéditeur.",
                "code": "PC1"
            }
        ],
        "timeline": [
            {
                "id": 1,
                "shortLabel": "Pris en charge par La Poste",
                "date": "2023-06-17T00:00:00+02:00",
                "status": true,
                "type": 1
            },
            {
                "id": 2,
                "shortLabel": "En cours d'acheminement",
                "status": true,
                "type": 1
            },
            {
                "id": 3,
                "shortLabel": "Arrivé sur le site de distribution",
                "status": true,
                "type": 1
            },
            {
                "id": 4,
                "shortLabel": "A disposition en point de retrait",
                "status": true,
                "type": 1
            },
            {
                "id": 5,
                "shortLabel": "Courrier distribué",
                "status": false,
                "type": 1
            }
        ]
    }
});

app.get('/suivi/v2/idships/:id', (req, res) => {
    const { id } = req.params;
    const trackingData = generateMockTrackingData(id);
    res.json(trackingData);
});

app.listen(port, () => {
    console.log(`Mock La Poste API écoute sur http://localhost:${port}`);
});

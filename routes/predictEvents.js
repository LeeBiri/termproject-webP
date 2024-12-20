const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const PredictEvents = require('../models/predictEvents')

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    try {
        const predictEvents = new PredictEvents(req.body);
        await predictEvents.save(); 
        res.status(201).send(predictEvents);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const predictEvents = await PredictEvents.find();
        res.status(200).send(predictEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/:startDate/:endDate', async (req, res) => {
    const { startDate, endDate } = req.params;

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const predictEvents = await PredictEvents.find({
            date: {
                $gte: start,
                $lte: end
            }
        });

        if (predictEvents.length === 0) {
            return res.status(404).send();
        }

        res.status(200).send(predictEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:minLat/:maxLat/:minLon/:maxLon', async (req, res) => {
    const { minLat, maxLat, minLon, maxLon } = req.params;

    try {
        const minLatitude = parseFloat(minLat);
        const maxLatitude = parseFloat(maxLat);
        const minLongitude = parseFloat(minLon);
        const maxLongitude = parseFloat(maxLon);

        const predictEvents = await PredictEvents.find({
            latitude: {
                $gte: minLatitude,
                $lte: maxLatitude
            },
            longitude: {
                $gte: minLongitude,
                $lte: maxLongitude
            }
        });

        if (predictEvents.length === 0) {
            return res.status(404).send();
        }

        res.status(200).send(predictEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const predictEvents = await PredictEvents.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!predictEvents) {
            return res.status(404).send();
        }
        res.status(200).send(predictEvents);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const predictEvents = await PredictEvents.findByIdAndDelete(req.params.id);
        if (!predictEvents) {
            return res.status(404).send();
        }
        res.status(200).send(predictEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 

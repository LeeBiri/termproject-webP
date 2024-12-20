const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const MeteorShower = require('../models/meteorShower')

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    try {
        const meteorShower = new MeteorShower(req.body);
        await meteorShower.save();
        res.status(201).send(meteorShower);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.get('/', async (req, res) => {
    try {
        const meteorShower = await MeteorShower.find();
        res.status(200).send(meteorShower);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const meteorShower = await MeteorShower.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!meteorShower) {
            return res.status(404).send();
        }
        res.status(200).send(meteorShower);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const meteorShower = await MeteorShower.findByIdAndDelete(req.params.id);
        if (!meteorShower) {
            return res.status(404).send();
        }
        res.status(200).send(meteorShower);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 

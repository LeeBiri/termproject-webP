const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Comets = require('../models/comets')

router.use(bodyParser.json());

router.post('/', async (req, res) => {
    try {
        const comets = new Comets(req.body);
        await comets.save(); 
        res.status(201).send(comets);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const comets = await Comets.find();
        res.status(200).send(comets);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const comets = await Comets.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comets) {
            return res.status(404).send();
        }
        res.status(200).send(comets);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const comets = await Comets.findByIdAndDelete(req.params.id);
        if (!comets) {
            return res.status(404).send();
        }
        res.status(200).send(comets);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 

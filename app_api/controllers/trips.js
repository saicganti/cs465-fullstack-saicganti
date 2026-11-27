// File: app_api/controllers/trips.js (Defensive Validation Segment)
const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;

const tripsFindByCode = async (req, res) => {
    const tripCode = req.params.tripCode;

    if (!isNonEmptyString(tripCode)) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'A valid tripCode parameter is required.'
        });
    }

    const q = await Model.find({ code: tripCode.trim() }).exec();

    if (!q || q.length === 0) {
        return res.status(404).json({ err: 'No trips found' });
    }

    return res.status(200).json(q);
};

const tripsAddTrip = async (req, res) => {
    const { code, name, length, start, resort, perPerson, image, description } = req.body;

    if (
        !isNonEmptyString(code) ||
        !isNonEmptyString(name) ||
        !isNonEmptyString(length) ||
        !start ||
        !isNonEmptyString(resort) ||
        !isNonEmptyString(perPerson) ||
        !isNonEmptyString(image) ||
        !isNonEmptyString(description)
    ) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'All trip fields (code, name, length, start, resort, perPerson, image, description) are required.'
        });
    }

    const parsedStart = new Date(start);
    if (Number.isNaN(parsedStart.getTime())) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'The start field must be a valid date.'
        });
    }

    const newTrip = new Trip({
        code: code.trim(),
        name: name.trim(),
        length: length.trim(),
        start: parsedStart,
        resort: resort.trim(),
        perPerson: perPerson.trim(),
        image: image.trim(),
        description: description.trim()
    });

    const q = await newTrip.save();
    if (!q) {
        return res.status(400).json({ err: 'Failed to add trip' });
    }

    return res.status(201).json(q);
};

const tripsUpdateTrip = async (req, res) => {
    const tripCode = req.params.tripCode;
    const { code, name, length, start, resort, perPerson, image, description } = req.body;

    if (!isNonEmptyString(tripCode)) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'A valid tripCode route parameter is required.'
        });
    }

    const updateFields = {};
    if (code !== undefined) {
        if (!isNonEmptyString(code)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid code.' });
        updateFields.code = code.trim();
    }
    if (name !== undefined) {
        if (!isNonEmptyString(name)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid name.' });
        updateFields.name = name.trim();
    }
    if (length !== undefined) {
        if (!isNonEmptyString(length)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid length.' });
        updateFields.length = length.trim();
    }
    if (start !== undefined) {
        const parsedStart = new Date(start);
        if (Number.isNaN(parsedStart.getTime())) return res.status(400).json({ error: 'Validation Error', message: 'Invalid start date.' });
        updateFields.start = parsedStart;
    }
    if (resort !== undefined) {
        if (!isNonEmptyString(resort)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid resort.' });
        updateFields.resort = resort.trim();
    }
    if (perPerson !== undefined) {
        if (!isNonEmptyString(perPerson)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid perPerson value.' });
        updateFields.perPerson = perPerson.trim();
    }
    if (image !== undefined) {
        if (!isNonEmptyString(image)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid image.' });
        updateFields.image = image.trim();
    }
    if (description !== undefined) {
        if (!isNonEmptyString(description)) return res.status(400).json({ error: 'Validation Error', message: 'Invalid description.' });
        updateFields.description = description.trim();
    }

    const q = await Model.findOneAndUpdate(
        { code: tripCode.trim() },
        updateFields,
        { new: true, runValidators: true }
    ).exec();

    if (!q) {
        return res.status(404).json({ err: 'Trip not found' });
    }

    return res.status(200).json(q);
};


const tripsRecommended = async (req, res) => {
    try {
        const rawTags = typeof req.query.tags === 'string' ? req.query.tags : '';
        const preferredTags = rawTags
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);

        const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;
        if (maxPrice !== null && (Number.isNaN(maxPrice) || maxPrice < 0)) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'maxPrice must be a non-negative number.'
            });
        }

        const matchStage = { isActive: true };
        if (maxPrice !== null) {
            matchStage.numericPrice = { $lte: maxPrice };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $addFields: {
                    similarityScore: {
                        $size: {
                            $setIntersection: [{ $ifNull: ['$tags', []] }, preferredTags]
                        }
                    }
                }
            },
            { $sort: { similarityScore: -1, numericPrice: 1 } },
            { $limit: 5 }
        ];

        const results = await Model.aggregate(pipeline).exec();
        return res.status(200).json(results);
    } catch (err) {
        return handleDatabaseError(res, err, 'generate trip recommendations');
    }
};

console.log(q);

const handleDatabaseError = (res, err, actionContext) => {
    console.error(`[Trips Controller Error] Failed to ${actionContext}:`, err);

    if (err && err.code === 11000) {
        return res.status(409).json({
            error: 'Conflict',
            message: `A trip with that unique identifier already exists while attempting to ${actionContext}.`
        });
    }

    if (err && err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }

    if (err && err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid Parameter',
            message: `Invalid value provided for field '${err.path}'.`
        });
    }

    if (
        err &&
        (err.name === 'MongooseServerSelectionError' ||
            err.name === 'MongoNetworkError' ||
            err.name === 'MongoTimeoutError')
    ) {
        return res.status(503).json({
            error: 'Service Unavailable',
            message: `Database connection unavailable or timed out while trying to ${actionContext}.`
        });
    }

    return res.status(500).json({
        error: 'Internal Server Error',
        message: `An unexpected error occurred while trying to ${actionContext}.`
    });
};

const tripsList = async (req, res) => {
    try {
        const q = await Model.find({}).exec();

        if (!q || q.length === 0) {
            return res.status(404).json({ err: 'No trips found' });
        }

        return res.status(200).json(q);
    } catch (err) {
        return handleDatabaseError(res, err, 'retrieve trips list');
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsRecommended
};
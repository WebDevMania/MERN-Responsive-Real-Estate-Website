const verifyToken = require('../middlewares/verifyToken')
const Yacht = require('../models/Yacht')
const User = require('../models/User')
const yachtController = require('express').Router()

// get all
yachtController.get('/getAll', async (req, res) => {
    try {
        const yachts = await Yacht.find({})

        return res.status(200).json(yachts)
    } catch (error) {
        console.error(error)
    }
})

// fetch my yachts
yachtController.get('/find/my-yachts', verifyToken, async (req, res) => {
    try {
        const yachts = await Yacht.find({ currentOwner: req.user.id })

        return res.status(200).json(yachts)
    } catch (error) {
        console.error(error)
    }
})

// fetch bookmarked yachts
yachtController.get('/find/bookmarked-yachts', verifyToken, async (req, res) => {
    try {
        const yachts = await Yacht.find({ bookmarkedUsers: { $in: [req.user.id] } })

        return res.status(200).json(yachts)
    } catch (error) {
        console.error(error)
    }
})

// get one
yachtController.get('/find/:id', async (req, res) => {
    try {
        const yacht = await Yacht.findById(req.params.id).populate('currentOwner', '-password')

        if (!yacht) {
            throw new Error('No such yacht with that id')
        } else {
            return res.status(200).json(yacht)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})


// create yacht
yachtController.post('/', verifyToken, async (req, res) => {
    try {
        const newYacht = await Yacht.create({ ...req.body, currentOwner: req.user.id })

        return res.status(201).json(newYacht)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// update estate
yachtController.put('/:id', verifyToken, async (req, res) => {
    try {
        const yacht = await Yacht.findById(req.params.id)
        if (yacht.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to update other people's yachts")
        }

        const updatedYacht = await Yacht.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )


        return res.status(200).json(updatedYacht)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// bookmark/unbookmark estate
yachtController.put('/bookmark/:id', verifyToken, async (req, res) => {
    try {
        let yacht = await Yacht.findById(req.params.id)
        if (yacht.currentOwner.toString() === req.user.id) {
            throw new Error("You are not allowed to bookmark your project")
        }


        if (yacht.bookmarkedUsers.includes(req.user.id)) {
            yacht.bookmarkedUsers = yacht.bookmarkedUsers.filter(id => id !== req.user.id)
            await yacht.save()
        } else {
            yacht.bookmarkedUsers.push(req.user.id)

            await yacht.save()
        }

        return res.status(200).json(yacht)
    } catch (error) {
        return res.status(500).json(error)
    }
})


// delete estate
yachtController.delete('/:id', verifyToken, async (req, res) => {
    try {
        const yacht = await Yacht.findById(req.params.id)
        if (yacht.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to delete other people properties")
        }

        await yacht.delete()

        return res.status(200).json({ msg: "Successfully deleted yacht" })
    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = yachtController
import Gig from "../models/Gig.js";

export async function getGigs(req, res) {
    try {
        const { search } = req.query;

        const query = {
            status: "open",
        };

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const gigs = await Gig.find(query)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export async function getGig(req, res) {
    try {
        const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found",
            });
        }

        res.status(200).json({
            success: true,
            gig,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export async function createGig(req, res) {
    try {
        const { title, description, budget } = req.body;
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user.id,
            
        });
        res.status(201).json({
            success: true,
            data: gig
        });
    } catch (error) {

    }
}
export async function updateGig(req, res) {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(400).json({
                success: false,
                message: "Gig not found",
            });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Not authorized to update this gig",
            });
        }

        if (gig.status === "assigned") {
            return res.status(400).json({
                success: false,
                message: "Assigned gig cannot be updated",
            });
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            gig: updatedGig,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export async function deleteGig(req, res) {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }
        if (gig.ownerId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this gig'
            });
        }

        await gig.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Gig deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getMyGigs(req, res) {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
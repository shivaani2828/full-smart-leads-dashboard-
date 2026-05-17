import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";
import { io } from "../server.js";

export async function createBid(req, res) {
    try {
        const { gigId, message, price } = req.body;
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }
        if (gig.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'gig is not open'
            });
        }
        if (gig.ownerId.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'you cannot bid on your own gig'
            });
        }
        const existingBid = await Bid.findOne({
            gigId,
            freelancerId: req.user.id
        });

        if (existingBid) {
            return res.status(400).json({
                success: false,
                message: 'you have already submitted a bid for this gig'
            });
        }
        const bid = await Bid.create({
            gigId,
            freelancerId: req.user.id,
            message,
            price
        });

        const populatedBid = await Bid.findById(bid._id)
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title');

        res.status(201).json({
            success: true,
            data: populatedBid
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getBidsofGig(req, res) {
    try {
        const { gigId } = req.params;
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'gig not found'
            });
        }
        if (gig.ownerId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'not authorized to view bids for this gig'
            });
        }

        const bids = await Bid.find({ gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export async function hireBid(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;
        const bid = await Bid.findById(bidId).populate('gigId').session(session)
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Bid not found'
            });
        }
        const gig = bid.gigId;
        if (gig.ownerId.toString() !== req.user.id) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: 'Not authorized to hire for this gig'
            });
        }
        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'This gig has already been assigned'
            });
        }
        await Gig.findByIdAndUpdate(
            gig._id,
            {
                status: 'assigned',
                assignedTo: bid.freelancerId
            },
            { session }
        );
        await Bid.findByIdAndUpdate(
            bidId,
            { status: 'hired' },
            { session }
        );
        await Bid.updateMany(
            {
                gigId: gig._id,
                _id: { $ne: bidId }
            },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        io.to(bid.freelancerId.toString()).emit("hired", {
            gigTitle: gig.title,
            gigId: gig._id,
        });

        const updatedBid = await Bid.findById(bidId)
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title description budget');

        res.status(200).json({
            success: true,
            message: 'Freelancer hired successfully',
            data: updatedBid
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export async function getMyBids(req, res) {
    try {
        const bids = await Bid.find({ freelancerId: req.user.id })
            .populate('gigId', 'title description budget status')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export async function deleteBid(req, res) {
    try {
        const bid = await Bid.findById(req.params.bidId);

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found'
            });
        }
        if (bid.freelancerId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this bid'
            });
        }
        if (bid.status === 'hired') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a hired bid'
            });
        }

        await bid.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Bid deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

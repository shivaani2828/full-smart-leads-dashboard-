import express from 'express'
import {createBid,getBidsofGig,hireBid,getMyBids,deleteBid} from '../controllers/bid.controller.js'
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, createBid);
router.get('/my-bids', auth, getMyBids);
router.get('/:gigId', auth, getBidsofGig);
router.patch('/:bidId/hire', auth, hireBid);
router.delete('/:bidId', auth, deleteBid);

export default router
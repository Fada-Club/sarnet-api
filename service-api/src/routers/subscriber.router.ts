import express from "express"

import {isOwner} from "../middleware/index.js"
import { getAllSubscribers, getSubscriber, getSubscriberByEmail, getSubscriberByEmailAuth, updateSubscriber } from "../controllers/subscriber.controller.js";


const router = express.Router();

//@ts-ignore
router.route('/getSubscribers').get(getAllSubscribers);
//@ts-ignore
router.route('/getSubscriber/:id').get(isOwner, getSubscriber);
//@ts-ignore
router.route('/updateSubscriber/:id').patch(isOwner, updateSubscriber);
//@ts-ignore
router.route('/getSubscriberByEmailAuth/:email').get(getSubscriberByEmailAuth);
//@ts-ignore
router.route('/getSubscriberByEmail/:email').get(getSubscriberByEmail);


export default router;




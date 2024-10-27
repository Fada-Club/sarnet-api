import express from "express"

import {isOwner} from "../middleware/index.js"
import { getAllSubscribers } from "../controllers/subscriber.controller.js";
import { createNewSubscription, deleteSubscription, getSubscription, getSubscriptionsBySubscriberId, updateSubscription } from "../controllers/subscription.controller.js";


const router = express.Router();

//@ts-ignore
router.route('/getSubscriptions').get(getAllSubscribers);
//@ts-ignore
router.route('/getSubscription/:id').get(getSubscription);
//@ts-ignore
router.route('/getSubscriptionsBySubscriberId/:id').get(isOwner, getSubscriptionsBySubscriberId);
//@ts-ignore
router.route('/createNewSubscription').post(createNewSubscription);
//@ts-ignore
router.route('/deleteSubscription/:id').delete(isOwner, deleteSubscription);
//@ts-ignore
router.route('/updateSubscription/:id').patch(isOwner, updateSubscription);

export default router;
import express from "express"


const router = express.Router();

//@ts-ignore
router.route('/getData').get(getData);
//@ts-ignore
router.route('/getDataByCoordinates').get(getDataByCoordinates);
//@ts-ignore
router.route('/addData').get(addData);
//@ts-ignore
router.route('/updateData').get(updateData);
//@ts-ignore
router.route('/deleteData').get(deleteData);


export default router;
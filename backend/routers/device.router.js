import express from 'express';
import {getAllMyDevices, registerNewDevice, updateDevice, deviceSelfCheck, getOnlineStatusCount, updateDevicePassword, unlockRiderDevice, unlockOwnerDevice} from '../controllers/device.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.get("/all", userAuthentication, getAllMyDevices);
router.get("/status-count", userAuthentication, getOnlineStatusCount);
router.post("/self-check", deviceSelfCheck);
router.post("/register", userAuthentication, registerNewDevice);
router.put("/update/:id", userAuthentication, updateDevice);
router.put("/change-unlock-password/:id", userAuthentication, updateDevicePassword);
router.put("/rider-unlock/", userAuthentication, unlockRiderDevice);
router.put("/owner-unlock/", userAuthentication, unlockOwnerDevice);

export default router;
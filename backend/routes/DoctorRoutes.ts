import { Router, Request, Response } from "express";
import DoctorProfile from "../models/doctor/DoctorProfile";
const router = Router();
router.get("/profiles", async (req: Request, res: Response) => {
  try {
    const profiles = await DoctorProfile.find();
    res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});
router.get("/:userId/profile", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = await DoctorProfile.findOne({ userId }).populate("");
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }
    res.json({
      success: true,
      data: profile,
    });
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});
export default router;

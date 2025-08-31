import { Router, Request, Response } from "express";
import PatientProfile from "../models/patient/PatientProfile";
import Appointment from "../models/patient/Appointment";
import MedicalRecord from "../models/patient/MedicalRecord";
const router = Router();
router.get("/:userId/profile", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(userId, "uuuuuuuuuuuuuuuuu");
    const profile = await PatientProfile.findOne({ userId }).populate("");
    console.log(profile, "ppppppppppppp");
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
router.get("/profiles", async (req: Request, res: Response) => {
  try {
    const profiles = await PatientProfile.find();
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
router.get("/:userId/appointments", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const patientProfile = await PatientProfile.findOne({ userId });
    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }
    const appointments = await Appointment.find({
      patientId: patientProfile._id,
    })
      .populate("doctorId", "specialization experience")
      .sort({ date: -1 });
    res.json({
      success: true,
      data: appointments,
    });
  } catch (err: any) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
});
router.get("/:userId/records", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const patientProfile = await PatientProfile.findOne({ userId });
    if (!patientProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }
    const records = await MedicalRecord.find({ patientId: patientProfile._id })
      .populate("doctorId", "name specialization")
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching medical records" });
  }
});
export default router;

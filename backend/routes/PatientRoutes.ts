import express, { Request, Response } from "express";
import Patient from "../models/Patient";
const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      Patient.find().skip(skip).limit(limit),
      Patient.countDocuments(),
    ]);
    res.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err: any) {
    console.error("Error fetching patients:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "assignedDoctor",
      "name specialization"
    );
    if (!patient)
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    res.json({ success: true, data: patient });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.post("/", async (req: Request, res: Response) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Invalid data",
      error: err.message,
    });
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient)
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    res.json({ success: true, data: patient });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient)
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    res.json({ success: true, message: "Patient deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});
export default router;

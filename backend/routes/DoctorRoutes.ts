import express, { Request, Response } from "express";
import Doctor from "../models/Doctor";
const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filters: any = { isDeleted: false };
    if (req.query.status) filters.status = req.query.status;
    if (req.query.department) filters.department = req.query.department;
    if (req.query.specialization)
      filters.specialization = { $in: req.query.specialization };
    const total = await Doctor.countDocuments(filters);
    const doctors = await Doctor.find(filters)
      .populate("assignedPatients", "name age gender")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("Error fetching doctors:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "assignedPatients",
      "name age gender"
    );
    if (!doctor || doctor.isDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.post("/", async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      specialization: req.body.specialization || [],
      department: req.body.department,
      experience: req.body.experience,
      licenseNumber: req.body.licenseNumber,
      licenseExpiry: req.body.licenseExpiry,
      photo: req.body.photo,
      availability: req.body.availability || [],
      status: req.body.status || "pending",
      documents: req.body.documents || [],
      assignedPatients: req.body.assignedPatients || [],
      ratings: req.body.ratings || [],
      languages: req.body.languages || [],
      consultationFee: req.body.consultationFee,
      hospitalAffiliation: req.body.hospitalAffiliation,
    });
    res.status(201).json({ success: true, data: doctor });
  } catch (err: any) {
    console.error("Error creating doctor:", err.message);
    res.status(400).json({
      success: false,
      message: "Invalid data",
      error: err.message,
    });
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!doctor || doctor.isDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (err: any) {
    console.error("Error updating doctor:", err.message);
    res.status(400).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
});
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!doctor || doctor.isDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (err: any) {
    console.error("Error updating status:", err.message);
    res.status(400).json({
      success: false,
      message: "Status update failed",
      error: err.message,
    });
  }
});
router.patch("/:id/availability", async (req: Request, res: Response) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!doctor || doctor.isDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (err: any) {
    console.error("Error updating availability:", err.message);
    res.status(400).json({
      success: false,
      message: "Availability update failed",
      error: err.message,
    });
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.body.deletedBy || "admin",
      },
      { new: true }
    );
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    res.json({
      success: true,
      message: "Doctor marked as deleted",
      data: doctor,
    });
  } catch (err: any) {
    console.error("Error deleting doctor:", err.message);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});
export default router;

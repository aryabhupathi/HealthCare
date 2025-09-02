import express from "express";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const {
      status,
      doctorId,
      patientId,
      date,
      page = 1,
      limit = 10,
      sortBy = "date",
      order = "asc",
    } = req.query;
    const query: any = {};
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (date) query.date = date;
    let sort: any = {};
    if (sortBy === "doctorName") {
      sort = {};
    } else {
      sort[sortBy as string] = order === "desc" ? -1 : 1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    let appointments = await Appointment.find(query)
      .populate("doctorId", "name specialization department")
      .populate("patientId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    if (sortBy === "doctorName") {
      appointments = appointments.sort((a: any, b: any) => {
        const nameA = a.doctorId?.name?.toLowerCase() || "";
        const nameB = b.doctorId?.name?.toLowerCase() || "";
        return order === "desc"
          ? nameB.localeCompare(nameA)
          : nameA.localeCompare(nameB);
      });
    }
    const total = await Appointment.countDocuments(query);
    res.json({
      data: appointments,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { doctorId, patientId, date, slot } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    const existing = await Appointment.findOne({
      doctorId,
      date,
      "slot.start": slot.start,
      "slot.end": slot.end,
      status: { $in: ["pending", "confirmed"] },
    });
    if (existing) {
      return res.status(400).json({ error: "Slot already booked" });
    }
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      slot,
      status: "pending",
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to book appointment" });
  }
});
router.get("/available-slots/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    const dayName = new Date(date as string).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const availability = doctor.availability.find(
      (a: any) => a.day === dayName
    );
    if (!availability) return res.json([]);
    const availableSlots: { start: string; end: string }[] = [];
    availability.slots.forEach((slot: any) => {
      let startTime = new Date(`${date}T${slot.start}`);
      const endTime = new Date(`${date}T${slot.end}`);
      while (
        startTime.getTime() + doctor.consultationDuration * 60000 <=
        endTime.getTime()
      ) {
        const endSlot = new Date(
          startTime.getTime() + doctor.consultationDuration * 60000
        );
        availableSlots.push({
          start: startTime.toTimeString().slice(0, 5),
          end: endSlot.toTimeString().slice(0, 5),
        });
        startTime = new Date(endSlot.getTime() + doctor.bufferTime * 60000);
      }
    });
    const booked = await Appointment.find({
      doctorId,
      date,
      status: { $in: ["pending", "confirmed"] },
    });
    const bookedSlots = booked.map((a) => `${a.slot.start}-${a.slot.end}`);
    const freeSlots = availableSlots.filter(
      (s) => !bookedSlots.includes(`${s.start}-${s.end}`)
    );
    res.json(freeSlots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to update appointment status" });
  }
});
router.put("/:id/reschedule", async (req, res) => {
  try {
    const { date, slot } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    const existing = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date,
      "slot.start": slot.start,
      "slot.end": slot.end,
      status: { $in: ["pending", "confirmed"] },
    });
    if (existing) return res.status(400).json({ error: "Slot already booked" });
    appointment.date = date;
    appointment.slot = slot;
    appointment.status = "rescheduled";
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to reschedule appointment" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    res.status(400).json({ error: "Failed to cancel appointment" });
  }
});
export default router;

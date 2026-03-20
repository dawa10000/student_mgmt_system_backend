import Student from "../models/Student.js";
import fs from 'fs';


export const getStudents = async (req, res) => {
  try {

    const excludeFields = ["sort", "page", "limit", "search", "skip", "fields"];
    const queryObj = { ...req.query };
    excludeFields.forEach((field) => delete queryObj[field]);

    let filter = { ...queryObj };


    if (req.query.search) {
      const searchValue = req.query.search.trim();
      const safeValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex special chars

      filter = {
        $or: [
          { name: { $regex: safeValue, $options: "i" } },
          { email: { $regex: safeValue, $options: "i" } },
          { courseEnrolled: { $regex: safeValue, $options: "i" } }
        ]
      };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find(filter).skip(skip).limit(limit);
    const totalStudent = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudent / limit)

    return res.status(200).json({ students, totalPages });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.status(200).json(student);
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}


export const createStudent = async (req, res) => {
  const { name, email, age, courseEnrolled } = req.body;
  try {
    await Student.create({
      name,
      email,
      age,
      courseEnrolled,
      image: req.imagePath
    });
    return res.status(201).json({
      message: "Student details added successfully"
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateStudent = async (req, res) => {
  const { name, email, age, courseEnrolled } = req.body || {};
  try {
    const isExist = await Student.findById(req.studentId);
    if (!isExist) return res.status(404).json({ message: "Student not found" });
    isExist.name = name || isExist.name;
    isExist.email = email || isExist.email;
    isExist.age = age || isExist.age;
    isExist.courseEnrolled = courseEnrolled || isExist.courseEnrolled;

    if (req.imagePath) {
      fs.unlink(`./uploads/${isExist.image}`, async (err) => {
        if (err) return res.status(500).json({ message: "Something went wrong" });
        isExist.image = req.imagePath;
        await isExist.save();
        return res.status(200).json({ message: "Student details updated successfully" });
      });
    } else {
      await isExist.save();
      return res.status(200).json({ message: "Student details updated successfully" });
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const isExist = await Student.findById(req.studentId);
    if (!isExist) return res.status(404).json({ message: "Student not found" });

    fs.unlink(`./uploads/${isExist.image}`, async (err) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });


      await isExist.deleteOne();
      return res.status(200).json({
        message: "Student deleted successfully"
      });
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
} 
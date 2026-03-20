import Student from "../models/Student.js";



export const getDashboardStats = async (req, res) => {
  try {
    // Total students
    const totalStudents = await Student.countDocuments();

    // Students per course
    const studentsPerCourse = await Student.aggregate([
      {
        $group: {
          _id: "$courseEnrolled",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Optional: recent students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalStudents,
      studentsPerCourse,
      recentStudents
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
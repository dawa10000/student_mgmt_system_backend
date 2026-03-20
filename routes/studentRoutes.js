import express from 'express';
import { createStudent, getStudent, getStudents, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { studentSchema, validators } from '../utlis/validator.js';
import { fileCheck, updateFileCheck } from '../middleware/flieCheck.js';
import mongoose from 'mongoose';
import { notAllowed } from '../utlis/notAllowed.js';
import { checkUser } from '../middleware/checkUser.js';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  req.studentId = id;
  next();
});

router.route('/').get(getStudents).post(checkUser, validators.body(studentSchema), fileCheck, createStudent).all(notAllowed);

router.route('/:id').get(getStudent).patch(checkUser, updateFileCheck, updateStudent).delete(checkUser, deleteStudent).all(notAllowed);



export default router;
import validation from 'express-joi-validation';
import Joi from 'joi';


export const validators = validation.createValidator({});

export const studentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).required(),
  courseEnrolled: Joi.string().valid("Data Science", "Data Analysis", "Power BI", "MERN Stack", "Full Stack With JS", "Python With Django", "Flutter", "WordPress", "UI/UX", "Graphic Design", "Video Editing", "Cyber Security", "Digital Marketing").required()
});


export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});



export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});


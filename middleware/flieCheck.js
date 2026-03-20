import path from 'path';
import { v4 as uuidv4 } from 'uuid';


export const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export const fileCheck = (req, res, next) => {

  const file = req.files?.image;
  if (!file) return res.status(400).json({
    message: "Please upload an image"
  });

  const ext = path.extname(file.name);

  if (!supportedFormats.includes(ext)) return res.status(400).json({
    message: "Unsupported file format"
  });

  const imagePath = `${uuidv4()}-${file.name}`;

  file.mv(`./uploads/${imagePath}`, (err) => {
    if (err) return res.status(500).json({
      message: "Something went wrong"
    });
    req.imagePath = imagePath;

    next();
  });

}


export const updateFileCheck = (req, res, next) => {

  const file = req.files?.image;
  if (!file) return next();

  const ext = path.extname(file.name);
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  if (!supportedFormats.includes(ext)) return res.status(400).json({
    message: "Unsupported file format"
  });

  const imagePath = `${uuidv4()}-${file.name}`;

  file.mv(`./uploads/${imagePath}`, (err) => {
    if (err) return res.status(500).json({
      message: "Something went wrong"
    });
    req.imagePath = imagePath;

    next();
  });

}
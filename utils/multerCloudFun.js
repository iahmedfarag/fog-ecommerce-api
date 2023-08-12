import multer from 'multer'
import { BadRequestError } from './../errors/badRequestErr.js';
import { allowedExtensions } from './allowedExtentions.js';

export const multerCloudFunction = (allowedExtensionsArr) => {
    if (!allowedExtensionsArr) {
        allowedExtensionsArr = allowedExtensions.Image
    }
    //================================== Storage =============================
    const storage = multer.diskStorage({})

    //================================== File Filter =============================
    const fileFilter = function (req, file, cb) {
        if (allowedExtensionsArr.includes(file.mimetype)) {
            return cb(null, true)
        }

        cb(new BadRequestError('invalid extension'), false)
    }

    const fileUpload = multer({
        fileFilter,
        storage,
    })
    return fileUpload
}

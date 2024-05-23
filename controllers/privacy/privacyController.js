import ErrorHandler from "../../utils/errorHandler.js";
import privacyModel from "../../models/privacy/privacyModel.js";

import dotenv from "dotenv";
dotenv.config();
const privacyController = {};

privacyController.addprivacy = async (req, res, next) => {
    try {
        let { heading, content } = req.body
        const privacy = await privacyModel.find();
        if (privacy.length > 0) {
            return next(new ErrorHandler("privacy already added", 400));
        }
        else {
            let conntent = {
                heading: heading,
                content: content,
            }

            const user = await privacyModel.create(conntent);
            let message = "Content added successfully";

            res.status(201).json({
                success: true,
                statusCode: 201,
                msg: message,
            });
        }

    } catch (error) {
        res.status(400).json({
            success: true,
            error: error.message,
        });
    }
};

privacyController.editprivacy = async (req, res, next) => {
    try {
        const { _id } = req.body;

        // Find the document by its _id
        const member = await privacyModel.findById(_id);

        if (!member) {
            return next(new ErrorHandler("Data not found", 400));
        }

        // Update the document and await the result
        const update = await privacyModel.findByIdAndUpdate(_id, req.body, {
            new: true,
        });

        res.status(200).json({
            success: true,
            data: update,
            statusCode: 200
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};


privacyController.deleteprivacy = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler("Please provide the ID of the document to delete", 400));
        }
        const member = await privacyModel.findById(id);
        if (!member) {
            return next(new ErrorHandler("Data not found", 404));
        }
        await privacyModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

privacyController.getAllprivacy = async (req, res, next) => {
    try {
        const litePapers = await privacyModel.find();
        res.status(200).json({
            success: true,
            data: litePapers,
            statusCode: 200
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export default privacyController;

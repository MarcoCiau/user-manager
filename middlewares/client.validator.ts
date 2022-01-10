/*
Incoming body-request payload to be validated
{
    "name": "marco ciau",
    "company": "Ciau Lab",
    "rfc": "CIKM9408061A",
    "email": "contact@marcociau.com",
    "phone": "9991130035"
}
*/

import { body, validationResult, Result, param } from 'express-validator';
import { Request, Response } from 'express';

export const validateBodyParams = () => {
    return (
        [
            body('name')
                .notEmpty(),
            body('company')
                .notEmpty(),
            body('rfc')
                .notEmpty()
                .isLength({ min: 12, max: 12 }),
            body('email')
                .isEmail()
                .normalizeEmail(),
            body('phone')
                .notEmpty(),
        ]
    )
};

export const isMongoId = () => {
    return (
        [
            param('id')
                .isMongoId()
        ]
    )
};

export const checkForErrors = (req: Request, res: Response, next: any) => {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
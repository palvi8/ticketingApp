import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {validateRequest, BadRequestError} from '@pdbooktickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post("/api/users/signin",
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('you must supply a message')

],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new BadRequestError('Invalid Credentials');
    }

    const passworrdMatch = await Password.compare(
        existingUser.password,
        password
    );

    if(!passworrdMatch){
        throw new BadRequestError('Invalid Credentials');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
    }, process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(existingUser);

});

export {router as signinRouter}
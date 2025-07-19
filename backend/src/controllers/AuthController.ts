import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { APIError } from "../error/APIError";
import bcrypt from "bcrypt";
import jwt, {JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken";

//  Add return so it returns the signed token
const createAccessToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    );
};

const createRefreshToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" } // corrected format from "7days" to "7d"
    );
};

//  SIGNUP
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const SALT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT);

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return next(new APIError(409, "Email already in use"));
        }

        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(201).json(userResponse);
    } catch (err) {
        next(err);
    }
};

//  GET ALL USERS
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

//  LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new APIError(400, "User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new APIError(403, "Invalid email or password");
        }

        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/api/auth/refresh-token"
        });

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken
        };

        //  Send response
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }

};

// REFRESH TOKEN - issue new access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refreshToken
        if (!token) {
            return next(new APIError(401, "Refresh token missing"))
        }

        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: Error | null, decoded: string | JwtPayload | undefined) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        return next(new APIError(401, "Refresh token expired"))
                    } else if (err instanceof JsonWebTokenError) {
                        return next(new APIError(401, "Invalid refresh token"))
                    } else {
                        return next(new APIError(401, "Could not verify refresh token"))
                    }
                }

                if (!decoded || typeof decoded === "string") {
                    return next(new APIError(401, "Invalid refresh token payload"))
                }

                const userId = decoded.userId as string
                const user = await UserModel.findById(userId)

                if (!user) {
                    return next(new APIError(401, "User not found"))
                }

                const newAccessToken = createAccessToken(userId)
                res.status(200).json({ accessToken: newAccessToken })
            }
        )
    } catch (err) {
        next(err)
    }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isProduction = process.env.NODE_ENV === "production"

        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            expires: new Date(0),
            path: "/api/auth/refresh-token",
        })

        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        next(err)
    }
}

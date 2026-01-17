import TokenService from "../services/token.service";
import { NextFunction, Request } from "express";

export const checkToken = async (req: Request, res: any, next: NextFunction) => {
    const {appid} = req.query;
    if(!appid) {
        return res.json({
            cod: 401,
            message: "Invalid API key "
        })
    }
    const apiKey = await TokenService.findTokenByKey(appid); 
    if(!apiKey) {
        return res.json({
            cod: 401,
            message: "Invalid API key "
        })
    }
    next();
};
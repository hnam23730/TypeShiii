import { User } from "@entities/User";

declare module "express-session" {
    interface SessionData {
        userLogin?: {
            id: number;
            email: string;
            roleId: number;
        };
        shopingCart?: Array<{
            id: number;
            name: string;
            price: number;
            imageUrl: string;
            quantity: number;
        }>;
        wishlist?: Array<{
            id: any;
            name: string;
            price: number;
            image: string;
        }>;
        
    
    }
}
declare global {
    namespace Express {
        interface Request {
            params: {
                id: string;
            };
        }
    }
}
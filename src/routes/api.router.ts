import express, { Router, Request, Response } from "express";
import { AppDataSource } from "@database/data-source"; // Import AppDataSource
import { Product } from "@entities/Product"; // Import entity Product
import { checkToken } from "@middlewares/checkToken.midd";
import UserAPIController from "@controllers/api/user.api.controller";

const apiRouter: Router = express.Router();

/*
   API: tra ve danh sach nguoi dung
   - uri: /api/v1/users
   - method: GET
   - response: {
        "status": "success",
        "data": []
   }
   - neu co loi response
   {
        "status": "error",
        "message": "message error (tuy theo tung chuc nang)"
   }
*/

apiRouter.get("/search",async (req: any, res: any) => {
    const keyword = req.query.q as string;

    if (!keyword || keyword.trim() === "") {
        return res.json([]); // Trả về danh sách rỗng nếu không có từ khóa
    }

    AppDataSource.getRepository("Product") // Truy cập entity "Product" từ AppDataSource
        .createQueryBuilder("product")
        .where("product.name LIKE :keyword", { keyword: `%${keyword}%` })
        .limit(10)
        .getMany()
        .then((products) => {
            res.json(products);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

apiRouter.get('/users', checkToken, UserAPIController.index);
apiRouter.get('/users/:id', UserAPIController.findByID);
apiRouter.delete('/users/:id', UserAPIController.delete);

export default apiRouter;
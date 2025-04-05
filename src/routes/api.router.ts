import UserAPIController from "@controllers/api/user.api.controller";
import express, {Router} from "express";
import { checkToken } from "src/middlewares/checkToken.midd";

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

apiRouter.get('/users', checkToken, UserAPIController.index);
apiRouter.get('/users/:id', UserAPIController.findByID);
apiRouter.delete('/users/:id', UserAPIController.delete);

<<<<<<< Updated upstream
export default apiRouter;
=======
export default apiRouter;
>>>>>>> Stashed changes

import TokenService from "../services/token.service";

class TokenController {
    static async index(req: any, res: any): Promise<any> {
        const myToken = await TokenService.getAllTokens(req, res);
        res.render('token/list', { tokens: myToken });
    }

    static async store(req: any, res: any): Promise<any> {
        await TokenService.createToken(req.body, req);
        res.redirect('/api-keys');
    }

    static async updateName(req: any, res: any): Promise<any> {
        const { id, newName } = req.body;
        await TokenService.updateTokenName(id, newName);
        res.redirect('/api-keys');
    }

    static async updateStatus(req: any, res: any): Promise<any> {
        const { id, newStatus } = req.body;
        await TokenService.updateTokenStatus(id, newStatus);
        res.redirect('/api-keys');
    }

    static async delete(req: any, res: any): Promise<any> {
        const { id } = req.params;
        await TokenService.deleteToken(parseInt(id));
        res.redirect('/api-keys');
    }
}

export default TokenController;
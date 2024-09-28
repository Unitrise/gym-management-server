import express from 'express';
import { UserController } from '../controllers/UserController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', async (req,res)=>{await UserController.login(req,res)});
router.get('/me', async (req, res) => {
    protect(req, res, async () => await UserController.getCurrentUser(req, res));
});
router.post('/register',async (req,res)=> {await  UserController.register(req,res)});

export default router;

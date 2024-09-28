import { Request, Response } from "express";
import { IController } from "../interfaces/Icontroller";
import User from "../models/User"; // Assuming you have a User model defined
import logger from "../services/LoggerService"; // Import the logger
import bcrypt from "bcrypt"; // Import the bcrypt module
import jwt from "jsonwebtoken"; // Import the jwt module


class UserController implements IController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.json(users);
      logger.info("Users fetched successfully"); // Log success message
    } catch (error) {
        logger.error("Error fetching users", error); // Log error message
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      await user.save();
  
      // After creating the user, generate a JWT token
      const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  
      res.json({ user, token });  // Return both user info and token
      logger.info("User created successfully");  // Log success message
    } catch (error) {
      logger.error("Error creating user", error);  // Log error message
      res.status(500).json({ message: "Error creating user" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.error("User not found"); // Log error message
      } else {
        logger.info("User fetched successfully"); // Log success message
        res.json(user);
      }
    } catch (error) {
        logger.error("Error fetching user", error); // Log error message    
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  

  public async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.error("User not found"); // Log error message
      } else {
        logger.info("User fetched successfully"); // Log success message
        res.json(user);
      }
    } catch (error) {
        logger.error("Error fetching user", error); // Log error message
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.error("User not found"); // Log error message
      } else {
        logger.info("User updated successfully"); // Log success message
        res.json(user);
      }
    } catch (error) {
        logger.error("Error updating user", error); // Log error message
      res.status(500).json({ message: "Error updating user" });
    }
  }
  

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.error("User not found"); // Log error message
      } else {
        res.json({ message: "User deleted successfully" });
        logger.info("User deleted successfully"); // Log success message
      }
    } catch (error) {
        logger.error("Error deleting user", error); // Log error message
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
  
      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return 
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return 
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  
      // Return the token
      res.json({ token });
    } catch (error) {
      logger.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  


  public async getMe(req: Request, res: Response): Promise<void> {
    try {
      // Get the Authorization header and extract the token
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];  // Extract token from Bearer Token
  
      console.log('Token received:', token);  // Log token to see if it is coming in
  
      // If no token, return an unauthorized response
      if (!token) {
        res.status(401).json({ message: 'No token provided, unauthorized' });
        return 
      }
  
      // Verify the JWT token
      const decoded: any = jwt.verify(token, 'secret');  // Replace 'secret' with your actual JWT secret
      console.log('Decoded token:', decoded);  // Log decoded token
  
      // Find the user using the decoded token's id
      const user = await User.findById(decoded.id);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return 
      }
  
      // Return user data (excluding sensitive information like password)
      res.json({
        id: user._id,
        email: user.email,
        role: user.role,
      });
  
      logger.info('Authenticated user fetched successfully');
    } catch (error) {
      console.log('Error during token verification:', error);  // Log the JWT error
      logger.error('Error fetching authenticated user:', error);
      res.status(500).json({ message: 'Error fetching authenticated user' });
    }
  }
}

export default new UserController();

import { models } from "@/models";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export class UserService {
  private userModel = models.User;

  public async createUser(data: any) {
    try {
      const exisitingUser = await this.userModel.findOne({ email: data.email });
      if (exisitingUser) throw new Error("User already exists");

      const hashedPassword = await hash(data.password, 10);
      const user = await this.userModel.create({
        ...data,
        password: hashedPassword,
      });
      const token = await this.generatToken(user);
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  public async loginUser(data: any) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) throw new Error("User not found");
      const isMatch = await compare(data.password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");
      const token = await this.generatToken(user);
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyUser(id: any, otp: any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new Error("User not found");
      if (user.otp !== otp) throw new Error("Invalid OTP");
      if (user.otp_expiry < new Date()) throw new Error("OTP expired");
      user.isVerified = true;
      await user.save();
    } catch (error) {
      throw error;
    }
  }

  public async resendOtp(id: any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new Error("User not found");
      user.otp = Math.floor(Math.random() * 1000000);
      user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
      user.isVerified = false;
      await user.save();
      return user.otp;
    } catch (error) {
      throw error;
    }
  }
  public async getUser(id: any) {
    try {
      const user = await this.userModel.findById(id);
      if(!user.isVerified) throw new Error("User not verified");
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async generatToken(data: any) {
    const token = sign({ _id: data._id }, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });
    return token;
  }
}

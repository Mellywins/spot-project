import { Injectable } from "@nestjs/common";
import { encryptionKey, UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import * as Crypto from "crypto";
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const dbUser = await this.usersService.findOne(username);
    if (!dbUser) {
      return Promise.reject("User not found");
    }
    const iv = Buffer.from(dbUser.iv, "hex");
    const cipher = await Crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey),
      iv
    );

    cipher.update(pass, "utf8", "hex");
    const hashedPw = cipher.final("hex");
    if (hashedPw !== dbUser.password) {
      return Promise.reject("Password is incorrect");
    }
    return true;
  }

  async login(user: User) {
    const payload = { username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

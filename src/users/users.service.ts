import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as Crypto from "crypto";
export const encryptionKey = Buffer.from(
  "\x9F�>3�\x10\fj��Q�\x1AE:�o�\x05\x1C<Q�ޙ�V��ن"
).slice(0, 32);
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async create(user: User): Promise<string> {
    const iv = Crypto.randomBytes(16);
    const hasher = await Crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey),
      Buffer.from(iv)
    );
    hasher.update(user.password, "utf8", "hex");
    const hasehdPw = hasher.final("hex");
    const saveResult = await this.userRepo.save({
      username: user.username,
      password: hasehdPw,
      iv: iv.toString("hex"),
    });
    return `User  ${user.username} created successfully`;
  }
  async findOne(username: string): Promise<User | undefined> {
    const user = this.userRepo.findOne({
      where: {
        username,
      },
    });
    if (user) {
      return user;
    }
    return undefined;
  }
}

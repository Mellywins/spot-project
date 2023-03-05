import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/auth/signup")
  async create(@Body() user: User): Promise<string> {
    return this.usersService.create(user);
  }
}

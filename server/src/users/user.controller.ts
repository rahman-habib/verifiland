import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/roles/has-roles.decorator';
import { Role } from '../roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUserByEmail(@Req() req) {
    return this.userService.getUserByEmail(req.user.username);
  }

  @Get('address')
  async getUserNonceByAddress(@Query() query) {
    return await this.userService.getUserByPublicAddress(query.publicAddress);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('addresses')
  async getUsersAddress() {
    return await this.userService.getUsersAddress();
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(`all`)
  getAllUsers(@Param() param) {
    return this.userService.getAllUsers();
  }
}

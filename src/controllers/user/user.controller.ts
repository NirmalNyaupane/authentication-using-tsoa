import express from 'express';
import { Controller, Get, Query, Request, Route, Security, Tags } from "tsoa";
import { UserRole } from "../../constants/enum";
import userService from "../../services/user/user.service";
import { paginateResponse } from '../../utils/PaginateResponse.utli';
@Route("user")
@Tags("User")
export class UserController extends Controller {
  @Security("jwt", [UserRole.Admin, UserRole.User])
  @Get("")
  async registerUser(@Request() req: express.Request) {
    return req.user;
  }

  @Security("jwt", [UserRole.Admin])
  @Get("/all")
  async getAllUser(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() role?:UserRole) {
    const [user, count] = await userService.getAllUser({ page, limit, search, role});
    return {...paginateResponse(count, page, limit), data: user }
  }
}

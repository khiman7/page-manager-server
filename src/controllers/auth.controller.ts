import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { Controller } from './base.controller';
import { ILogger } from '../interfaces/logger.interface';
import { HTTPException } from '../exceptions/http-exception';
import { TYPES } from '../types';
import { UserLoginDTO } from '../dtos/user-login.dto';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ValidateMiddleware } from '../middlewares/validate.middleware';

@injectable()
export class AuthController extends Controller {
	constructor(
		@inject(TYPES.Logger) logger: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.AuthService) private authService: AuthService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				middlewares: [new ValidateMiddleware(UserLoginDTO)],
				handler: this.login,
			},
			{
				path: '/verify',
				method: 'get',
				handler: this.verify,
			},
		]);
	}

	async login(
		request: Request<{}, {}, UserLoginDTO>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { username, password } = request.body;
			const user = await this.userService.getByUsername(username);

			if (!user) {
				return next(new HTTPException(400, 'User not found', 'login'));
			}

			if (!bcrypt.compareSync(password, user?.password as string)) {
				return next(new HTTPException(400, 'Wrong password', 'login'));
			}

			const token = this.authService.generateAccessToken(
				user?.id as number,
				user?.username as string,
			);

			response.send({ token });
		} catch (error) {
			next(error);
		}
	}

	async verify(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const token = request.headers.authorization?.split(' ')[1];

			if (!token) {
				return next(new HTTPException(402, 'Unauthorized', 'verify'));
			}

			const payload = await this.authService.verifyAccessToken(token);

			response.send({ message: 'ok', payload });
		} catch (error) {
			next(error);
		}
	}
}

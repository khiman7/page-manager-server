import { inject, injectable } from 'inversify';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

import { IConfig } from '../interfaces/config.interface';
import { TYPES } from '../types';

@injectable()
export class AuthService {
	private readonly secret: string;

	constructor(@inject(TYPES.Config) private config: IConfig) {
		this.secret = this.config.get('JWT_SECRET');
	}

	public generateAccessToken(id: number, username: string): string {
		const payload: JwtPayload = { id, username };
		const expiresIn: string = this.config.get('JWT_EXPIRES_IN');
		const algorithm = 'HS256';

		return jwt.sign(payload, this.secret, { expiresIn, algorithm });
	}

	public async verifyAccessToken(token: string): Promise<JwtPayload> {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this.secret, (error, payload) => {
				if (error) {
					reject(error);
				} else {
					if (payload && typeof payload !== 'string') {
						resolve(payload);
					}
				}
			});
		});
	}
}

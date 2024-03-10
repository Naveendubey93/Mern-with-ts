import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Config } from '../config';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';
import { Repository } from 'typeorm';

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
  generateAccessToken(payload: JwtPayload) {
    let privateKey: string; //Buffer
    if (!Config.PRIVATE_KEY) {
      const error = createHttpError(500, 'Sectrt ky is not set');
      throw error;
    }
    try {
      privateKey = Config.PRIVATE_KEY; //readFileSync(path.join(__dirname, '../../cert/privatekey.pem'));
    } catch (err) {
      const error = createHttpError(500, 'Error while reading private key');
      throw error;
    }

    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    });
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'auth-service',
      jwtid: payload.id,
    });
    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1year
    // const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId: number) {
    return this.refreshTokenRepository.delete({ id: tokenId });
  }
}

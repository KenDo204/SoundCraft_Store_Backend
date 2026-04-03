import { Injectable, BadRequestException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

@Injectable()
export class GoogleService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  // 1. Verify ID Token (Dùng cho phương thức dùng Google One Tap/ID Token)
  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload(); // Trả về email, name, picture, sub (id)
    } catch (error) {
      throw new BadRequestException('ID Token Google không hợp lệ');
    }
  }

  // 2. Lấy UserInfo từ Access Token (Thay cho restTemplate.exchange của Java)
  async getUserInfoFromAccessToken(accessToken: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data; // Trả về { id, email, name, picture }
    } catch (error) {
      throw new BadRequestException('Không thể lấy thông tin từ Google Access Token');
    }
  }
}
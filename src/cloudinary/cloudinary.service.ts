import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // cloudinary tự động nhận diện public_id để xóa
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  extractPublicId(url: string): string | null {
    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length < 2) return null;

      let path = urlParts[1];
      
      // Cắt bỏ phần version (vd: v1712345678/) nếu có
      const pathParts = path.split('/');
      if (pathParts[0].match(/^v\d+$/)) {
        pathParts.shift();
      }
      
      path = pathParts.join('/');
      
      // Cắt bỏ phần đuôi mở rộng (.png, .jpg)
      const publicId = path.split('.').slice(0, -1).join('.');
      return publicId;
    } catch (error) {
      console.error('Lỗi khi bóc tách public_id:', error);
      return null;
    }
  }

  async uploadImageBrands(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'soundcraft/brands' }, // Tên folder bạn muốn lưu trên Cloudinary
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      
      toStream(file.buffer).pipe(upload);
    });
  }
}
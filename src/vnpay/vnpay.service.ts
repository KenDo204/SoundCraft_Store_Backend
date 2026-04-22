import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { format } from 'date-fns';

@Injectable()
export class VnpayService {
    private readonly logger = new Logger(VnpayService.name);
    private readonly VERSION = '2.1.0';

    constructor(private configService: ConfigService) {}

    private sortObject(obj: Record<string, string>): Record<string, string> {
        const sorted: Record<string, string> = {};
        const str: string[] = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    createPaymentUrl(req: { amount: number, ipAddress: string, trackingNumber: string, bankCode?: string, language?: string }): string {
        const tmnCode = this.configService.get<string>('VNP_TMN_CODE') || '';
        const secretKey = this.configService.get<string>('VNP_HASH_SECRET') || '';
        const vnpUrl = this.configService.get<string>('VNP_URL');
        const returnUrl = this.configService.get<string>('VNP_RETURN_URL');

        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss');
        date.setMinutes(date.getMinutes() + 15);
        const expireDate = format(date, 'yyyyMMddHHmmss');

        const amount = req.amount * 100;

        let vnp_Params: Record<string, any> = {};
        vnp_Params['vnp_Version'] = this.VERSION;
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = req.language || 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = req.trackingNumber;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + req.trackingNumber;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = req.ipAddress;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_ExpireDate'] = expireDate;

        if (req.bankCode) {
            vnp_Params['vnp_BankCode'] = req.bankCode;
        }

        vnp_Params = this.sortObject(vnp_Params);

        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;

        return vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
    }

    validateSignature(vnp_Params: any): boolean {
        const secureHash = vnp_Params['vnp_SecureHash'];
        
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);
        const signData = qs.stringify(sortedParams, { encode: false });
        
        const secretKey = this.configService.get<string>('VNP_HASH_SECRET') || '';
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

        return secureHash === signed;
    }

    // ===================================
    //  QUERY TRANSACTION MÔ PHỎNG LỜI GỌI
    // ===================================
    async queryTransaction(req: { orderId: string, transDate: string, ipAddress: string }): Promise<string> {
        const tmnCode = this.configService.get<string>('VNP_TMN_CODE') || '';
        const secretKey = this.configService.get<string>('VNP_HASH_SECRET') || '';
        const vnpApiUrl = this.configService.get<string>('VNP_API_URL') || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss');
        const reqId = crypto.randomBytes(4).toString('hex');

        const dataObj = {
            vnp_RequestId: reqId,
            vnp_Version: this.VERSION,
            vnp_Command: 'querydr',
            vnp_TmnCode: tmnCode,
            vnp_TxnRef: req.orderId,
            vnp_OrderInfo: 'Kiem tra ket qua GD OrderId:' + req.orderId,
            vnp_TransactionDate: req.transDate,
            vnp_CreateDate: createDate,
            vnp_IpAddr: req.ipAddress
        };

        const hashData = [
            reqId, this.VERSION, 'querydr', tmnCode,
            req.orderId, req.transDate, createDate,
            req.ipAddress, dataObj.vnp_OrderInfo
        ].join('|');

        const hmac = crypto.createHmac("sha512", secretKey);
        const secureHash = hmac.update(Buffer.from(hashData, 'utf-8')).digest("hex");
        dataObj['vnp_SecureHash'] = secureHash;

        const response = await fetch(vnpApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        });
        
        return await response.text();
    }

    // ===================================
    //  REFUND MÔ PHỎNG LỜI GỌI
    // ===================================
    async refund(req: { orderId: string, transDate: string, amount: number, tranType: string, user: string, ipAddress: string }): Promise<string> {
        const tmnCode = this.configService.get<string>('VNP_TMN_CODE') || '';
        const secretKey = this.configService.get<string>('VNP_HASH_SECRET') || '';
        const vnpApiUrl = this.configService.get<string>('VNP_API_URL') || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss');
        const reqId = crypto.randomBytes(4).toString('hex');

        const dataObj = {
            vnp_RequestId: reqId,
            vnp_Version: this.VERSION,
            vnp_Command: 'refund',
            vnp_TmnCode: tmnCode,
            vnp_TransactionType: req.tranType,
            vnp_TxnRef: req.orderId,
            vnp_Amount: req.amount * 100,
            vnp_OrderInfo: 'Hoan tien GD OrderId:' + req.orderId,
            vnp_TransactionDate: req.transDate,
            vnp_CreateBy: req.user,
            vnp_CreateDate: createDate,
            vnp_IpAddr: req.ipAddress
        };

        const hashData = [
            reqId, this.VERSION, 'refund', tmnCode,
            req.tranType, req.orderId,
            (req.amount * 100).toString(),
            '', req.transDate, req.user,
            createDate, req.ipAddress, dataObj.vnp_OrderInfo
        ].join('|');

        const hmac = crypto.createHmac("sha512", secretKey);
        const secureHash = hmac.update(Buffer.from(hashData, 'utf-8')).digest("hex");
        dataObj['vnp_SecureHash'] = secureHash;

        const response = await fetch(vnpApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        });

        return await response.text();
    }
}

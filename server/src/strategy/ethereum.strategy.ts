import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as ethJS from 'ethereumjs-util';

@Injectable()
export class EthereumStrategy extends PassportStrategy(Strategy, 'ethereum') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const user = await this.authService.validateAddress(req.body.publicAddress);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Address not registered on the system',
      });
    }

    return user;
  }

  async verifyPublicKey(signature: string, nonce: string) {
    const msgHex = ethJS.bufferToHex(Buffer.from('' + nonce));
    const msgBfr = ethJS.toBuffer(msgHex);
    const msgHash = ethJS.hashPersonalMessage(msgBfr);

    const signatureBuffer = ethJS.toBuffer(signature);
    const signatureParams = ethJS.fromRpcSig(
      signatureBuffer as unknown as string,
    );
    const pubKey = ethJS.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s,
    );
    const addrBuf = ethJS.pubToAddress(pubKey);
    const addr = ethJS.bufferToHex(addrBuf);
  }
}

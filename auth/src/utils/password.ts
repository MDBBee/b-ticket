import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsyn = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsyn(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, submittedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsyn(submittedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

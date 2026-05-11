import crypto from 'crypto';

const KEY = crypto.createHash('sha256')
    .update(process.env.ENCRYPT ?? (() => { throw new Error('Missing ENCRYPT') })())
    .digest();

export const encrypt = (text) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
    const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${enc.toString('hex')}`;
};

export const decrypt = (payload) => {
    const [iv, tag, enc] = payload.split(':').map(h => Buffer.from(h, 'hex'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
};
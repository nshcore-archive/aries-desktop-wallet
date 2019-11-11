import crypto from 'crypto';

class Cryptography {

    static hash(password) {

        return new Promise((resolve, reject) => {

            if (!password) {
                reject('No value provided');
            }

            crypto.pbkdf2(password, Cryptography.Salt, 2048, 48, Cryptography.Algorithm, (err, data) => {
                if (err) {
                    reject(err);
                }
                const hex = data.toString('hex');
                resolve(hex);
            });
        });
    }

    static encrypt(key, password) {
        const cipher = crypto.createCipher(Cryptography.Encryption, password);
        return cipher.update(key, Cryptography.Encoding.In, Cryptography.Encoding.Out) + cipher.final(Cryptography.Encoding.Out);
    }

    static decrypt(key, password) {
        const cipher = crypto.createDecipher(Cryptography.Encryption, password);
        return cipher.update(key, Cryptography.Encoding.Out, Cryptography.Encoding.In) + cipher.final(Cryptography.Encoding.In);
    }
}

Cryptography.Salt = 'arieswallet';
Cryptography.Algorithm = 'sha512';
Cryptography.Encryption = 'aes-256-cbc';
Cryptography.Encoding = {
    In: 'utf8',
    Out: 'hex'
};

export default Cryptography;
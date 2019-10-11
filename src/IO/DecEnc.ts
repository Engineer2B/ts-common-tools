import * as fs from 'fs';
import * as crypto from 'crypto';
/**
 * For encrypting and decrypting a file with text.
 */
export class DecEnc {
	protected encryptionKey!: string;

	/**
	 *  Initializes a new instance of the Secret class.
	 */
	public constructor(public salt: string) {
		this.setEncryptionKey();
	}

	/**
	 * Encrypt a string and save it to a file.
	 * @param theString The string that is to be encrypted.
	 * @param filePath The file to which the output is saved.
	 */
	public EncryptToFile(theString: string, filePath: string): void {
		// create a aes128 cipher based on our password
		const cipher = crypto.createCipher(
			'aes-256-ctr',
			this.encryptionKey);
		// update the cipher with our secret string
		let encoded = cipher.update(theString, 'utf8', 'hex');
		// save the encryption as base64-encoded
		encoded += cipher.final('hex').toString();
		fs.writeFileSync(
			filePath,
			encoded,
			'utf8');
	}

	/**
	 * Read the contents of the encrypted file.
	 * @param filePath The path to the encrypted file.
	 * @returns {string} The decrypted output.
	 */
	public DecryptFromFile(filePath: string): string {
		const encrypted = fs.readFileSync(filePath, 'utf8');
		// create a aes128 decipher based on our password
		const decipher = crypto.createDecipher(
			'aes-256-ctr',
			this.encryptionKey);
		// update the decipher with our encrypted string
		const decoded = decipher.update(encrypted, 'hex', 'utf8');

		return decoded + decipher.final('utf8');
	}

	/**
	 * Set the encryption key with the provided salt.
	 */
	protected setEncryptionKey(): void {
		const iterations = 4096;
		const keyLength = 512;
		this.encryptionKey = crypto.pbkdf2Sync('the secret password',
			this.salt,
			iterations,
			keyLength,
			'sha256')
			.toString('hex');
	}
}
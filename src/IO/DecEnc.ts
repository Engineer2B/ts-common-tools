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
		// Define the algorithm
		const algorithm = 'aes-256-ctr';

		// Ensure your encryption key is of the correct length (32 bytes for aes-256)
		const key = crypto.createHash('sha256').update(this.encryptionKey).digest();

		// Generate a random Initialization Vector
		const iv = crypto.randomBytes(16);

		// Create the cipher
		const cipher = crypto.createCipheriv(algorithm, key, iv);

		// Encrypt the data
		let encoded = cipher.update(theString, 'utf8', 'hex');
		encoded += cipher.final('hex');

		// Combine IV and encrypted data
		const result = iv.toString('hex') + ':' + encoded;

		// Write to file
		fs.writeFileSync(filePath, result, 'utf8');
	}

	/**
	 * Read the contents of the encrypted file.
	 * @param filePath The path to the encrypted file.
	 * @returns {string} The decrypted output.
	 */
	public DecryptFromFile(filePath: string): string {
		// Read the data from the file
		const data = fs.readFileSync(filePath, 'utf8');

		// Split the data to get the IV and the encrypted content
		const [ivHex, encryptedData] = data.split(':');
		const iv = Buffer.from(ivHex, 'hex');

		// Derive the key (ensure it's the same as used in encryption)
		const key = crypto.createHash('sha256').update(this.encryptionKey).digest();

		// Create the decipher
		const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);

		// Decrypt the data
		let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
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
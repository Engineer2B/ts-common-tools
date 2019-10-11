import * as path from 'path';
import { ReadWrite } from './ReadWrite';

/**
 * Stores the directory information.
 */
export class Directories {
	/**
	 * The directory of this file.
	 */
	public static ThisDir = __dirname;
	/**
	 * The root directory of the disk where this program is located.
	 */
	public static SystemRoot = path.parse(__dirname).root;

	/**
	 * The dropbox directory.
	 */
	public static get DropBoxDir(): string {
		if(!Directories.dropBoxDir){
			Directories.dropBoxDir = ReadWrite.ReadFromFile<{
				personal: {
					path: string;
				}
			}>(`${process.env.LOCALAPPDATA}\\Dropbox`, 'info').personal.path;
		}

		return Directories.dropBoxDir;
	}

	/**
	 * The directory from which the program is run.
	 */
	public static RunDir = process.cwd();

	protected static dropBoxDir: string;

	public static DirPlusFileName(directory: string, fileName: string): string {
		return path.join.apply(undefined, [directory].concat(fileName));
	}

	/**
	 * Path relative to the directory from which the program is run.
	 * @param {string[]} pathStrings List of paths.
	 */
	public static RunDirPlus(pathStrings: string[]): string {
		return path.join.apply(undefined, [Directories.RunDir].concat(pathStrings));
	}
}
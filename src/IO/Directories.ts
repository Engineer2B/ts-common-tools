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
	 * The root directory of the disk where this solution is located.
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
	 * This solution's directory.
	 */
	public static SolutionDir = process.cwd();

	/**
	 * This project's directory.
	 */
	public static ProjectDir = path.resolve(__dirname, '..', '..');

	protected static dropBoxDir: string;

	public static DirPlusFileName(directory: string, fileName: string): string {
		return path.join.apply(undefined, [directory].concat(fileName));
	}

	public static ThisDirPlus(pathStrings: string[]): string {
		return path.join.apply(undefined, [Directories.ProjectDir].concat(pathStrings));
	}
}
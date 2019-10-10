import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export class Prompt {
	public static ReadLine = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	public static AskForPath(reason: string, callbackFn: (inPath: string, inFolder: string) => any): void {
		this.ReadLine.question(`Path where ${reason}: `, pathName => {
			if (!fs.existsSync(pathName)) {
				this.AskForPath(reason, callbackFn);
			}
			callbackFn(pathName, path.basename(pathName));
		});
	}

	public static AskForRelativePath(reason: string, fullPathFn: (inPath: string) => string, callbackFn: (inPath: string) => any): void {
		this.ReadLine.question(`${reason}: `, pathName => {
			const fullPathName = fullPathFn(pathName);
			if (!fs.existsSync(fullPathName)) {
				this.AskForRelativePath(reason, fullPathFn, callbackFn);
			} else {
				callbackFn(fullPathName);
			}
		});
	}
}

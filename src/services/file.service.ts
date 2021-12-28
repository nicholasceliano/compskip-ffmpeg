import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from 'fs';
import { parse } from 'path/posix';
import { FileDeliminator } from '../constants';

export class FileService {

    getFiles(folderLocation: string, fileType: string, includePath = false) {
        const returnFiles: string[] = [];
        const readFiles = readdirSync(folderLocation) || [];
        const filePath = includePath ? `${folderLocation}/` : '';

        readFiles.forEach(x => {
            if (this.getFileExt(x) === fileType) {
                returnFiles.push(`${filePath}${x}`);
            }
        });

        return returnFiles;
    }

    clearDir(dir: string) {
        if (existsSync(dir)) {
            rmSync(dir, { recursive: true });
        }
        mkdirSync(dir);
    }

    parseFile(file: string, fileDeliminator: FileDeliminator) {
        let parsedData: string[][] = [[]];
        const fileData = readFileSync(file, 'utf-8');

        if (fileDeliminator === FileDeliminator.Tab) {
            parsedData = fileData.split('\n').map(row => row.split('\t'));
        }

        return parsedData;
    }

    prefixFileName(file: string, prefix: string) {
        const newFileName = `${parse(file).dir}/${prefix} - ${parse(file).base}`;
        renameSync(file, newFileName);
    }

    copyFile(sourceFile: string, destPath: string) {
        const destFile = `${destPath}/${parse(sourceFile).base}`;
        copyFileSync(sourceFile, destFile);
    }

    private getFileExt(f: string) {
        return f.slice(f.lastIndexOf('.'), f.length);
    }
}

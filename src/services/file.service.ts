import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from 'fs';
import { parse } from 'path/posix';
import { Config } from '../config';
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

    archiveFile(file: string) {
        const archiveFile = `${Config.ArchiveFileOutputLocation}/${parse(file).base}`
        renameSync(file, archiveFile);
        console.log(`process successful - ${archiveFile}`);
    }

    archiveFailedFile(file: string) {
        const archiveFailedFile = `${Config.FailedFileOutputLocation}/${parse(file).base}`
        renameSync(file, archiveFailedFile);
        console.log(`process failed - ${archiveFailedFile}`);
    }

    private getFileExt(f: string) {
        return f.slice(f.lastIndexOf('.'), f.length);
    }
}

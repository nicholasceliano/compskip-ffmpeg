import path from 'path';
import { execSync } from 'child_process';
import { Config } from '../config';
import { VideoTimestamp } from '../models/video-timestamp';
import { FileService } from './file.service';
import { FileDeliminator } from '../constants';
import { FormattingService } from './formatting.service';

export class ComskipService {
    private fileService: FileService;
    private formattingService: FormattingService;

    constructor() {
        this.fileService = new FileService();
        this.formattingService = new FormattingService();
    }
    
    generateVideoTimestamps(file: string) {
        let videoTimestamps: VideoTimestamp[] = [];

        this.executeComskipCmd(file);
        videoTimestamps = this.parseComskipOutput();

        return videoTimestamps;
    }

    private executeComskipCmd(file: string) {
        try {
            console.log('comskip started');
            this.fileService.clearDir(Config.TempDir);
            execSync(this.buildComskipCmd(file));
            console.log('comskip complete');    
        } catch(err: any) {
            throw(`comskip error: ${err.toString()}`);
        }
    }

    private buildComskipCmd(file: string) {
        const iniLocation = path.resolve(`./assets/comskip-ini/${Config.ComskipIniFile}.ini`);
        const outputLocation = path.resolve(Config.TempDir);
        let cmd = `${Config.ComskipDir}comskip`;

        if (Config.ComskipIniFile.length > 0) {
            cmd += ` --ini="${iniLocation}"`;
        }

        cmd += ` --output="${outputLocation}" --output-filename="comskip_out" "${file}"`;

        return cmd;
    }

    private parseComskipOutput() {
        const timestamps: VideoTimestamp[] = [];
        const data = this.fileService.parseFile(`${Config.TempDir}/comskip_out.edl`, FileDeliminator.Tab);

        data.forEach((x, i) => { 
            const startTime = i === 0 ? 0 : parseFloat(data[i - 1][1]);
            const endTime = parseFloat(i === 0 ? x[0] : data[i][0]);
            
            timestamps.push({
                startTime: this.formattingService.secondsToTimestamp(startTime),
                endTime: this.formattingService.secondsToTimestamp(endTime)
            } as VideoTimestamp);
        });

        return timestamps;
    }
}

import { execSync } from 'child_process';
import path, { parse } from 'path';
import { Config } from '../config';
import { VideoTimestamp } from '../models/video-timestamp';
import { v4 } from 'uuid';
import { writeFileSync } from 'fs';
import { FileService } from './file.service';

export class FfmpegService {
    private tmpDir: string;
    private fileService: FileService;
    
    constructor() {
        this.tmpDir = path.resolve(Config.TempDir).replace(/\\/g, '/');
        this.fileService = new FileService();
    }

    removeTimeStampsFromVideo(videoLocation: string, timestamps: VideoTimestamp[]) {
        this.fileService.clearDir(`${this.tmpDir}/video_slices/`);
        const videoCutList: string[] = [];

        timestamps.forEach((x, i) => {
            const outputFile = `${this.tmpDir}/video_slices/vs_${v4().replace(/-/g, '')}.ts`;
            videoCutList.push(outputFile);

            console.log(`start cut ${i}`);
            execSync(this.buildVideoCutCmd(videoLocation, x.startTime, x.endTime, outputFile));
            console.log(`end   cut ${i} - ${outputFile}`);
        });

        return videoCutList;
    }

    concatVideoCutList(videoLocation: string, videoCutList: string[]) {
        const videoFileName = parse(videoLocation).name;
        const videoCutListTxt = `${this.tmpDir}/videoCutList.txt`;
        const fileOutputPath = path.resolve(Config.SuccessFileOutputLocation);
        const outputFile = `${fileOutputPath}/${videoFileName}.${Config.OutputVideoFormat}`;

        this.writeVideoCutListToFile(videoCutList, videoCutListTxt);

        console.log(`start concat - ${videoCutList.length} slices`);
        execSync(this.buildVideoConcatCmd(videoCutListTxt, outputFile));
        console.log(`end   concat - ${outputFile}`);
    }

    private buildVideoCutCmd(inputFile: string, startTimeStamp: string, endTimeStamp: string, outputFile: string) {
        return `ffmpeg -i "${inputFile}" -ss ${startTimeStamp}${endTimeStamp ? ` -to ${endTimeStamp}` : ''} -c copy "${outputFile}" -loglevel panic`;
    }

    private buildVideoConcatCmd(videoCutListTxt: string, outputFile: string) {
        const outputEncoding = Config.EncodeVideoOutput ? '-vcodec libx264 -crf 20' : '-c copy';
        return `ffmpeg -f concat -safe 0 -i ${videoCutListTxt} ${outputEncoding} "${outputFile}" -loglevel error`;
    }

    private writeVideoCutListToFile(videoCutList: string[], fileLocation: string) {
        writeFileSync(fileLocation, `file ${videoCutList.join('\nfile ')}`);
    }
}

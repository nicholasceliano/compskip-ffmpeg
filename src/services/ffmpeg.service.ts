import { execSync } from 'child_process';
import path from 'path';
import { Config } from '../config';
import { VideoTimestamp } from '../models/video-timestamp';

export class FfmpegService {
    removeTimeStampsFromVideo(videoLocation: string, timestamps: VideoTimestamp[]) {
        const outputLocation = path.resolve(Config.TempDir);
        
        timestamps.forEach((x, i) => {
            const outputFile = `${outputLocation}/v_${i}.ts`;
            const videoCutCmd = this.buildVideoCutCmd(videoLocation, x.startTime, x.endTime, outputFile);
            execSync(videoCutCmd);
        });

        // put togeather all video slices
    }

    private buildVideoCutCmd(inputFile: string, startTimeStamp: string, endTimeStamp: string, outputFile: string) {
        return `ffmpeg -i "${inputFile}" -ss ${startTimeStamp}${endTimeStamp ? ` -to ${endTimeStamp}` : ''} -c copy "${outputFile}" -loglevel error`
    }
}

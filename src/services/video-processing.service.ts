import path from 'path';
import { Config } from '../config';
import { ComskipService } from './comskip.service';
import { FfmpegService } from './ffmpeg.service';
import { FileService } from './file.service';

export class VideoProcessingService {
    private fileService: FileService;
    private comskip: ComskipService;
    private ffmpeg: FfmpegService;

    constructor() {
        this.fileService = new FileService();
        this.comskip = new ComskipService();
        this.ffmpeg = new FfmpegService();
    }

    start() {
        const filesToProcess = this.fileService.getFiles(Config.InputFileFolderLocation, Config.InputVideoFileFormat, true);
        
        filesToProcess.forEach(x => {
            try {

                // TODO: Implement video prefix slice on first timestamp

                const timestamps = this.comskip.generateVideoTimestamps(x);
                const videoCutList = this.ffmpeg.removeTimeStampsFromVideo(x, timestamps);
                this.ffmpeg.concatVideoCutList(x, videoCutList);

                this.fileService.prefixFileName(x, 'Converted');

                this.fileService.clearDir(Config.TempDir);
            } catch(err) {
                const failedOutputPath = path.resolve(Config.FailedFileOutputLocation);
                this.fileService.copyFile(x, failedOutputPath);
                this.fileService.prefixFileName(x, 'Failed');

                console.log(err);
                console.log('error');
            }
        });
    }
}
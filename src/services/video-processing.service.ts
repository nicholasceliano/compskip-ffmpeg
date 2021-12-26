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
        
        const x = filesToProcess[0];
        // filesToProcess.forEach(x => { // <-- i might be able to fire off multiple threads of this
            try {
                const timestamps = this.comskip.generateVideoTimestamps(filesToProcess[0]);
                this.ffmpeg.removeTimeStampsFromVideo(x, timestamps);
                // do ffmpeg video processing
                    // loop though the timestamps and run ffmpeg to cut up video
                    // put cut up sections in temp folder
                        // put togeater the cut up sections and save it under the original file name to a destination output folder
                // move file to completed location
            } catch(err) {
                // move file to error location or log failure
                    // and flag the original file as failed? - maybe not
                console.log(err);
            }
        // });
    }
}
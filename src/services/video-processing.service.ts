import { Config } from '../config';
import { ComskipService } from './comskip.service';
import { FileService } from './file.service';

export class VideoProcessingService {
    private fileService: FileService;
    private comskip: ComskipService;

    constructor() {
        this.fileService = new FileService();
        this.comskip = new ComskipService();
    }

    start() {
        const filesToProcess = this.fileService.getFiles(Config.InputFileFolderLocation, Config.InputVideoFileFormat, true);
        
        // filesToProcess.forEach(x => { // <-- i might be able to fire off multiple threads of this
            try {
                this.comskip.generateVideoTimestamps(filesToProcess[0]);
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
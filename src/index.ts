import { VideoProcessingService } from './services/video-processing.service';

class Index {
    static init() {
        console.log('process started');
        new VideoProcessingService().start();
        console.log('process ended');
    }
}

Index.init();
import { VideoProcessingService } from './services/video-processing.service';

class Index {
    static init() {
        console.log('init');
        new VideoProcessingService().start();
        console.log('done');
    }
}

Index.init();
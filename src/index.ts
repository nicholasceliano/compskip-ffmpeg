class Index {
    
    static init() {
        console.log('init');
        // load data from a config
            // get show to parse
            // get file location of show to parse
            // destination of output files
            // get comskip init based on show
            

        // look up the files that are to be processed

        // loop through each file and do the following <-- i might be able to fire off multiple threads of this
            // run comskip and save the outputs to a temp folder under this directory
                // create the folder under this directory if it doesn't exist
            // get compskip edi output and parse it into an array to get the timestamps
            // loop though the timestamps and run ffmpeg to cut up video
                // put cut up sections in temp folder
            // put togeater the cut up sections and save it under the original file name to a destination output folder
                // don't overwrite the original file, keep it where it is
            // if this process fails write files that failed to a log file under this directory probably
                // and flag the original file as failed? - maybe not
    }
}

Index.init();
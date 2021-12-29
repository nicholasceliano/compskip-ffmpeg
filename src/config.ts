export enum Config {
    TempDir = './tmp/',

    InputFileFolderLocation = '',
    InputVideoFileFormat = '.ts',
    
    ComskipDir = '',
    ComskipIniFile = 'comskip-logo-bot-right',
    MinimumCommercialCt = 5,
    StartTrimSeconds = 180,

    ArchiveFileOutputLocation = '',
    FailedFileOutputLocation = '',
    SuccessFileOutputLocation = '',
    OutputVideoFormat = 'mp4',
    EncodeVideoOutput = 0 // 1 === true 0 === false <-- Need to Implement option '1'
}

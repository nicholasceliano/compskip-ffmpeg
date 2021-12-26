export class FormattingService {
    secondsToTimestamp(seconds: number) {
        let timestamp: string;
        if (!isNaN(seconds)) {
            const dateString = new Date(seconds * 1000).toISOString();
            timestamp = dateString.substring(dateString.length - 13, dateString.length - 2)
        }

        return timestamp;
    }
}
export function generateTrackingNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let trackingNumber = '';
    for (let i = 0; i < 2; i++) {
        trackingNumber += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 9; i++) {
        trackingNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    for (let i = 0; i < 2; i++) {
        trackingNumber += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return trackingNumber;
}
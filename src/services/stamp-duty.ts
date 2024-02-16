export function calculateStampDuty(price: number): number {
    // Calculate stamp duty based on price
    const stampDuty = Math.min(Math.floor(price / 1000), 1000);
    return stampDuty;
}

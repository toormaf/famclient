export const CommonUtil = {
    getObjectSize(obj: unknown): number {
        return new Blob([JSON.stringify(obj)]).size;
    }
};

const log = (content: any, value?: any) => {
    const isEnabled = true;

    if (isEnabled) {
        console.log(content || '', value || '');
    }
};

const timestamp = () => {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

export default {
    log,
    timestamp
};

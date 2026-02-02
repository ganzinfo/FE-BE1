/**
 * Custom Vue 3 Logging Plugin
 * Provides a global $log object with colored and timestamped output.
 */

const logger = {
    install: (app, options = {}) => {
        const isProd = import.meta.env.PROD;
        const prefix = options.prefix || '[APP]';

        const getTimestamp = () => new Date().toLocaleTimeString();

        const formatLog = (level, color, msg, data) => {
            if (isProd && level !== 'error') return;

            const styles = `color: white; background: ${color}; padding: 2px 5px; border-radius: 3px; font-weight: bold;`;
            const timeStyles = `color: gray; font-size: 0.8em;`;

            console.log(`%c${getTimestamp()}%c %c${level.toUpperCase()}%c ${prefix} ${msg}`, timeStyles, '', styles, '', '');
            if (data) {
                console.log('   ↳ Data:', data);
            }
        };

        const $log = {
            info: (msg, data) => formatLog('info', '#3498db', msg, data),
            success: (msg, data) => formatLog('success', '#2ecc71', msg, data),
            warn: (msg, data) => formatLog('warn', '#f1c40f', msg, data),
            error: (msg, data) => formatLog('error', '#e74c3c', msg, data),
            debug: (msg, data) => {
                if (!isProd) formatLog('debug', '#9b59b6', msg, data);
            }
        };

        // Make it available globally
        app.config.globalProperties.$log = $log;

        // Also provide it as a serializable object for direct imports if needed
        app.provide('logger', $log);
    }
};

export default logger;

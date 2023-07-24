const timeSinceTrunc = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    
    let interval = seconds / 604800

    // Return as weeks
    if (interval >= 1) {
        return `${Math.floor(interval)}w`
    }

    // Return as days
    interval = seconds / 86400;
    if (interval >= 1) {
        return `${Math.floor(interval)}d`
    }

    // Return as hours
    interval = seconds / 3600;
    if (interval >= 1) {
        return `${Math.floor(interval)}h`
    }

    // Returns as minutes or seconds
    interval = seconds / 60;
    if (interval >= 1) {
        return `${Math.floor(interval)}m`
    } else {
        return `${Math.floor(seconds)}s`
    }
}

export { timeSinceTrunc }
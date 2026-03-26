export const TIME = {
    MORNING: 'MORNING',
    AFTERNOON: 'AFTERNOON',
    EVENING: 'EVENING',
    NIGHT: 'NIGHT',
}

export const getTimeOfDay = (date) => {
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return TIME.MORNING;
    } else if (hours >= 12 && hours < 17) {
        return TIME.AFTERNOON;
    } else if (hours >= 17 && hours < 21) {
        return TIME.EVENING;
    } else {
        return TIME.NIGHT;
    }
}
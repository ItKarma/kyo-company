const formatNumber = (number) => {
    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    } else if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    } else {
        return number.toString();
    }
};


export default formatNumber
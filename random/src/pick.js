function pick(list, count = 1) {
    let picks = [];
    for (let i = 0; i < count; i++) {
        let randomIndex = Math.round(Math.random() * (list.length - 1));
        picks.push(list[randomIndex]);
    }
    if (count == 1) {
        picks = picks[0];
    }
    return picks;
}
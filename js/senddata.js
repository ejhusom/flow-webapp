async function saveData(string) {
    // dataArray.push("\n" + string);
    socket.emit('message', string);
}

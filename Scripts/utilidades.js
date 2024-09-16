function getFirstTwoNames(fullName) {
    // Divide a string em partes usando o espaço como delimitador
    const nameParts = fullName.split(' ');

    // Pega os dois primeiros elementos do array resultante
    const firstTwoNames = nameParts.slice(0, 2).join(' ');

    return firstTwoNames;
}

export { getFirstTwoNames };
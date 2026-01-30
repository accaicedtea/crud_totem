/**
 * Estrae gli ingredienti da una stringa formattata.
 * @param {string} ingredientsStr - Es: "1:Limone:50.00:0|3:Menta:10.00:1"
 * @returns {Array<{ id: string, nome: string, prezzo: number, boo: boolean }>}
 */
function parseIngredients(ingredientsStr) {
    if (!ingredientsStr) return [];
    return ingredientsStr.split('|').map(item => {
        const [id, nome, prezzo, boo] = item.split(':');
        return {
            id,
            nome,
            prezzo: parseFloat(prezzo),
            boo: boo === '1'
        };
    });
}
function parseAllergens(allergensStr) {
    if (!allergensStr) return [];
    return allergensStr.split('|').map(item => {
        const [name, icon] = item.split(':');
        return {
            name,
            icon
        };
    });
}

export default { parseIngredients, parseAllergens };
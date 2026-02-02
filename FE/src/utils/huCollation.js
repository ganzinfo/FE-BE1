/**
 * Hivatalos magyar ABC szerinti sorrendezést segítő eljárás.
 * Kezeli az ékezetes betűket és a kettős/hármas betűket (cs, gy, ly, ny, sz, ty, zs, dz, dzs).
 */

const huCollator = new Intl.Collator('hu', {
    usage: 'sort',
    sensitivity: 'variant', // Megkülönbözteti az ékezeteket és a kis/nagybetűket is
    caseFirst: 'upper'      // Opcionális: nagybetűk előre sorolása azonos betűk esetén
});

/**
 * Összehasonlít két magyar szöveget.
 * @param {string} a - Első szöveg
 * @param {string} b - Második szöveg
 * @returns {number} -1 ha a < b, 1 ha a > b, 0 ha egyenlőek
 */
export const compareHungarian = (a, b) => {
    return huCollator.compare(a || '', b || '');
};

/**
 * Magyar ABC szerint rendez egy tömböt.
 * @param {Array} array - A rendezendő tömb
 * @param {string|null} key - Opcionális kulcs, ha objektumokat rendezünk
 * @param {number} order - 1: növekvő (ASC), -1: csökkenő (DESC)
 * @returns {Array} - A rendezett tömb másolata
 */
export const sortHungarian = (array, key = null, order = 1) => {
    return [...array].sort((a, b) => {
        const valA = key ? (a[key] || '') : a;
        const valB = key ? (b[key] || '') : b;
        return compareHungarian(valA, valB) * order;
    });
};

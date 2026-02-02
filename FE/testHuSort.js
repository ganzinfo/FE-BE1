// testHuSort.js - Magyar sorrendezés ellenőrzése
// Futtatás: node testHuSort.js

// Mivel a huCollation.js ESM exportot használ, itt egy gyors CommonJS verzió a teszthez
const huCollator = new Intl.Collator('hu', {
    usage: 'sort',
    sensitivity: 'variant'
});

const testCases = [
    { title: 'Ékezetek (a < á)', samples: ['alma', 'álom'], expected: ['alma', 'álom'] },
    { title: 'Ékezetek vegyesen', samples: ['őz', 'óra', 'ölt', 'olvas'], expected: ['olvas', 'óra', 'ölt', 'őz'] },
    { title: 'Kettős betűk (c < cs)', samples: ['cukor', 'csata', 'cica'], expected: ['cica', 'cukor', 'csata'] },
    { title: 'Kettős betűk (s < sz)', samples: ['szép', 'soha', 'szár'], expected: ['soha', 'szár', 'szép'] },
    { title: 'Hármas betűk (d < dz < dzs)', samples: ['edző', 'dzsungel', 'dzéta', 'daru'], expected: ['daru', 'dzéta', 'dzsungel', 'edző'] },
    { title: 'Összetett példa (Z < Zs)', samples: ['Zoltán', 'Zsófia', 'Zebra', 'Zsolt'], expected: ['Zebra', 'Zoltán', 'Zsófia', 'Zsolt'] }
];

console.log('--- MAGYAR ABC RENDEZÉS TESZT ---\n');

testCases.forEach(tc => {
    const sorted = [...tc.samples].sort(huCollator.compare);
    const success = JSON.stringify(sorted) === JSON.stringify(tc.expected);

    console.log(`${success ? '✅' : '❌'} ${tc.title}`);
    if (!success) {
        console.log(`   Eredeti:  ${tc.samples}`);
        console.log(`   Várt:     ${tc.expected}`);
        console.log(`   Kapott:   ${sorted}`);
    }
});

console.log('\n-------------------------------');

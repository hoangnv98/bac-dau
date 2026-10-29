import { lapLaSo, formatLaSo } from '../index.js';

const laSo = lapLaSo({
  day: 24, month: 10, year: 2026,   // Dương lịch
  hour: 7,                          // 7h sáng = giờ Thìn
  gender: 'nam'
});

console.log(formatLaSo(laSo));
console.log('\nJSON:');
console.log(JSON.stringify(laSo, null, 2));

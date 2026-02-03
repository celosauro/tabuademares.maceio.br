const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tabua_mares_maceio_2026_2027.json', 'utf8'));

const grouped = {};

data.dados.forEach(item => {
  const { ano, mes, dia, hora, altura } = item;
  
  if (!grouped[ano]) grouped[ano] = {};
  if (!grouped[ano][mes]) grouped[ano][mes] = {};
  if (!grouped[ano][mes][dia]) grouped[ano][mes][dia] = [];
  
  grouped[ano][mes][dia].push({ hora, altura });
});

const resultado = {
  titulo: data.titulo,
  fonte: data.fonte,
  dataExtracao: data.dataExtracao,
  dados: Object.keys(grouped).sort((a,b) => a-b).map(ano => ({
    ano: parseInt(ano),
    meses: Object.keys(grouped[ano]).sort((a,b) => a-b).map(mes => ({
      mes: parseInt(mes),
      dias: Object.keys(grouped[ano][mes]).sort((a,b) => a-b).map(dia => ({
        dia: parseInt(dia),
        mare: grouped[ano][mes][dia]
      }))
    }))
  }))
};

fs.writeFileSync('tabua_mares_maceio_2026_2027.json', JSON.stringify(resultado, null, 2));
console.log('Arquivo reorganizado com sucesso!');
console.log('Anos:', resultado.dados.length);

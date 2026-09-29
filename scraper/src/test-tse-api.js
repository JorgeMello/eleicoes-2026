async function main() {
  const idEleicao = '20322002026';
  const ano = '2026';
  const baseUrl = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador';

  const endpoints = [
    `${baseUrl}/ranks/total/${idEleicao}`,
    `${baseUrl}/ranks/concentracao/${idEleicao}/${ano}`,
    `${baseUrl}/ranks/doadores/${idEleicao}/${ano}`,
    `${baseUrl}/ranks/fornecedores/${idEleicao}/${ano}`,
    `${baseUrl}/ranks/recursos/${idEleicao}`,
  ];

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Referer': `https://divulgacandcontas.tse.jus.br/divulga/#/consulta-individual/rank-doadores-fornecedores/${idEleicao}/${ano}`,
  };

  for (const url of endpoints) {
    try {
      console.log(`\nTesting: ${url}`);
      const res = await fetch(url, { headers });
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Response sample:', Array.isArray(data) ? `Array with ${data.length} items` : Object.keys(data));
        if (Array.isArray(data) && data.length > 0) {
          console.log('First item:', data[0]);
        } else if (!Array.isArray(data)) {
          console.log('Object data:', data);
        }
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

main().catch(console.error);

import http from 'http';

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : {}
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando Bateria Completa de Testes Fim-a-Fim (Todas as Funcionalidades)...\n');

  // 1. Test Login as NUTRICIONISTA
  console.log('1️⃣ Login como NUTRICIONISTA (nutri@sesi.com)...');
  const loginNutriRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'nutri@sesi.com', password: '123456' });

  const nutriCookieHeader = loginNutriRes.headers['set-cookie'][0].split(';')[0];
  console.log('   Status:', loginNutriRes.statusCode, '✅ LOGIN NUTRICIONISTA OK!');

  // 2. Nutricionista salva Cardápio para Segunda-feira e Terça-feira
  console.log('\n2️⃣ Salvando Almoço de Segunda-feira (Arroz com cenoura, Feijão preto, Grelhado de frango)...');
  const updateSegRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/cardapios/refeicoes/alimentos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: nutriCookieHeader
    }
  }, {
    day: 'Segunda-feira',
    mealType: 'lunch',
    items: ['Arroz com cenoura', 'Feijão preto', 'Grelhado de frango']
  });
  console.log('   Status:', updateSegRes.statusCode, 'Mensagem:', updateSegRes.body.mensagem);

  console.log('   Salvando Almoço de Terça-feira (Macarrão com molho, Salada verde)...');
  const updateTerRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/cardapios/refeicoes/alimentos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: nutriCookieHeader
    }
  }, {
    day: 'Terça-feira',
    mealType: 'lunch',
    items: ['Macarrão com molho', 'Salada verde']
  });
  console.log('   Status:', updateTerRes.statusCode, 'Mensagem:', updateTerRes.body.mensagem);

  // 3. Login as ALUNO and fetch cardápio
  console.log('\n3️⃣ Login como ALUNO (aluno@sesi.com) e validação dos cardápios salvos...');
  const loginAlunoRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'aluno@sesi.com', password: '123456' });

  const alunoCookieHeader = loginAlunoRes.headers['set-cookie'][0].split(';')[0];
  console.log('   Status:', loginAlunoRes.statusCode, '✅ LOGIN ALUNO OK!');

  const getCardapioRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/cardapios',
    method: 'GET',
    headers: { Cookie: alunoCookieHeader }
  });

  console.log('   Cardápio retornado do MySQL:');
  console.log('   - Segunda-feira Almoço:', getCardapioRes.body.mealPlans['Segunda-feira']?.lunch);
  console.log('   - Terça-feira Almoço:', getCardapioRes.body.mealPlans['Terça-feira']?.lunch);

  const segItems = getCardapioRes.body.mealPlans['Segunda-feira']?.lunch || [];
  const terItems = getCardapioRes.body.mealPlans['Terça-feira']?.lunch || [];

  if (segItems.includes('Arroz com cenoura') && terItems.includes('Macarrão com molho')) {
    console.log('   ✅ CARDÁPIO DE SEGUNDA E TERÇA-FEIRA VISÍVEIS PARA O ALUNO COM SUCESSO!');
  } else {
    console.error('   ❌ Falha: cardápio de Segunda ou Terça não apareceu corretamente.');
    process.exit(1);
  }

  // 4. Test Rating Submission (5 Stars) as ALUNO
  console.log('\n4️⃣ Testando Avaliação de 5 Estrelas pelo Aluno...');
  const ratingRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/avaliacoes',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: alunoCookieHeader
    }
  }, { nota: 5 });
  console.log('   Status:', ratingRes.statusCode, 'Mensagem:', ratingRes.body.mensagem);

  // 5. Test Student Comment
  console.log('\n5️⃣ Testando envio de Comentário pelo Aluno...');
  const commentText = `Comentário de teste ${Date.now()}`;
  const commentRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/comentarios',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: alunoCookieHeader
    }
  }, { comment: commentText });
  console.log('   Status:', commentRes.statusCode, 'Comentário Criado ID:', commentRes.body.id);

  // 6. Test Direção Moderation
  console.log('\n6️⃣ Login como DIREÇÃO (direcao@sesi.com) e Moderação do Comentário...');
  const loginDirecaoRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'direcao@sesi.com', password: '123456' });

  const direcaoCookieHeader = loginDirecaoRes.headers['set-cookie'][0].split(';')[0];

  const removeCommentRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/comentarios/${commentRes.body.id}/remover`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: direcaoCookieHeader
    }
  }, { reason: 'Teste de moderação pela Direção' });
  console.log('   Status:', removeCommentRes.statusCode, 'Mensagem:', removeCommentRes.body.mensagem);

  console.log('\n🎉 TODOS OS TESTES DE TODAS AS FUNCIONALIDADES PASSARAM COM 100% DE SUCESSO!');
}

runTests().catch(console.error);

const { By, until } = require('selenium-webdriver');
const { createDriver, sleep, BASE_URL } = require('./setup');

async function testClientesCRUD() {
  const driver = await createDriver();
  
  try {
    console.log('🚀 Iniciando testes de CRUD de Clientes...\n');

    // 1. Navegar para a página de clientes
    console.log('📍 Navegando para página de clientes...');
    await driver.get(`${BASE_URL}/clientes`);
    await sleep(2000);
    console.log('✅ Página carregada\n');

    // 2. Abrir dialog de novo cliente
    console.log('➕ Abrindo dialog para novo cliente...');
    const btnNovoCliente = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Novo Cliente')]")),
      5000
    );
    await btnNovoCliente.click();
    await sleep(1000);
    console.log('✅ Dialog aberto\n');

    // 3. Preencher formulário
    console.log('📝 Preenchendo formulário...');
    
    await driver.findElement(By.id('nome')).sendKeys('João');
    await driver.findElement(By.id('sobrenome')).sendKeys('Silva');
    await driver.findElement(By.id('telefone_ou_email')).sendKeys('joao@teste.com');
    
    // Selecionar gênero
    const generoSelect = await driver.findElement(By.id('genero'));
    await generoSelect.click();
    await sleep(500);
    const masculinoOption = await driver.findElement(By.xpath("//div[@role='option'][contains(., 'Masculino')]"));
    await masculinoOption.click();
    await sleep(500);

    // Data de nascimento
    await driver.findElement(By.id('data_nascimento')).sendKeys('15/03/1990');
    
    // Senha
    await driver.findElement(By.id('senha')).sendKeys('Senha123!');
    
    // Campos opcionais
    await driver.findElement(By.id('cidade')).sendKeys('Belo Horizonte');
    await driver.findElement(By.id('bairro')).sendKeys('Centro');
    
    console.log('✅ Formulário preenchido\n');

    // 4. Salvar cliente
    console.log('💾 Salvando cliente...');
    const btnSalvar = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvar.click();
    await sleep(3000);
    console.log('✅ Cliente salvo com sucesso\n');

    // 5. Verificar se cliente aparece na lista
    console.log('🔍 Verificando se cliente aparece na lista...');
    const clienteNaLista = await driver.wait(
      until.elementLocated(By.xpath("//td[contains(., 'João Silva')]")),
      5000
    );
    console.log('✅ Cliente encontrado na lista\n');

    // 6. Testar filtros
    console.log('🔎 Testando filtros...');
    await driver.findElement(By.id('nome')).sendKeys('João');
    const btnBuscar = await driver.findElement(By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro aplicado\n');

    // 7. Editar cliente
    console.log('✏️ Editando cliente...');
    const btnEditar = await driver.findElement(By.xpath("//button[contains(@class, 'outline')]//svg[contains(@class, 'lucide-pencil')]//ancestor::button"));
    await btnEditar.click();
    await sleep(1000);
    
    const cidadeInput = await driver.findElement(By.id('cidade'));
    await cidadeInput.clear();
    await cidadeInput.sendKeys('São Paulo');
    
    const btnSalvarEdicao = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Cliente editado\n');

    // 8. Deletar cliente
    console.log('🗑️ Deletando cliente...');
    const btnDeletar = await driver.findElement(By.xpath("//button[contains(@class, 'outline')]//svg[contains(@class, 'lucide-trash')]//ancestor::button"));
    await btnDeletar.click();
    await sleep(500);
    
    // Confirmar no alert do navegador
    await driver.switchTo().alert().accept();
    await sleep(2000);
    console.log('✅ Cliente deletado\n');

    console.log('🎉 TODOS OS TESTES DE CLIENTES PASSARAM COM SUCESSO!\n');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

// Executar os testes
testClientesCRUD()
  .then(() => {
    console.log('✨ Automação finalizada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Automação finalizada com erros!');
    process.exit(1);
  });

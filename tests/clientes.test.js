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
      10000
    );
    await btnNovoCliente.click();
    await sleep(2000); // Aguardar animação do dialog
    console.log('✅ Dialog aberto\n');

    // 3. Preencher formulário
    console.log('📝 Preenchendo formulário...');
    
    // Esperar que os campos estejam visíveis e interativos
    const nomeInput = await driver.wait(
      until.elementLocated(By.id('nome')),
      10000
    );
    await driver.wait(until.elementIsVisible(nomeInput), 5000);
    await nomeInput.sendKeys('João');
    
    const sobrenomeInput = await driver.findElement(By.id('sobrenome'));
    await sobrenomeInput.sendKeys('Silva');
    
    const telefoneInput = await driver.findElement(By.id('telefone_ou_email'));
    await telefoneInput.sendKeys('joao@teste.com');
    
    // Selecionar gênero
    await sleep(500);
    const generoButton = await driver.findElement(By.css('button[role="combobox"]'));
    await generoButton.click();
    await sleep(1000);
    const masculinoOption = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='option'][contains(text(), 'Masculino')]")),
      5000
    );
    await masculinoOption.click();
    await sleep(500);

    // Data de nascimento
    const dataInput = await driver.findElement(By.id('data_nascimento'));
    await dataInput.sendKeys('15/03/1990');
    
    // Senha
    const senhaInput = await driver.findElement(By.id('senha'));
    await senhaInput.sendKeys('Senha123!');
    
    // Campos opcionais
    const cidadeInput = await driver.findElement(By.id('cidade'));
    await cidadeInput.sendKeys('Belo Horizonte');
    
    const bairroInput = await driver.findElement(By.id('bairro'));
    await bairroInput.sendKeys('Centro');
    
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
    const filtroNome = await driver.wait(
      until.elementLocated(By.css('input[placeholder*="Nome"]')),
      5000
    );
    await filtroNome.sendKeys('João');
    const btnBuscar = await driver.findElement(By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro aplicado\n');

    // 7. Editar cliente
    console.log('✏️ Editando cliente...');
    const btnEditar = await driver.wait(
      until.elementLocated(By.css('button[variant="outline"] svg.lucide-pencil')),
      5000
    );
    await driver.executeScript("arguments[0].closest('button').click();", btnEditar);
    await sleep(2000);
    
    const cidadeEditInput = await driver.wait(
      until.elementLocated(By.id('cidade')),
      5000
    );
    await cidadeEditInput.clear();
    await cidadeEditInput.sendKeys('São Paulo');
    
    const btnSalvarEdicao = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Cliente editado\n');

    // 8. Deletar cliente
    console.log('🗑️ Deletando cliente...');
    const btnDeletar = await driver.wait(
      until.elementLocated(By.css('button[variant="outline"] svg.lucide-trash-2')),
      5000
    );
    await driver.executeScript("arguments[0].closest('button').click();", btnDeletar);
    await sleep(1000);
    
    // Confirmar no alert do navegador
    const alert = await driver.wait(until.alertIsPresent(), 5000);
    await alert.accept();
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

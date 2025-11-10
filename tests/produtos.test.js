const { By, until } = require('selenium-webdriver');
const { createDriver, sleep, BASE_URL } = require('./setup');
const path = require('path');

async function testProdutosCRUD() {
  const driver = await createDriver();
  
  try {
    console.log('🚀 Iniciando testes de CRUD de Produtos...\n');

    // 1. Navegar para a página de produtos
    console.log('📍 Navegando para página de produtos...');
    await driver.get(`${BASE_URL}/produtos`);
    await sleep(2000);
    console.log('✅ Página carregada\n');

    // 2. Abrir dialog de novo produto
    console.log('➕ Abrindo dialog para novo produto...');
    const btnNovoProduto = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Novo Produto')]")),
      10000
    );
    await btnNovoProduto.click();
    await sleep(2000); // Aguardar animação do dialog
    console.log('✅ Dialog aberto\n');

    // 3. Preencher formulário
    console.log('📝 Preenchendo formulário...');
    
    // Esperar que os campos estejam visíveis e interativos
    const nomeInput = await driver.wait(
      until.elementLocated(By.id('nome_produto')),
      10000
    );
    await driver.wait(until.elementIsVisible(nomeInput), 5000);
    await nomeInput.sendKeys('Camiseta Básica');
    
    const tipoInput = await driver.findElement(By.id('tipo'));
    await tipoInput.sendKeys('Camiseta');
    
    const caracInput = await driver.findElement(By.id('caracteristicas'));
    await caracInput.sendKeys('Algodão, Confortável, Básica');
    
    // Selecionar marca
    await sleep(500);
    const marcaButton = await driver.wait(
      until.elementLocated(By.css('button[role="combobox"]')),
      5000
    );
    await marcaButton.click();
    await sleep(1000);
    const primeiraMarca = await driver.wait(
      until.elementLocated(By.css('div[role="option"]')),
      5000
    );
    await primeiraMarca.click();
    await sleep(500);

    // Campos de texto
    const tamanhoInput = await driver.findElement(By.id('tamanho'));
    await tamanhoInput.sendKeys('M');
    
    // Selecionar cores (múltiplas)
    const corSelect = await driver.wait(
      until.elementLocated(By.id('cor')),
      5000
    );
    // Para select múltiplo, usar Actions para Ctrl+Click
    const actions = driver.actions();
    const corAzul = await driver.findElement(By.xpath("//option[contains(text(), 'Azul')]"));
    const corPreto = await driver.findElement(By.xpath("//option[contains(text(), 'Preto')]"));
    await actions.keyDown(driver.Key.CONTROL).click(corAzul).click(corPreto).keyUp(driver.Key.CONTROL).perform();
    await sleep(500);
    
    // Preço
    const precoInput = await driver.findElement(By.id('preco'));
    await precoInput.sendKeys('49.90');
    
    // Quantidade
    const quantidadeInput = await driver.findElement(By.id('quantidade_estoque'));
    await quantidadeInput.sendKeys('100');
    
    // Tecido
    const tecidoInput = await driver.findElement(By.id('tecido'));
    await tecidoInput.sendKeys('100% Algodão');
    
    console.log('✅ Formulário preenchido\n');
    console.log('⚠️ NOTA: Upload de imagem precisa ser testado manualmente\n');

    // 4. Salvar produto
    console.log('💾 Salvando produto...');
    const btnSalvar = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvar.click();
    await sleep(3000);
    console.log('✅ Produto salvo com sucesso\n');

    // 5. Verificar se produto aparece na lista
    console.log('🔍 Verificando se produto aparece na lista...');
    const produtoNaLista = await driver.wait(
      until.elementLocated(By.xpath("//td[contains(., 'Camiseta Básica')]")),
      5000
    );
    console.log('✅ Produto encontrado na lista\n');

    // 6. Testar filtros
    console.log('🔎 Testando filtros...');
    const filtroNome = await driver.wait(
      until.elementLocated(By.id('nome_produto')),
      5000
    );
    await filtroNome.sendKeys('Camiseta');
    const btnBuscar = await driver.findElement(By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro aplicado\n');

    // 7. Testar filtro de preço
    console.log('💰 Testando filtro de preço...');
    const precoMinInput = await driver.findElement(By.id('preco_min'));
    await precoMinInput.sendKeys('40');
    const precoMaxInput = await driver.findElement(By.id('preco_max'));
    await precoMaxInput.sendKeys('60');
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro de preço aplicado\n');

    // 8. Editar produto
    console.log('✏️ Editando produto...');
    const btnEditar = await driver.wait(
      until.elementLocated(By.css('button[variant="outline"] svg.lucide-pencil')),
      5000
    );
    await driver.executeScript("arguments[0].closest('button').click();", btnEditar);
    await sleep(2000);
    
    const precoEditInput = await driver.wait(
      until.elementLocated(By.id('preco')),
      5000
    );
    await precoEditInput.clear();
    await precoEditInput.sendKeys('59.90');
    
    const btnSalvarEdicao = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Produto editado\n');

    // 9. Deletar produto
    console.log('🗑️ Deletando produto...');
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
    console.log('✅ Produto deletado\n');

    console.log('🎉 TODOS OS TESTES DE PRODUTOS PASSARAM COM SUCESSO!\n');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

// Executar os testes
testProdutosCRUD()
  .then(() => {
    console.log('✨ Automação finalizada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Automação finalizada com erros!');
    process.exit(1);
  });

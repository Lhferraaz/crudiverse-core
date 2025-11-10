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
      5000
    );
    await btnNovoProduto.click();
    await sleep(1000);
    console.log('✅ Dialog aberto\n');

    // 3. Preencher formulário
    console.log('📝 Preenchendo formulário...');
    
    await driver.findElement(By.id('nome_produto')).sendKeys('Camiseta Básica');
    await driver.findElement(By.id('tipo')).sendKeys('Camiseta');
    await driver.findElement(By.id('caracteristicas')).sendKeys('Algodão, Confortável, Básica');
    
    // Selecionar marca
    const marcaSelect = await driver.findElement(By.xpath("//button[@role='combobox' and contains(@aria-label, 'marca')]"));
    await marcaSelect.click();
    await sleep(500);
    const primeiramarca = await driver.findElement(By.xpath("//div[@role='option'][1]"));
    await primeiramarca.click();
    await sleep(500);

    await driver.findElement(By.id('tamanho')).sendKeys('M');
    
    // Selecionar cores (múltiplas)
    const corSelect = await driver.findElement(By.xpath("//select[@id='cor']"));
    await corSelect.click();
    await sleep(500);
    const corAzul = await driver.findElement(By.xpath("//option[contains(., 'Azul')]"));
    const corPreto = await driver.findElement(By.xpath("//option[contains(., 'Preto')]"));
    await corAzul.click();
    await corPreto.click();
    
    // Preço
    await driver.findElement(By.id('preco')).sendKeys('49.90');
    
    // Quantidade
    await driver.findElement(By.id('quantidade_estoque')).sendKeys('100');
    
    // Tecido
    await driver.findElement(By.id('tecido')).sendKeys('100% Algodão');
    
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
    await driver.findElement(By.id('nome_produto')).sendKeys('Camiseta');
    const btnBuscar = await driver.findElement(By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro aplicado\n');

    // 7. Testar filtro de preço
    console.log('💰 Testando filtro de preço...');
    await driver.findElement(By.id('preco_min')).sendKeys('40');
    await driver.findElement(By.id('preco_max')).sendKeys('60');
    await btnBuscar.click();
    await sleep(2000);
    console.log('✅ Filtro de preço aplicado\n');

    // 8. Editar produto
    console.log('✏️ Editando produto...');
    const btnEditar = await driver.findElement(By.xpath("//button[contains(@class, 'outline')]//svg[contains(@class, 'lucide-pencil')]//ancestor::button"));
    await btnEditar.click();
    await sleep(1000);
    
    const precoInput = await driver.findElement(By.id('preco'));
    await precoInput.clear();
    await precoInput.sendKeys('59.90');
    
    const btnSalvarEdicao = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Produto editado\n');

    // 9. Deletar produto
    console.log('🗑️ Deletando produto...');
    const btnDeletar = await driver.findElement(By.xpath("//button[contains(@class, 'outline')]//svg[contains(@class, 'lucide-trash')]//ancestor::button"));
    await btnDeletar.click();
    await sleep(500);
    
    // Confirmar no alert do navegador
    await driver.switchTo().alert().accept();
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

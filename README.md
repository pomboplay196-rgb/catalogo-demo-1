# Catálogo digital premium — modelo reutilizável

Este projeto é um catálogo estático responsivo, sem necessidade de instalar ferramentas ou escrever código para utilizá-lo. Os arquivos são editáveis para cada comerciante.

## O que está incluído
- Layout responsivo para celular e computador.
- Busca por nome, categoria e descrição.
- Filtro por categoria e ordenação por preço/nome.
- Modal de detalhes de produto.
- Pedido com vários produtos, quantidade e total estimado.
- Botões de WhatsApp para produto individual, contato e pedido completo.
- Configuração separada da loja (`config.js`) e produtos (`products.js`).

## Importante antes de usar com clientes
Os oito produtos são exemplos fictícios. As imagens são fotos de referência hospedadas no Unsplash, não comprovam estoque ou relação com produtos reais. Substitua imagens, descrições e preços por informações fornecidas e autorizadas pelo comerciante. O catálogo não processa pagamentos e não confirma estoque automaticamente. O valor no pedido é apenas estimado.

## Como personalizar sem programar
1. Abra `config.js` em um editor de texto simples (por exemplo, Bloco de Notas).
2. Altere `storeName`, `storeSubtitle`, textos e `whatsapp`.
3. O WhatsApp deve conter código do país + DDD + número, apenas dígitos. O número solicitado está preenchido como `5517996096607`. Confira-o antes de publicar.
4. Abra `products.js` no Bloco de Notas.
5. Para cada produto, altere `name`, `category`, `price`, `description`, `image` e `tag`.
6. Para usar foto própria, hospede-a em um endereço público HTTPS e cole o endereço no campo `image`. Mantenha aspas e vírgulas.
7. Salve os arquivos e abra `index.html` no navegador para conferir.

Se preferir não editar arquivos, envie os dados e fotos para alguém que possa personalizar o modelo. O modelo é reutilizável, mas o cadastro de cada produto exige inserir seus dados no arquivo `products.js`.

## Como publicar gratuitamente com GitHub Pages
1. Crie ou entre em uma conta no GitHub.
2. Crie um repositório público, por exemplo `catalogo-cliente`.
3. Clique em **Add file > Upload files** e envie `index.html`, `styles.css`, `products.js`, `config.js`, `app.js` e este README (ou arraste os arquivos extraídos do ZIP).
4. Clique em **Commit changes**.
5. No repositório, abra **Settings > Pages**.
6. Em **Build and deployment**, selecione **Deploy from a branch**.
7. Selecione a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
8. Aguarde a publicação. O endereço ficará visível na seção Pages, normalmente no formato `https://SEU-USUARIO.github.io/catalogo-cliente/`.
9. Abra o endereço no celular e teste busca, detalhes e botões do WhatsApp.

A publicação pública pode levar alguns minutos. Não foi feita automaticamente por este projeto; você precisa concluir esses passos na sua conta.

## Alternativa simples
Você pode publicar os arquivos em um serviço de hospedagem estática com plano gratuito, como Netlify, seguindo o fluxo atual de upload de pasta/site do próprio serviço. Confira os limites e condições antes de publicar.

## Observações
- Não inclua informações privadas de clientes no repositório público.
- O número de WhatsApp é visível no arquivo `config.js` e o link de pedido abre o WhatsApp do cliente.
- Fotos externas exigem internet para carregar.
- Teste o número de WhatsApp e todos os links antes de entregar a um comerciante.
- Os textos de marca e os produtos são demonstrativos; personalize para cada cliente.

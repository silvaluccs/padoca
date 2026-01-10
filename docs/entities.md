# Entidades

## Produto
- Representa um item vendido pela loja
- Campos: nome, preço, categoria, ativo, imagem
- Pode fazer parte de um combo

## Combo
- Representa uma oferta composta por vários produtos
- Campos: nome, preço, descrição, ativo, imagem
- Contém múltiplos produtos

## Pedido
- Representa um pedido feito por um cliente
- Campos: nome_do_cliente, itens, preço_total, status
- Gerado a partir de produtos e/ou combos

## Admin
- Representa o dono da loja
- Campos: email, senha_hash
- Gerencia produtos, combos e pedidos

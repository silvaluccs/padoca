# Rotas

As rotas configuradas no projeto se encontram organizadas conforme a seguinte definição:

## Rotas públicas

### Produtos e Combos
- `GET /products` — Listagem de todos os produtos
- `GET /combos` — Listagem de combos disponíveis
- `POST /orders` — Criação de um pedido

## Rotas privadas (admin)

### Autenticação
- `POST /auth/login` — Autenticação e login do admin

### Gestão de pedidos
- `GET /orders/:id` — Visualização de um pedido específico
- `DELETE /orders/:id` — Remoção de um pedido existente
- `POST /orders/:id/checkout` — Finalização/checkout do pedido

### Gestão de itens do pedido
- `GET /orders/:order_id/order_items` — Ver itens de um pedido
- `POST /orders/:order_id/order_items` — Criar novo item em um pedido
- `DELETE /orders/:order_id/order_items/:id` — Deletar um item do pedido

## Rota principal
- `GET /` — Página inicial (exibe produtos)


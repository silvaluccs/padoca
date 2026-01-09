

# Arquitetura do Projeto

O Padoca é uma aplicação web simples voltada para pequenas padarias e lojas de salgados, oferecendo uma vitrine digital e a possibilidade de criar pré-pedidos.

O projeto é organizado como um monorepo, concentrando frontend e backend no mesmo repositório para facilitar o desenvolvimento e a visualização do projeto como um todo.

## Organização do repositório

- `frontend/`: aplicação frontend responsável pela interface com o usuário.
- `backend/`: aplicação backend responsável pela API e regras de negócio.
- `docs/`: documentação simples com decisões e definições do projeto.

## Comunicação

O frontend consome uma API HTTP fornecida pelo backend, utilizando requisições REST e troca de dados em formato JSON.

O envio do pedido final é feito via WhatsApp, a partir das informações montadas no frontend.

## Decisões de arquitetura

- Arquitetura frontend e backend separados.
- Backend exposto apenas como API.
- Projeto em monorepo.
- Não é um sistema de e-commerce.
- Não há pagamento online no MVP.

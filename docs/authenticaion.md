# Authentication

## Objetivo

Definir uma autenticação **simples e direta** para permitir que **apenas o dono da padaria** gerencie produtos e visualize pedidos, sem introduzir complexidade desnecessária no projeto.

Este projeto **não possui usuários finais autenticados**. Clientes não precisam de conta para realizar pedidos.

---

## Conceito-chave

* Existe **apenas um administrador (Admin)**
* O Admin representa o **dono da loja**
* A autenticação serve **exclusivamente** para acessar o painel administrativo

---

## Escopo da Autenticação

### O que ESTÁ incluído

* Login do administrador (email + senha)
* Proteção de rotas administrativas
* Sessão autenticada (cookie ou token simples)
* Acesso ao painel de gestão

### O que NÃO está incluído

* Cadastro público de usuários
* Múltiplos administradores
* Recuperação de senha
* Permissões avançadas (roles)
* Autenticação para clientes

---

## Entidade: Admin

A entidade `Admin` é única e representa o dono da padaria.

Campos mínimos:

* `id`
* `email`
* `password_hash`
* `created_at`

> O Admin pode ser criado manualmente (seed inicial) ou via configuração de ambiente.

---

## Fluxo de Autenticação

1. O Admin acessa a rota `/admin/login`
2. Informa email e senha
3. O backend valida as credenciais
4. Uma sessão autenticada é criada
5. O Admin ganha acesso às rotas protegidas

---

## Rotas Protegidas

As seguintes ações **exigem autenticação**:

* Criar produtos
* Editar produtos
* Atualizar preços
* Ativar/desativar produtos
* Visualizar pedidos

---

## Rotas Públicas

As seguintes rotas **não exigem autenticação**:

* Exibição do cardápio
* Listagem de produtos
* Criação

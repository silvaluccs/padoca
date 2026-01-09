# Database Structure

## products
- id
- name
- price
- category
- active
- created_at
- updated_at

## combos
- id
- name
- price
- description
- active
- created_at
- updated_at

## combo_products
- id
- combo_id
- product_id
- quantity

## orders
- id
- customer_name
- total_price
- status
- created_at
- updated_at

## order_items
- id
- order_id
- item_type (product or combo)
- item_id
- name_snapshot
- unit_price
- quantity
- subtotal

## admins
- id
- email
- password_digest
- created_at
- updated_at

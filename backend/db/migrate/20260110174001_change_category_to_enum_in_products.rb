class ChangeCategoryToEnumInProducts < ActiveRecord::Migration[7.1]
  def up
    # 1. Cria o tipo ENUM
    execute <<-SQL
      CREATE TYPE product_category AS ENUM ('salgado', 'doce', 'bebida');
    SQL

    # 2. Altera a coluna usando SQL puro para evitar erro de sintaxe do ActiveRecord
    execute <<-SQL
      ALTER TABLE products#{' '}
      ALTER COLUMN category TYPE product_category#{' '}
      USING category::product_category;
    SQL

    # 3. Define o padrão e a restrição de nulo (agora via ActiveRecord)
    change_column_default :products, :category, "salgado"
    change_column_null :products, :category, false
  end

  def down
    # Reverte para string
    execute <<-SQL
      ALTER TABLE products#{' '}
      ALTER COLUMN category TYPE varchar#{' '}
      USING category::text;
    SQL

    execute "DROP TYPE product_category;"
  end
end

---
sidebar_position: 12
---

# Référence API

Cette page documente l'API complète de l'ORM, avec tous les types, interfaces et méthodes disponibles.

## Configuration

### `ConnectionConfig`

Configuration de la connexion à la base de données.

```go
type ConnectionConfig struct {
    Host     string // Hôte de la base de données
    Port     int    // Port de la base de données
    Username string // Nom d'utilisateur
    Password string // Mot de passe
    Database string // Nom de la base de données
    SSLMode  string // Mode SSL (disable, require, etc.)
}
```

### `ConfigBuilder`

Builder pour créer une configuration.

```go
type ConfigBuilder interface {
    WithDialect(dialectType interface{}) *ConfigBuilder
    WithHost(host string) *ConfigBuilder
    WithPort(port int) *ConfigBuilder
    WithUsername(username string) *ConfigBuilder
    WithPassword(password string) *ConfigBuilder
    WithDatabase(database string) *ConfigBuilder
    WithSSLMode(sslMode string) *ConfigBuilder
    WithEnvFile(path string) *ConfigBuilder
    FromEnv() *ConfigBuilder
    WithAutoCreateDatabase() *ConfigBuilder
    Build() (ConnectionConfig, error)
}
```

## ORM Principal

### `SimpleORM`

Point d'entrée principal de l'ORM.

```go
type SimpleORM interface {
    WithDialect(dialectType interface{}) *SimpleORM
    WithMySQL() *SimpleORM
    WithPostgreSQL() *SimpleORM
    WithConfig(config ConnectionConfig) *SimpleORM
    WithConfigBuilder(builder *ConfigBuilder) *SimpleORM
    RegisterModel(model interface{}) *SimpleORM
    RegisterModels(models ...interface{}) *SimpleORM
    Connect() error
    Close() error
    IsConnected() bool
    GetORM() ORM
    Query(model interface{}) QueryBuilder
    Repository(model interface{}) Repository
}
```

### `ORM`

Interface principale de l'ORM.

```go
type ORM interface {
    // Gestion de la connexion
    Connect(config ConnectionConfig) error
    Close() error
    IsConnected() bool
    GetDialect() Dialect
    
    // Gestion des modèles
    RegisterModel(model interface{}) error
    GetMetadata(model interface{}) (*ModelMetadata, error)
    
    // Requêtes et opérations
    Query(model interface{}) QueryBuilder
    Raw(sql string, args ...interface{}) QueryBuilder
    Repository(model interface{}) Repository
    
    // Transactions
    Transaction(fn func(ORM) error) error
    TransactionWithContext(ctx context.Context, fn func(ORM) error) error
    
    // Migrations
    CreateTable(model interface{}) error
    DropTable(model interface{}) error
    Migrate() error
}
```

## Repository

### `Repository`

Interface pour les opérations CRUD.

```go
type Repository interface {
    // Opérations de lecture
    Find(id interface{}) (interface{}, error)
    FindAll() ([]interface{}, error)
    FindBy(criteria map[string]interface{}) ([]interface{}, error)
    FindOneBy(criteria map[string]interface{}) (interface{}, error)
    
    // Opérations d'écriture
    Save(entity interface{}) error
    Update(entity interface{}) error
    Delete(entity interface{}) error
    
    // Utilitaires
    Count() (int64, error)
    Exists(id interface{}) (bool, error)
}
```

## Query Builder

### `QueryBuilder`

Interface pour construire des requêtes SQL.

```go
type QueryBuilder interface {
    // Sélection et table
    Select(fields ...string) QueryBuilder
    From(table string) QueryBuilder
    
    // Conditions WHERE
    Where(field, operator string, value interface{}) QueryBuilder
    WhereIn(field string, values []interface{}) QueryBuilder
    WhereNotIn(field string, values []interface{}) QueryBuilder
    WhereBetween(field string, min, max interface{}) QueryBuilder
    WhereNotBetween(field string, min, max interface{}) QueryBuilder
    WhereNull(field string) QueryBuilder
    WhereNotNull(field string) QueryBuilder
    WhereLike(field, pattern string) QueryBuilder
    WhereNotLike(field, pattern string) QueryBuilder
    WhereRegexp(field, pattern string) QueryBuilder
    WhereNotRegexp(field, pattern string) QueryBuilder
    
    // Jointures
    Join(table, condition string) QueryBuilder
    LeftJoin(table, condition string) QueryBuilder
    RightJoin(table, condition string) QueryBuilder
    InnerJoin(table, condition string) QueryBuilder
    
    // Tri et groupement
    OrderBy(field, direction string) QueryBuilder
    GroupBy(fields ...string) QueryBuilder
    Having(condition string, args ...interface{}) QueryBuilder
    
    // Pagination
    Limit(limit int) QueryBuilder
    Offset(offset int) QueryBuilder
    
    // Modificateurs
    Distinct() QueryBuilder
    ForUpdate() QueryBuilder
    ForShare() QueryBuilder
    
    // Exécution
    Find() ([]map[string]interface{}, error)
    FindOne() (map[string]interface{}, error)
    Count() (int64, error)
    Exists() (bool, error)
    
    // SQL brut
    Raw(sql string, args ...interface{}) QueryBuilder
    GetSQL() string
    GetArgs() []interface{}
}
```

## Dialectes

### `Dialect`

Interface pour les dialectes de base de données.

```go
type Dialect interface {
    // Connexion
    Connect(config ConnectionConfig) error
    Close() error
    Ping() error
    
    // Requêtes
    Exec(query string, args ...interface{}) (sql.Result, error)
    Query(query string, args ...interface{}) (*sql.Rows, error)
    QueryRow(query string, args ...interface{}) *sql.Row
    
    // Transactions
    Begin() (Transaction, error)
    BeginTx(ctx context.Context, opts *sql.TxOptions) (Transaction, error)
    
    // Schéma
    CreateTable(tableName string, columns []Column) error
    DropTable(tableName string) error
    TableExists(tableName string) (bool, error)
    
    // Utilitaires
    GetSQLType(goType reflect.Type) string
    GetPlaceholder(index int) string
}
```

## Métadonnées

### `ModelMetadata`

Structure des métadonnées d'un modèle.

```go
type ModelMetadata struct {
    Type          reflect.Type
    TableName     string
    Columns       []Column
    PrimaryKey    string
    AutoIncrement string
}
```

### `Column`

Structure d'une colonne.

```go
type Column struct {
    Name          string
    Type          string
    Length        int
    PrimaryKey    bool
    AutoIncrement bool
    Unique        bool
    Index         bool
    Nullable      bool
    Default       interface{}
    ForeignKey    *ForeignKey
}
```

### `ForeignKey`

Structure d'une clé étrangère.

```go
type ForeignKey struct {
    ReferencedTable  string
    ReferencedColumn string
    OnDelete         string
    OnUpdate         string
}
```

## Transactions

### `Transaction`

Interface pour les transactions.

```go
type Transaction interface {
    Commit() error
    Rollback() error
    Exec(query string, args ...interface{}) (sql.Result, error)
    Query(query string, args ...interface{}) (*sql.Rows, error)
    QueryRow(query string, args ...interface{}) *sql.Row
}
```

## Exemples d'Utilisation

### Configuration et Connexion

```go
cfg := builder.NewConfigBuilder().
    WithDialect(factory.MySQL).
    WithHost("localhost").
    WithDatabase("test").
    WithUsername("user").
    WithPassword("pass").
    Build()

orm := builder.NewSimpleORM().
    WithConfigBuilder(cfg).
    RegisterModel(&User{})

if err := orm.Connect(); err != nil {
    log.Fatal(err)
}
defer orm.Close()
```

### Opérations CRUD

```go
repo := orm.GetORM().Repository(&User{})

// Create
user := &User{Name: "Alice"}
err := repo.Save(user)

// Read
found, err := repo.Find(1)

// Update
user.Name = "Bob"
err = repo.Update(user)

// Delete
err = repo.Delete(user)
```

### Query Builder

```go
users, err := orm.Query(&User{}).
    Select("name", "email").
    Where("age", ">", 18).
    OrderBy("name", "ASC").
    Limit(10).
    Find()
```

### Transactions

```go
err := orm.GetORM().Transaction(func(tx ORM) error {
    repo := tx.Repository(&User{})
    user := &User{Name: "Alice"}
    if err := repo.Save(user); err != nil {
        return err // rollback
    }
    return nil // commit
})
``` 
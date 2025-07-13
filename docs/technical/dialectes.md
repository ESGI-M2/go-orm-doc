---
sidebar_position: 2
sidebar_label: Gestion des dialectes
---

# Gestion des dialectes

Cette page détaille l'implémentation des dialectes (MySQL, PostgreSQL, Mock).

## Fonctionnalités Go utilisées

### Packages standards
* `database/sql` : Interface de base avec les drivers de base de données
* `reflect` : Analyse des types Go pour le mapping SQL
* `strings` : Construction et manipulation des requêtes SQL
* `fmt` : Formatage des erreurs et des chaînes SQL
* `sync` : Protection des connexions partagées

### Concepts Go avancés
* **Interfaces** : `Dialect` définit le contrat pour tous les dialectes
* **Type assertion** : Conversion sûre des résultats SQL vers les types Go
* **Embedding** : Base commune via `BaseDialect` embarquée
* **Méthodes pointeur** : Gestion de l'état de la connexion
* **Closures** : Wrapping des transactions et des préparations

### Patterns Go idiomatiques
* **Driver pattern** : Implémentation du standard `database/sql/driver`
* **Error handling** : Wrapping des erreurs spécifiques aux bases
* **Connection pooling** : Utilisation idiomatique de `sql.DB`
* **Resource cleanup** : Fermeture systématique avec `defer`
* **Interface segregation** : Interfaces minimales par responsabilité

## Interface `Dialect`

```go
type Dialect interface {
    GetName() string
    Connect(cfg interfaces.ConnectionConfig) error
    Close() error
    Ping() error

    // Transactions
    Begin() (*sql.Tx, error)
    Commit() error
    Rollback() error

    // SQL helpers
    GetPlaceholder(pos int) string
    GetSQLType(goType reflect.Type) string

    // Exécution brute
    Exec(query string, args ...interface{}) (sql.Result, error)
    Query(query string, args ...interface{}) (*sql.Rows, error)
}
```

## MySQLDialect

* Utilise le driver `github.com/go-sql-driver/mysql`.
* Placeholders : `?`.
* Mapping types Go → MySQL (`INT`, `BIGINT`, `VARCHAR`, etc.).
* Gère `CREATE DATABASE IF NOT EXISTS` lors de l'auto-création.

## PostgreSQLDialect

* Driver `github.com/lib/pq`.
* Placeholders : `$1`, `$2`, …
* Support des types spécifiques (`TEXT`, `BYTEA`, `SERIAL`).
* Gestion du schéma avec `CREATE SCHEMA IF NOT EXISTS`.

## MockDialect

* Connexion simulée en mémoire.
* Toutes les méthodes retournent des valeurs factices.
* Utilisé dans les tests unitaires pour isoler la logique ORM.

## SQL Type mapping (extrait)

| Go | MySQL | PostgreSQL |
|----|-------|-----------|
| `int` | `INT` | `INTEGER` |
| `int64` | `BIGINT` | `BIGINT` |
| `string` | `VARCHAR(255)` | `VARCHAR` |
| `bool` | `TINYINT(1)` | `BOOLEAN` |
| `time.Time` | `DATETIME` | `TIMESTAMP` |

## Placeholders

| Dialect | Exemple |
|---------|---------|
| MySQL | `INSERT INTO users (name) VALUES (?)` |
| PostgreSQL | `INSERT INTO users (name) VALUES ($1)` |

## Sécurité & Préparation

Les placeholders empêchent l'injection SQL en séparant code et données. Chaque Dialect prépare les requêtes en utilisant `database/sql`.

## Extension : ajouter un nouveau dialecte

1. Implémentez l'interface `Dialect`.  
2. Ajoutez le mapping dans `factory.CreateDialect`.  
3. Fournissez les helpers types / placeholders.  
4. Ajoutez des tests unitaires.

---

> Les dialectes assurent la portabilité : changez simplement le `ConfigBuilder` pour cibler une autre base de données. 
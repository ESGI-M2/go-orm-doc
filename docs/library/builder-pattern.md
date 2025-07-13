---
sidebar_position: 5
---

# Pattern Builder (SimpleORM)

Interface fluide pour configuration et initialisation de l'ORM.

## Concepts Fondamentaux

### SimpleORM

Façade qui simplifie l'utilisation de GO ORM :

- **Interface fluide** : Méthodes chainables
- **Configuration simplifiée** : Raccourcis pour cas d'usage courants
- **Gestion automatique** : Création de base de données et migration
- **Validation intégrée** : Vérification des configurations

### Architecture

```go
type SimpleORM struct {
    orm         interfaces.ORM           // Instance ORM sous-jacente
    dialect     interfaces.Dialect      // Dialecte de base de données
    config      interfaces.ConnectionConfig // Configuration de connexion
    dialectType factory.DialectType     // Type de dialecte
    autoCreate  bool                    // Création automatique de BD
    models      []interface{}           // Modèles enregistrés
    connected   bool                    // État de connexion
}
```

## Méthodes de Configuration

### Création d'Instance

```go
// Nouvelle instance SimpleORM
orm := builder.NewSimpleORM()

// Instances pré-configurées
mysqlORM := builder.NewMySQL()
postgresORM := builder.NewPostgreSQL()

// Avec variables d'environnement
mysqlFromEnv := builder.NewMySQLFromEnv()
postgresFromEnv := builder.NewPostgreSQLFromEnv()
```

### Configuration du Dialecte

```go
// Par chaîne de caractères
orm := builder.NewSimpleORM().WithDialect("mysql")
orm := builder.NewSimpleORM().WithDialect("postgresql")

// Par constante
orm := builder.NewSimpleORM().WithDialect(factory.MySQL)
orm := builder.NewSimpleORM().WithDialect(factory.PostgreSQL)

// Méthodes de commodité
orm := builder.NewSimpleORM().WithMySQL()
orm := builder.NewSimpleORM().WithPostgreSQL()
```

### Configuration de Connexion

#### Configuration Rapide

```go
// Configuration basique
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password")

// Configuration avec port personnalisé (détecté automatiquement)
orm := builder.NewSimpleORM().
    WithPostgreSQL().
    WithQuickConfig("localhost", "myapp", "user", "password") // Port 5432 automatique
```

#### Configuration Avancée

```go
// Configuration détaillée
config := interfaces.ConnectionConfig{
    Host:            "localhost",
    Port:            3306,
    Database:        "myapp",
    Username:        "user",
    Password:        "password",
    MaxOpenConns:    25,
    MaxIdleConns:    5,
    ConnMaxLifetime: 300,
    Options: map[string]string{
        "charset": "utf8mb4",
        "parseTime": "True",
    },
}

orm := builder.NewSimpleORM().
    WithMySQL().
    WithConfig(config)
```

#### Configuration par Builder

```go
// Utilisation du ConfigBuilder
configBuilder := builder.MySQL().
    WithHost("localhost").
    WithDatabase("myapp").
    WithCredentials("user", "password").
    WithConnectionPool(25, 5).
    WithAutoCreateDatabase()

orm := builder.NewSimpleORM().
    WithConfigBuilder(configBuilder)
```

#### Configuration par Variables d'Environnement

```go
// Variables d'environnement pour MySQL
// MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD

orm := builder.NewSimpleORM().
    WithMySQL().
    WithEnvConfig()

// Variables d'environnement pour PostgreSQL
// POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD

orm := builder.NewSimpleORM().
    WithPostgreSQL().
    WithEnvConfig()
```

## Gestion des Modèles

### Enregistrement des Modèles

```go
// Enregistrer un modèle
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    RegisterModel(&User{})

// Enregistrer plusieurs modèles
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    RegisterModels(&User{}, &Post{}, &Comment{})

// Enregistrement chaîné
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    RegisterModel(&User{}).
    RegisterModel(&Post{}).
    RegisterModel(&Comment{})
```

### Gestion Automatique

```go
// Création automatique de base de données
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithAutoCreateDatabase(). // Créer la BD si elle n'existe pas
    RegisterModels(&User{}, &Post{})

// Migration automatique des tables
// Les tables sont créées/mises à jour automatiquement lors de Connect()
```

## Méthodes de Connexion

### Connexion Standard

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    RegisterModels(&User{}, &Post{})

// Établir la connexion
if err := orm.Connect(); err != nil {
    log.Fatal("Erreur de connexion:", err)
}
defer orm.Close()
```

### Méthodes Rapides

```go
// Configuration complète en une ligne
orm, err := builder.QuickSetup(
    "mysql",                    // Dialecte
    "localhost",                // Hôte
    "myapp",                    // Base de données
    "user",                     // Utilisateur
    "password",                 // Mot de passe
    &User{}, &Post{},          // Modèles
)

if err != nil {
    log.Fatal("Erreur de configuration:", err)
}
defer orm.Close()
```

### Setup depuis Variables d'Environnement

```go
// Configuration automatique depuis variables d'environnement
orm, err := builder.QuickSetupFromEnv("mysql", &User{}, &Post{})
if err != nil {
    log.Fatal("Erreur de configuration:", err)
}
defer orm.Close()
```

## Pool de Connexions

### Configuration du Pool

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithConnectionPool(25, 5, 300) // maxOpen, maxIdle, maxLifetime (secondes)
```

### Configuration Avancée

```go
config := interfaces.ConnectionConfig{
    Host:            "localhost",
    Port:            3306,
    Database:        "myapp",
    Username:        "user",
    Password:        "password",
    MaxOpenConns:    25,    // Connexions ouvertes maximum
    MaxIdleConns:    5,     // Connexions inactives maximum
    ConnMaxLifetime: 300,   // Durée de vie max (secondes)
}

orm := builder.NewSimpleORM().
    WithMySQL().
    WithConfig(config)
```

## Cache et Performance

### Configuration du Cache

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithCache(300) // Cache TTL en secondes
```

### Logs SQL

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    EnableQueryLog() // Activer les logs SQL
```

## Exemples d'Usage

### Configuration Minimale

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM().
        WithMySQL().
        WithQuickConfig("localhost", "myapp", "user", "password").
        RegisterModels(&User{})

    if err := orm.Connect(); err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Utilisation normale
    repo := orm.Repository(&User{})
    // ...
}
```

### Configuration Complète

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM().
        WithMySQL().
        WithQuickConfig("localhost", "myapp", "user", "password").
        WithConnectionPool(25, 5, 300).
        WithCache(300).
        WithAutoCreateDatabase().
        EnableQueryLog().
        RegisterModels(&User{}, &Post{}, &Comment{})

    if err := orm.Connect(); err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Migration automatique
    if err := orm.Migrate(); err != nil {
        log.Fatal(err)
    }

    // Utilisation normale
    repo := orm.Repository(&User{})
    // ...
}
```

### Configuration avec Variables d'Environnement

```go
package main

import (
    "log"
    "os"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    // Configuration des variables d'environnement
    os.Setenv("MYSQL_HOST", "localhost")
    os.Setenv("MYSQL_DATABASE", "myapp")
    os.Setenv("MYSQL_USER", "user")
    os.Setenv("MYSQL_PASSWORD", "password")

    orm, err := builder.QuickSetupFromEnv("mysql", &User{}, &Post{})
    if err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Utilisation normale
    repo := orm.Repository(&User{})
    // ...
}
```

### Configuration Multi-Environnement

```go
package main

import (
    "log"
    "os"
    "github.com/ESGI-M2/GO/orm/builder"
)

func getORM() *builder.SimpleORM {
    env := os.Getenv("GO_ENV")
    
    switch env {
    case "production":
        return builder.NewSimpleORM().
            WithPostgreSQL().
            WithEnvConfig().
            WithConnectionPool(50, 10, 600).
            WithCache(600).
            RegisterModels(&User{}, &Post{})
    case "test":
        return builder.NewSimpleORM().
            WithDialect("mock").
            RegisterModels(&User{}, &Post{})
    default: // development
        return builder.NewSimpleORM().
            WithMySQL().
            WithQuickConfig("localhost", "dev_db", "root", "password").
            EnableQueryLog().
            RegisterModels(&User{}, &Post{})
    }
}

func main() {
    orm := getORM()
    
    if err := orm.Connect(); err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Utilisation normale
    repo := orm.Repository(&User{})
    // ...
}
```

## Interfaces et Méthodes

### Interface SimpleORM

```go
type SimpleORM interface {
    // Configuration
    WithDialect(dialectType interface{}) *SimpleORM
    WithMySQL() *SimpleORM
    WithPostgreSQL() *SimpleORM
    WithQuickConfig(host, database, username, password string) *SimpleORM
    WithConfig(config interfaces.ConnectionConfig) *SimpleORM
    WithEnvConfig() *SimpleORM
    WithAutoCreateDatabase() *SimpleORM
    
    // Pool de connexions
    WithConnectionPool(maxOpen, maxIdle, maxLifetime int) *SimpleORM
    
    // Cache et logs
    WithCache(ttl int) *SimpleORM
    EnableQueryLog() *SimpleORM
    DisableQueryLog() *SimpleORM
    
    // Modèles
    RegisterModel(model interface{}) *SimpleORM
    RegisterModels(models ...interface{}) *SimpleORM
    
    // Connexion
    Connect() error
    Close() error
    
    // Accès ORM
    GetORM() interfaces.ORM
    Repository(model interface{}) interfaces.Repository
    Query(model interface{}) interfaces.QueryBuilder
    Transaction(fn func(interfaces.ORM) error) error
    TransactionWithContext(ctx context.Context, fn func(interfaces.ORM) error) error
    
    // Migrations
    Migrate() error
    CreateTable(model interface{}) error
    DropTable(model interface{}) error
}
```

### Méthodes Utilitaires

```go
// Fonctions globales
func QuickSetup(dialect, host, database, username, password string, models ...interface{}) (*SimpleORM, error)
func QuickSetupFromEnv(dialect string, models ...interface{}) (*SimpleORM, error)
func NewMySQL() *SimpleORM
func NewPostgreSQL() *SimpleORM
func NewMySQLFromEnv() *SimpleORM
func NewPostgreSQLFromEnv() *SimpleORM
```

## Gestion des Erreurs

### Validation de Configuration

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password")

// Validation automatique à la connexion
if err := orm.Connect(); err != nil {
    switch err {
    case builder.ErrInvalidDialect:
        log.Fatal("Dialecte invalide")
    case builder.ErrMissingConfig:
        log.Fatal("Configuration manquante")
    case builder.ErrConnectionFailed:
        log.Fatal("Connexion échouée")
    default:
        log.Fatal("Erreur:", err)
    }
}
```

### Récupération d'Erreurs

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "wrong_password")

if err := orm.Connect(); err != nil {
    log.Printf("Erreur de connexion: %v", err)
    
    // Reconfiguration
    orm.WithQuickConfig("localhost", "myapp", "user", "correct_password")
    
    if err := orm.Connect(); err != nil {
        log.Fatal("Impossible de se connecter:", err)
    }
}
```

## Optimisation et Performance

### Pool de Connexions Optimal

```go
// Configuration pour environnement de production
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithConnectionPool(
        100,  // MaxOpenConns - connexions simultanées maximum
        10,   // MaxIdleConns - connexions inactives en pool
        3600, // ConnMaxLifetime - durée de vie max (1 heure)
    )
```

### Configuration Cache

```go
// Cache avec TTL adapté
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithCache(300) // 5 minutes de cache
```

### Logs et Monitoring

```go
// Logs activés en développement seulement
if os.Getenv("GO_ENV") == "development" {
    orm = orm.EnableQueryLog()
}
``` 
Le pattern Builder rend GO ORM accessible et puissant ! 🏗️ 
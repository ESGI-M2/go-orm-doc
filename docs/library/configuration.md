---
sidebar_position: 3
---

# Configuration & Connexion

Cette page explique comment configurer et établir une connexion avec GO ORM, en suivant plusieurs niveaux de complexité.

## 1. Installation du package

```bash
go get github.com/ESGI-M2/GO@v1.2.3
```

> Utilisez toujours la dernière version taguée pour profiter des correctifs.

## 2. Utilisation du **ConfigBuilder**

Le `ConfigBuilder` est une API fluide permettant de créer une configuration complète :

```go
cfg := builder.NewConfigBuilder().
    WithDialect(factory.MySQL).        // Sélection du dialecte
    WithHost("localhost").
    WithPort(3306).
    WithDatabase("myapp").
    WithCredentials("user", "password").
    WithCharset("utf8mb4").
    WithAutoCreateDatabase().          // Crée la BDD si absente
    Build()
```

## 3. Connexion via **SimpleORM**

```go
orm := builder.NewSimpleORM().
    WithConfig(cfg).
    RegisterModels(&User{})

if err := orm.Connect(); err != nil {
    log.Fatalf("connexion : %v", err)
}

defer orm.Close()
```

## 4. Connexion rapide (Quick Setup)

Pour des tests rapides :

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    RegisterModels(&User{})
```

## 5. Chargement des variables d’environnement

```go
cfg := builder.NewConfigBuilder().
    WithDialect(factory.PostgreSQL).
    WithEnvFile(".env").
    FromEnv()
```

Fichier `.env` :

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=myapp
POSTGRES_USER=user
POSTGRES_PASSWORD=secret
```

## 6. Activation du **pool de connexions**

```go
cfg := builder.NewConfigBuilder().
    WithDialect(factory.MySQL).
    WithMaxOpenConns(20).
    WithMaxIdleConns(10).
    Build()
```

## 7. Journalisation et Cache global

```go
orm := builder.NewAdvancedORM().
    WithConfig(cfg).
    EnableQueryLog().
    WithCache()            // cache mémoire simple
```

## 8. Sélection dynamique du dialecte

```go
var dialectType factory.DialectType
// … récupéré depuis un paramètre CLI

orm := builder.NewSimpleORM().WithDialect(dialectType)
```

## 9. Gestion des erreurs de connexion

```go
if err := orm.Connect(); err != nil {
    if errors.Is(err, connection.ErrInvalidCredentials) {
        // …
    }
}
```

---

> La configuration étant prête, vous pouvez passer à la définition des **Modèles**. 
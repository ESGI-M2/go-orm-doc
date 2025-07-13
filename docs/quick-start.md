# Démarrage Rapide

Ce guide vous permet de démarrer rapidement avec GO ORM en présentant les fonctionnalités de base.

## Installation

```bash
go get github.com/ESGI-M2/GO
```

## Configuration

```go
package main

import (
    "fmt"
    "log"
    "time"
    
    "github.com/ESGI-M2/GO/orm/builder"
    "github.com/ESGI-M2/GO/orm/factory"
)

// Définition du modèle
type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"column:name"`
    Email     string    `orm:"column:email,unique"`
    CreatedAt time.Time `orm:"column:created_at"`
}

func main() {
    // Configuration via builder
    cfg := builder.NewConfigBuilder().
        WithDialect(factory.MySQL).
        WithHost("localhost").
        WithDatabase("testdb").
        WithUsername("user").
        WithPassword("pass").
        Build()

    // Création de l'ORM
    orm := builder.NewSimpleORM().
        WithConfigBuilder(cfg).
        RegisterModel(&User{})

    // Connexion
    if err := orm.Connect(); err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Migration automatique
    if err := orm.GetORM().Migrate(); err != nil {
        log.Fatal(err)
    }
}
```

## Opérations CRUD

### Create

```go
repo := orm.GetORM().Repository(&User{})

user := &User{
    Name:      "Alice",
    Email:     "alice@example.com",
    CreatedAt: time.Now(),
}

if err := repo.Save(user); err != nil {
    log.Fatal(err)
}
fmt.Printf("User created with ID: %d\n", user.ID)
```

### Read

```go
// Par ID
user, err := repo.Find(1)
if err != nil {
    log.Fatal(err)
}

// Tous les utilisateurs
users, err := repo.FindAll()
if err != nil {
    log.Fatal(err)
}

// Avec critères
criteria := map[string]interface{}{
    "name": "Alice",
}
users, err := repo.FindBy(criteria)
if err != nil {
    log.Fatal(err)
}
```

### Update

```go
user.Name = "Alice Smith"
if err := repo.Update(user); err != nil {
    log.Fatal(err)
}
```

### Delete

```go
if err := repo.Delete(user); err != nil {
    log.Fatal(err)
}
```

## Query Builder

### Requêtes Simples

```go
// Sélection avec conditions
users, err := orm.Query(&User{}).
    Select("name", "email").
    Where("name", "LIKE", "%Alice%").
    OrderBy("created_at", "DESC").
    Limit(10).
    Find()

// Compter
count, err := orm.Query(&User{}).
    Where("name", "!=", "").
    Count()

// Vérifier l'existence
exists, err := orm.Query(&User{}).
    Where("email", "=", "alice@example.com").
    Exists()
```

### Jointures

```go
type Post struct {
    ID     int    `orm:"pk,auto"`
    Title  string `orm:"column:title"`
    UserID int    `orm:"column:user_id"`
}

results, err := orm.Query(&User{}).
    Select("users.*, posts.title").
    Join("posts", "users.id = posts.user_id").
    Where("posts.title", "LIKE", "%Go%").
    Find()
```

## Transactions

```go
err := orm.GetORM().Transaction(func(tx interfaces.ORM) error {
    repo := tx.Repository(&User{})
    
    // Créer un utilisateur
    user := &User{Name: "Bob", Email: "bob@example.com"}
    if err := repo.Save(user); err != nil {
        return err // rollback
    }
    
    // Créer un post
    postRepo := tx.Repository(&Post{})
    post := &Post{Title: "Hello", UserID: user.ID}
    if err := postRepo.Save(post); err != nil {
        return err // rollback
    }
    
    return nil // commit
})

if err != nil {
    log.Fatal(err)
}
```

## Migrations

```go
// Créer une table
if err := orm.GetORM().CreateTable(&User{}); err != nil {
    log.Fatal(err)
}

// Supprimer une table
if err := orm.GetORM().DropTable(&User{}); err != nil {
    log.Fatal(err)
}

// Migration automatique de tous les modèles
if err := orm.GetORM().Migrate(); err != nil {
    log.Fatal(err)
}
```

## Prochaines Étapes

- Consultez la [Référence API](./api-reference.md) pour une documentation complète
- Explorez les [Exemples](./library/examples.md) pour des cas d'utilisation plus avancés 
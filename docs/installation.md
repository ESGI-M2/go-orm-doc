# Installation et Configuration

## Installation

### Prérequis

- Go 1.16 ou supérieur
- Base de données MySQL ou PostgreSQL

### Installation

```bash
go get github.com/ESGI-M2/GO
```

### Vérification

```go
package main

import (
    "fmt"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM()
    if orm != nil {
        fmt.Println("ORM GO installé avec succès !")
    }
}
```

```bash
go run test.go
```

## Configuration

### Configuration Simple

#### MySQL

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM().
        WithMySQL().
        WithQuickConfig("localhost", "myapp", "myapp_user", "password").
        RegisterModels(&User{})

    if err := orm.Connect(); err != nil {
        log.Fatal("Erreur de connexion:", err)
    }
    defer orm.Close()
}
```

#### PostgreSQL

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM().
        WithPostgreSQL().
        WithQuickConfig("localhost", "myapp", "myapp_user", "password").
        RegisterModels(&User{})

    if err := orm.Connect(); err != nil {
        log.Fatal("Erreur de connexion:", err)
    }
    defer orm.Close()
}
```

### Configuration avec Variables d'Environnement

#### Variables

**MySQL :**
```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=myapp
export MYSQL_USER=myapp_user
export MYSQL_PASSWORD=password
```

**PostgreSQL :**
```bash
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=myapp
export POSTGRES_USER=myapp_user
export POSTGRES_PASSWORD=password
```

#### Code

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm, err := builder.QuickSetupFromEnv("mysql", &User{})
    if err != nil {
        log.Fatal("Erreur de configuration:", err)
    }
    defer orm.Close()
}
```

### Configuration Avancée avec Factory

```go
package main

import (
    "log"
    "github.com/ESGI-M2/GO/orm/factory"
    "github.com/ESGI-M2/GO/orm/core"
)

func main() {
    dialect, err := factory.CreateDialect(factory.MySQL)
    if err != nil {
        log.Fatal("Erreur de création du dialecte:", err)
    }

    orm := core.NewORM(dialect)
    
    config := interfaces.ConnectionConfig{
        Host:     "localhost",
        Port:     3306,
        Database: "myapp",
        Username: "myapp_user",
        Password: "password",
    }

    if err := orm.Connect(config); err != nil {
        log.Fatal("Erreur de connexion:", err)
    }
    defer orm.Close()

    orm.RegisterModel(&User{})
}
```

## Modèle de base

```go
package main

import (
    "time"
)

type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"index"`
    Email     string    `orm:"unique"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}
```

## Utilisation de base

```go
package main

import (
    "fmt"
    "log"
    "time"
    
    "github.com/ESGI-M2/GO/orm/builder"
)

func main() {
    orm := builder.NewSimpleORM().
        WithMySQL().
        WithQuickConfig("localhost", "testdb", "user", "password").
        RegisterModels(&User{})

    if err := orm.Connect(); err != nil {
        log.Fatal("Erreur de connexion:", err)
    }
    defer orm.Close()

    repo := orm.Repository(&User{})
    
    user := &User{
        Name:      "John Doe",
        Email:     "john@example.com",
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
    
    if err := repo.Save(user); err != nil {
        log.Fatal("Erreur lors de la sauvegarde:", err)
    }
    
    fmt.Printf("Utilisateur créé avec l'ID: %d\n", user.ID)
}
```

## Configuration Database

### MySQL

```sql
CREATE DATABASE myapp;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;
```

### PostgreSQL

```sql
CREATE DATABASE myapp;
CREATE USER myapp_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;
```

## Options de Configuration

### Paramètres de Connexion

```go
type ConnectionConfig struct {
    Host     string
    Port     int
    Database string
    Username string
    Password string
    SSLMode  string  // PostgreSQL uniquement
    Charset  string  // MySQL uniquement
}
```

### Configuration SSL PostgreSQL

```go
config := interfaces.ConnectionConfig{
    Host:     "localhost",
    Port:     5432,
    Database: "myapp",
    Username: "myapp_user",
    Password: "password",
    SSLMode:  "require", // disable, require, verify-ca, verify-full
}
```

### Configuration Charset MySQL

```go
config := interfaces.ConnectionConfig{
    Host:     "localhost",
    Port:     3306,
    Database: "myapp",
    Username: "myapp_user",
    Password: "password",
    Charset:  "utf8mb4",
}
```

## Pool de Connexions

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithConnectionPool(10, 5, time.Hour). // max, idle, lifetime
    RegisterModels(&User{})
```

## Cache

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    WithCache(time.Minute * 5). // TTL
    RegisterModels(&User{})
```

## Logs

```go
orm := builder.NewSimpleORM().
    WithMySQL().
    WithQuickConfig("localhost", "myapp", "user", "password").
    EnableQueryLog(). // Active les logs SQL
    RegisterModels(&User{})
```

## Migrations

```go
// Création automatique des tables
if err := orm.Migrate(); err != nil {
    log.Fatal("Erreur de migration:", err)
}

// Suppression des tables
if err := orm.DropTable(&User{}); err != nil {
    log.Fatal("Erreur de suppression:", err)
}

// Création d'une table spécifique
if err := orm.CreateTable(&User{}); err != nil {
    log.Fatal("Erreur de création:", err)
}
``` 
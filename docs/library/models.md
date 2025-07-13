---
sidebar_position: 4
---

# Modèles

Structures Go représentant des tables de base de données avec tags de métadonnées.

## Structure de Base

### Modèle Simple

```go
type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"index"`
    Email     string    `orm:"unique"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}
```

### Modèle avec Relations

```go
type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"index"`
    Email     string    `orm:"unique"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}

type Post struct {
    ID        int       `orm:"pk,auto"`
    Title     string    `orm:"index"`
    Content   string    
    UserID    int       `orm:"fk:users.id"`
    Published bool      `orm:"default:false"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}
```

## Système de Tags

Support de deux systèmes de tags :

### Nouveau Système

Tag `orm` avec syntaxe concise :

```go
type User struct {
    ID       int    `orm:"pk,auto"`           // Clé primaire + auto-incrément
    Name     string `orm:"index"`              // Champ indexé
    Email    string `orm:"unique"`             // Contrainte unique
    Age      int    `orm:"default:18"`         // Valeur par défaut
    IsActive bool   `orm:"default:true"`       // Booléen avec défaut
    Created  string `orm:"column:created_at"`  // Nom de colonne personnalisé
}
```

### Ancien Système

Tags séparés pour chaque propriété :

```go
type User struct {
    ID       int    `db:"id" primary:"true" autoincrement:"true"`
    Name     string `db:"name" index:"true"`
    Email    string `db:"email" unique:"true"`
    Age      int    `db:"age" default:"18"`
    IsActive bool   `db:"is_active" default:"true"`
    Created  string `db:"created_at"`
}
```

## Référence des Tags

### Tags Nouveau Système (`orm`)

| Tag | Description | Exemple |
|-----|-------------|---------|
| `pk` | Clé primaire | `orm:"pk"` |
| `auto` | Auto-incrément | `orm:"auto"` |
| `unique` | Contrainte unique | `orm:"unique"` |
| `index` | Créer un index | `orm:"index"` |
| `nullable` | Autoriser les valeurs NULL | `orm:"nullable"` |
| `column:name` | Nom de colonne personnalisé | `orm:"column:user_name"` |
| `length:n` | Longueur du champ | `orm:"length:255"` |
| `default:value` | Valeur par défaut | `orm:"default:true"` |
| `fk:table.column` | Clé étrangère | `orm:"fk:users.id"` |

### Tags Ancien Système

| Tag | Description | Exemple |
|-----|-------------|---------|
| `db` | Nom de la colonne | `db:"user_name"` |
| `primary` | Clé primaire | `primary:"true"` |
| `autoincrement` | Auto-incrément | `autoincrement:"true"` |
| `unique` | Contrainte unique | `unique:"true"` |
| `index` | Créer un index | `index:"true"` |
| `foreign` | Clé étrangère | `foreign:"users.id"` |
| `length` | Longueur du champ | `length:"255"` |
| `default` | Valeur par défaut | `default:"18"` |

## Exemples Pratiques

### Modèle Utilisateur Complet

```go
package main

import (
    "time"
)

type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"index,length:100"`
    Email     string    `orm:"unique,length:255"`
    Age       int       `orm:"default:18"`
    IsActive  bool      `orm:"default:true"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}

// Avec l'ancien système
type UserLegacy struct {
    ID        int       `db:"id" primary:"true" autoincrement:"true"`
    Name      string    `db:"name" index:"true" length:"100"`
    Email     string    `db:"email" unique:"true" length:"255"`
    Age       int       `db:"age" default:"18"`
    IsActive  bool      `db:"is_active" default:"true"`
    CreatedAt time.Time `db:"created_at"`
    UpdatedAt time.Time `db:"updated_at"`
}
```

### Modèle avec Relations

```go
type Category struct {
    ID   int    `orm:"pk,auto"`
    Name string `orm:"unique,length:100"`
}

type Product struct {
    ID          int     `orm:"pk,auto"`
    Name        string  `orm:"index,length:255"`
    Description string  `orm:"nullable"`
    Price       float64 `orm:"default:0.00"`
    CategoryID  int     `orm:"fk:categories.id"`
    IsActive    bool    `orm:"default:true"`
    CreatedAt   time.Time `orm:"column:created_at"`
}

// Avec l'ancien système
type ProductLegacy struct {
    ID          int     `db:"id" primary:"true" autoincrement:"true"`
    Name        string  `db:"name" index:"true" length:"255"`
    Description string  `db:"description"`
    Price       float64 `db:"price" default:"0.00"`
    CategoryID  int     `db:"category_id" foreign:"categories.id"`
    IsActive    bool    `db:"is_active" default:"true"`
    CreatedAt   time.Time `db:"created_at"`
}
```

## Types de Données Supportés

### Types Go vers SQL

| Type Go | MySQL | PostgreSQL |
|---------|-------|------------|
| `int`, `int32` | `INT` | `INTEGER` |
| `int64` | `BIGINT` | `BIGINT` |
| `string` | `VARCHAR` | `VARCHAR` |
| `bool` | `BOOLEAN` | `BOOLEAN` |
| `float32` | `FLOAT` | `REAL` |
| `float64` | `DOUBLE` | `DOUBLE PRECISION` |
| `time.Time` | `DATETIME` | `TIMESTAMP` |
| `[]byte` | `BLOB` | `BYTEA` |

### Exemples par Type

```go
type ExampleModel struct {
    ID          int       `orm:"pk,auto"`
    Name        string    `orm:"length:255"`
    Age         int       `orm:"default:0"`
    Height      float64   `orm:"default:0.0"`
    IsActive    bool      `orm:"default:true"`
    CreatedAt   time.Time `orm:"column:created_at"`
    Data        []byte    `orm:"nullable"`
}
```

## Gestion des Relations

### Clés Étrangères

```go
// Utilisateur avec profil
type User struct {
    ID   int    `orm:"pk,auto"`
    Name string `orm:"index"`
}

type Profile struct {
    ID     int    `orm:"pk,auto"`
    UserID int    `orm:"fk:users.id"`
    Bio    string `orm:"nullable"`
}

// Avec l'ancien système
type ProfileLegacy struct {
    ID     int    `db:"id" primary:"true" autoincrement:"true"`
    UserID int    `db:"user_id" foreign:"users.id"`
    Bio    string `db:"bio"`
}
```

### Relations One-to-Many

```go
type Category struct {
    ID   int    `orm:"pk,auto"`
    Name string `orm:"unique"`
}

type Product struct {
    ID         int    `orm:"pk,auto"`
    Name       string `orm:"index"`
    CategoryID int    `orm:"fk:categories.id"`
}
```

### Relations Many-to-Many

```go
type User struct {
    ID   int    `orm:"pk,auto"`
    Name string `orm:"index"`
}

type Role struct {
    ID   int    `orm:"pk,auto"`
    Name string `orm:"unique"`
}

// Table de liaison
type UserRole struct {
    UserID int `orm:"fk:users.id"`
    RoleID int `orm:"fk:roles.id"`
}
```

## Validation et Contraintes

### Contraintes de Longueur

```go
type User struct {
    Name     string `orm:"length:100"`        // VARCHAR(100)
    Email    string `orm:"unique,length:255"` // VARCHAR(255) UNIQUE
    Password string `orm:"length:60"`         // Bcrypt hash
}
```

### Contraintes de Valeur

```go
type Product struct {
    Price    float64 `orm:"default:0.00"`
    IsActive bool    `orm:"default:true"`
    Stock    int     `orm:"default:0"`
}
```

### Contraintes NULL

```go
type User struct {
    Name        string  `orm:"index"`          // NOT NULL
    Description *string `orm:"nullable"`       // NULL autorisé
    Age         int     `orm:"default:0"`      // NOT NULL avec défaut
}
```

## Migrations et Création de Tables

### Création Automatique

```go
func main() {
    orm := builder.NewSimpleORM().
        WithMySQL().
        WithQuickConfig("localhost", "db", "user", "pass").
        RegisterModels(&User{}, &Product{}, &Category{})

    if err := orm.Connect(); err != nil {
        log.Fatal(err)
    }
    defer orm.Close()

    // Création automatique des tables
    if err := orm.Migrate(); err != nil {
        log.Fatal(err)
    }
}
```

### Création Manuelle

```go
// Créer une table spécifique
if err := orm.CreateTable(&User{}); err != nil {
    log.Fatal(err)
}

// Supprimer une table
if err := orm.DropTable(&User{}); err != nil {
    log.Fatal(err)
}
```

## Nommage des Tables

### Convention par Défaut

```go
type User struct {       // Table: users
    ID int `orm:"pk,auto"`
}

type UserProfile struct { // Table: user_profiles
    ID int `orm:"pk,auto"`
}
```

### Nommage Personnalisé

```go
type User struct {
    ID int `orm:"pk,auto"`
}

// Implémentation de l'interface TableName
func (User) TableName() string {
    return "custom_users"
}
```

## Hooks et Méthodes

### Hooks de Cycle de Vie

```go
type User struct {
    ID        int       `orm:"pk,auto"`
    Name      string    `orm:"index"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}

// Hook avant création
func (u *User) BeforeCreate() error {
    u.CreatedAt = time.Now()
    u.UpdatedAt = time.Now()
    return nil
}

// Hook avant mise à jour
func (u *User) BeforeUpdate() error {
    u.UpdatedAt = time.Now()
    return nil
}
```

### Validation Personnalisée

```go
type User struct {
    ID    int    `orm:"pk,auto"`
    Name  string `orm:"index"`
    Email string `orm:"unique"`
}

func (u *User) Validate() error {
    if len(u.Name) < 2 {
        return errors.New("nom trop court")
    }
    if !strings.Contains(u.Email, "@") {
        return errors.New("email invalide")
    }
    return nil
}
```

## Exemples Avancés

### Modèle avec Soft Delete

```go
type User struct {
    ID        int        `orm:"pk,auto"`
    Name      string     `orm:"index"`
    Email     string     `orm:"unique"`
    DeletedAt *time.Time `orm:"column:deleted_at,nullable"`
}
```

### Modèle avec Timestamps

```go
type BaseModel struct {
    ID        int       `orm:"pk,auto"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
}

type User struct {
    BaseModel
    Name  string `orm:"index"`
    Email string `orm:"unique"`
}
```

### Modèle avec JSON

```go
type User struct {
    ID       int    `orm:"pk,auto"`
    Name     string `orm:"index"`
    Metadata string `orm:"column:metadata"` // JSON en string
}

// Utilisation
user := &User{
    Name:     "John",
    Metadata: `{"preferences": {"theme": "dark"}}`,
}
``` 
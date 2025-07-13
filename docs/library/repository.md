---
sidebar_position: 6
---

# Repository

Le Repository encapsule toutes les opérations de persistance pour un modèle donné.

## Opérations de base

### Création d'un repository

```go
repo := orm.Repository(&User{})
```

### Lecture

```go
// Trouver par ID
user, err := repo.Find(1)

// Trouver tous les enregistrements
users, err := repo.FindAll()

// Trouver avec critères
criteria := map[string]interface{}{
    "age": 18,
    "active": true,
}
users, err := repo.FindBy(criteria)

// Trouver un seul avec critères
user, err := repo.FindOneBy(criteria)

// Avec relations
user, err := repo.FindWithRelations(1, "posts", "profile")
users, err := repo.FindAllWithRelations("posts", "profile")
```

### Création

```go
user := &User{Name: "Alice", Email: "alice@example.com"}

// Création simple
if err := repo.Create(user); err != nil {
    log.Fatal(err)
}

// Création en lot
users := []*User{
    {Name: "Alice"},
    {Name: "Bob"},
}
if err := repo.BatchCreate(users); err != nil {
    log.Fatal(err)
}
```

### Mise à jour

```go
// Mise à jour en lot
users[0].Name = "Alice Updated"
users[1].Name = "Bob Updated"
if err := repo.BatchUpdate(users); err != nil {
    log.Fatal(err)
}
```

### Suppression

```go
// Soft delete
if err := repo.SoftDelete(user); err != nil {
    log.Fatal(err)
}

// Soft delete avec critères
criteria := map[string]interface{}{"inactive": true}
if err := repo.SoftDeleteBy(criteria); err != nil {
    log.Fatal(err)
}

// Restauration
if err := repo.Restore(user); err != nil {
    log.Fatal(err)
}

// Restauration avec critères
if err := repo.RestoreBy(criteria); err != nil {
    log.Fatal(err)
}

// Trouver les éléments supprimés
trashed, err := repo.FindTrashed()

// Suppression définitive
if err := repo.ForceDelete(user); err != nil {
    log.Fatal(err)
}
```

## Fonctionnalités avancées

### Hooks

Les hooks sont automatiquement détectés et exécutés :

```go
type User struct {
    ID   int
    Name string
}

func (u *User) BeforeCreate() error {
    // Validation avant création
    if u.Name == "" {
        return errors.New("name is required")
    }
    return nil
}

func (u *User) AfterCreate() error {
    // Actions post-création
    return nil
}
```

Hooks disponibles :
- BeforeCreate/AfterCreate
- BeforeSave/AfterSave
- BeforeUpdate/AfterUpdate
- BeforeDelete/AfterDelete

### Traitement par lots

```go
// Traiter les enregistrements par lots
err := repo.Chunk(100, func(users []interface{}) error {
    for _, user := range users {
        // Traitement
    }
    return nil
})

// Traiter chaque enregistrement
err := repo.Each(func(user interface{}) error {
    // Traitement
    return nil
})
```

### Utilitaires

```go
// Compter les enregistrements
count, err := repo.Count()

// Vérifier l'existence
exists, err := repo.Exists(1)

// Récupérer une colonne
emails, err := repo.Pluck("email")

// Récupérer une seule valeur
email, err := repo.Value("email")

// Incrémenter/Décrémenter
err := repo.Increment("points", 5)
err := repo.Decrement("points", 3)
```

---

> Pour des requêtes plus complexes, utilisez le [Query Builder](query-builder.md). 
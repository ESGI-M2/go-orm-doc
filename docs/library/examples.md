# Exemples d'Utilisation Avancée

Ce guide présente des exemples avancés d'utilisation de GO ORM pour des cas concrets.

## Relations

### One-to-Many

```go
type User struct {
    ID    uint   `orm:"primary_key;auto_increment"`
    Name  string `orm:"size:255;not_null"`
    Posts []Post `orm:"has_many"`
}

type Post struct {
    ID     uint   `orm:"primary_key;auto_increment"`
    Title  string `orm:"size:255;not_null"`
    UserID uint   `orm:"not_null"`
    User   *User  `orm:"belongs_to"`
}

// Créer un utilisateur avec des posts
user := &User{
    Name: "Alice",
    Posts: []Post{
        {Title: "Premier post"},
        {Title: "Second post"},
    },
}

repo := orm.Repository(&User{})
err := repo.Save(user) // Sauvegarde en cascade

// Charger les posts d'un utilisateur
user, err := repo.Find(1)
posts := user.Posts // Chargement automatique
```

### Many-to-Many

```go
type Tag struct {
    ID    uint    `orm:"primary_key;auto_increment"`
    Name  string  `orm:"size:255;not_null;unique"`
    Posts []Post  `orm:"many_to_many"`
}

type Post struct {
    ID   uint   `orm:"primary_key;auto_increment"`
    Tags []Tag  `orm:"many_to_many"`
}

// Ajouter des tags à un post
post := &Post{}
repo := orm.Repository(&Post{})
repo.Find(1)

tagRepo := orm.Repository(&Tag{})
tag1, _ := tagRepo.FindOneBy(map[string]interface{}{"name": "golang"})
tag2, _ := tagRepo.FindOneBy(map[string]interface{}{"name": "orm"})

post.Tags = append(post.Tags, *tag1, *tag2)
repo.Update(post)
```

## Soft Delete

```go
type Document struct {
    ID        uint       `orm:"primary_key;auto_increment"`
    Title     string     `orm:"size:255;not_null"`
    DeletedAt *time.Time `orm:"soft_delete"`
}

repo := orm.Repository(&Document{})

// Suppression douce
doc := &Document{Title: "Test"}
repo.Save(doc)
repo.Delete(doc) // Marque comme supprimé

// Requêtes excluent automatiquement les documents supprimés
docs, _ := repo.FindAll()

// Inclure les documents supprimés
docs, _ := orm.Query(&Document{}).
    WithTrashed().
    Find()

// Restaurer un document
doc.DeletedAt = nil
repo.Update(doc)
```

## Hooks

```go
type Order struct {
    ID     uint    `orm:"primary_key;auto_increment"`
    Total  float64 `orm:"not_null"`
    Status string  `orm:"size:50;not_null"`
}

func (o *Order) BeforeSave() error {
    if o.Total < 0 {
        return errors.New("le total ne peut pas être négatif")
    }
    return nil
}

func (o *Order) AfterSave() error {
    // Envoyer une notification
    return notifyCustomer(o)
}

func (o *Order) BeforeDelete() error {
    if o.Status == "completed" {
        return errors.New("impossible de supprimer une commande complétée")
    }
    return nil
}
```

## Requêtes Complexes

### Sous-requêtes

```go
// Trouver les utilisateurs avec des posts populaires
users, err := orm.Query(&User{}).
    WhereIn("id",
        orm.Query(&Post{}).
            Select("user_id").
            Where("likes", ">", 100).
            GetSQL(),
    ).Find()

// Utilisateurs avec leur nombre de posts
users, err := orm.Query(&User{}).
    Select("users.*, (SELECT COUNT(*) FROM posts WHERE user_id = users.id) as post_count").
    Having("post_count > ?", 5).
    Find()
```

### Agrégations

```go
// Statistiques des commandes par jour
stats, err := orm.Query(&Order{}).
    Select(
        "DATE(created_at) as date",
        "COUNT(*) as total_orders",
        "SUM(total) as daily_revenue",
        "AVG(total) as average_order",
    ).
    GroupBy("date").
    Having("daily_revenue > ?", 1000).
    OrderBy("date", "DESC").
    Find()
```

## Transactions Avancées

### Points de Sauvegarde

```go
err := orm.Transaction(func(tx ORM) error {
    userRepo := tx.Repository(&User{})
    orderRepo := tx.Repository(&Order{})

    // Première étape
    if err := tx.SavePoint("users"); err != nil {
        return err
    }
    
    for _, userData := range usersData {
        if err := userRepo.Save(userData); err != nil {
            tx.RollbackTo("users")
            return err
        }
    }

    // Deuxième étape
    if err := tx.SavePoint("orders"); err != nil {
        return err
    }
    
    for _, orderData := range ordersData {
        if err := orderRepo.Save(orderData); err != nil {
            tx.RollbackTo("orders")
            return err
        }
    }

    return nil
})
```

### Transactions avec Timeout

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

err := orm.TransactionWithContext(ctx, func(tx ORM) error {
    // La transaction est annulée si elle dépasse 5 secondes
    return processLargeDataset(tx)
})
```

## Cache

```go
type CachedRepository struct {
    orm.Repository
    cache Cache
}

func (r *CachedRepository) Find(id interface{}) (interface{}, error) {
    key := fmt.Sprintf("user:%v", id)
    
    // Vérifier le cache
    if cached, found := r.cache.Get(key); found {
        return cached, nil
    }
    
    // Charger depuis la base
    user, err := r.Repository.Find(id)
    if err != nil {
        return nil, err
    }
    
    // Mettre en cache
    r.cache.Set(key, user, 1*time.Hour)
    return user, nil
}
```

## Tests

```go
func TestUserRepository(t *testing.T) {
    // Configuration de test
    cfg := builder.NewConfigBuilder().
        WithDialect(factory.SQLite).
        WithDatabase(":memory:").
        Build()

    orm := builder.NewSimpleORM().
        WithConfigBuilder(cfg).
        RegisterModel(&User{})

    if err := orm.Connect(); err != nil {
        t.Fatal(err)
    }
    defer orm.Close()

    // Migration
    if err := orm.GetORM().CreateTable(&User{}); err != nil {
        t.Fatal(err)
    }

    // Test de création
    repo := orm.GetORM().Repository(&User{})
    user := &User{Name: "Test User"}
    
    if err := repo.Save(user); err != nil {
        t.Errorf("Failed to create user: %v", err)
    }
    
    if user.ID == 0 {
        t.Error("Expected user ID to be set")
    }

    // Test de lecture
    found, err := repo.Find(user.ID)
    if err != nil {
        t.Errorf("Failed to find user: %v", err)
    }
    
    if found.(*User).Name != user.Name {
        t.Errorf("Expected name %s, got %s", user.Name, found.(*User).Name)
    }
}
``` 
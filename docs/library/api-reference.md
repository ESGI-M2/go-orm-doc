# Référence API

Cette documentation est conçue pour les développeurs utilisant l'ORM. Elle fournit des explications pratiques, des exemples concrets et des bonnes pratiques pour chaque fonctionnalité.

## Sommaire

- [Configuration et Initialisation](#configuration-et-initialisation)
  - [Configuration de la Connexion](#configuration-de-la-connexion)
  - [Builder de Configuration](#builder-de-configuration)
  - [Initialisation de l'ORM](#initialisation-de-lorm)

- [Opérations de Base](#operations-de-base)
  - [Gestion des Modèles](#gestion-des-modeles)
  - [Repository - Opérations CRUD](#repository-operations-crud)

- [Requêtes Avancées](#requetes-avancees)
  - [Query Builder](#query-builder)
  - [Construction de Requêtes](#construction-de-requetes)
  - [Patterns Avancés](#patterns-avances)

- [Transactions](#transactions)
  - [Gestion des Transactions](#gestion-des-transactions)
  - [Patterns Transactionnels](#patterns-transactionnels)
  - [Points de Sauvegarde](#points-de-sauvegarde)

- [Dialectes et Métadonnées](#dialectes-et-metadonnees)
  - [Support Multi-Base de Données](#support-multi-base-de-donnees)
  - [Métadonnées des Modèles](#metadonnees-des-modeles)

## Configuration et Initialisation {#configuration-et-initialisation}

La configuration est la première étape pour utiliser l'ORM. Cette section vous guide à travers les différentes options de configuration et leurs cas d'utilisation.

### Configuration de la Connexion {#configuration-de-la-connexion}

La configuration de la connexion définit comment l'ORM se connecte à votre base de données. Vous avez deux approches possibles : configuration directe ou utilisation du builder.

#### ConnectionConfig {#connectionconfig}

La structure `ConnectionConfig` contient tous les paramètres nécessaires pour la connexion :

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

💡 **Bonnes Pratiques**
- Ne stockez jamais les identifiants en dur dans le code
- Utilisez des variables d'environnement ou des fichiers de configuration
- Activez SSL en production
- Utilisez des utilisateurs avec des privilèges limités

#### Configuration Simple {#configuration-simple}

```go
// Chargement depuis les variables d'environnement
config := ConnectionConfig{
    Host:     os.Getenv("DB_HOST"),
    Port:     3306,
    Username: os.Getenv("DB_USER"),
    Password: os.Getenv("DB_PASS"),
    Database: os.Getenv("DB_NAME"),
    SSLMode:  "require", // SSL activé en production
}
```

### Builder de Configuration {#builder-de-configuration}

Le pattern Builder simplifie la configuration en offrant une interface fluide et en gérant les valeurs par défaut.

#### ConfigBuilder {#configbuilder}

```go
builder := NewConfigBuilder().
    WithDialect(MySQL).
    WithHost(os.Getenv("DB_HOST")).
    WithPort(3306).
    FromEnv() // Charge le reste depuis les variables d'environnement

// Création automatique de la base si elle n'existe pas
if env == "development" {
    builder.WithAutoCreateDatabase()
}

config, err := builder.Build()
```

💡 **Cas d'Utilisation**
- Environnement de développement : création automatique de la base
- Tests : utilisation d'une base temporaire
- Production : chargement depuis des variables d'environnement

### Initialisation de l'ORM {#initialisation-de-lorm}

L'ORM propose deux niveaux d'abstraction : `SimpleORM` pour les cas simples et `ORM` pour un contrôle total.

#### SimpleORM - Interface Simplifiée {#simpleorm-interface-simplifiee}

```go
// Initialisation basique
orm := NewSimpleORM().
    WithMySQL().
    WithConfig(config).
    RegisterModel(&User{}, &Product{})

// Avec plus de contrôle
orm := NewSimpleORM().
    WithDialect(MySQL).
    WithConfig(config).
    RegisterModels(models...).
    WithLogger(NewLogger(LogLevelDebug))
```

💡 **Quand Utiliser SimpleORM**
- Applications simples avec un seul type de base de données
- Pas besoin de fonctionnalités avancées
- Besoin d'une mise en place rapide

#### Configuration de Base {#configuration-de-base}

```go
// Initialisation basique
orm := NewSimpleORM().
    WithMySQL().
    WithConfig(config).
    RegisterModel(&User{}, &Product{})

// Avec plus de contrôle
orm := NewSimpleORM().
    WithDialect(MySQL).
    WithConfig(config).
    RegisterModels(models...).
    WithLogger(NewLogger(LogLevelDebug))
```

## Opérations de Base {#operations-de-base}

### Gestion des Modèles {#gestion-des-modeles}

Les modèles sont la représentation Go de vos tables. Leur conception impacte directement les performances et la maintenabilité.

#### Structure d'un Modèle {#structure-dun-modele}

```go
type User struct {
    ID        uint      `orm:"primary_key;auto_increment"`
    Name      string    `orm:"size:255;not_null;index"`
    Email     string    `orm:"unique;size:255"`
    Age       int       `orm:"default:18"`
    Active    bool      `orm:"default:true"`
    CreatedAt time.Time `orm:"not_null;auto_create"`
    UpdatedAt time.Time `orm:"not_null;auto_update"`
    DeletedAt *time.Time `orm:"soft_delete"`
}
```

💡 **Bonnes Pratiques des Modèles**
- Utilisez des types appropriés (uint pour les ID)
- Ajoutez des contraintes pertinentes
- Pensez aux index pour les champs souvent recherchés
- Implémentez soft delete pour les données sensibles
- Ajoutez des timestamps de création/modification

#### Tags ORM {#tags-orm}

Les tags ORM configurent le comportement de chaque champ :

| Tag | Description | Exemple |
|-----|-------------|---------|
| primary_key | Définit la clé primaire | `orm:"primary_key"` |
| auto_increment | Auto-incrémentation | `orm:"auto_increment"` |
| size | Taille du champ | `orm:"size:255"` |
| not_null | Champ obligatoire | `orm:"not_null"` |
| unique | Valeur unique | `orm:"unique"` |
| index | Crée un index | `orm:"index"` |
| default | Valeur par défaut | `orm:"default:true"` |
| foreign_key | Clé étrangère | `orm:"foreign_key:UserID"` |

### Repository - Opérations CRUD {#repository-operations-crud}

Le Repository encapsule la logique d'accès aux données. Il fournit une interface claire pour les opérations CRUD.

#### Interface Repository {#interface-repository}

```go
type Repository interface {
    // Lecture
    Find(id interface{}) (interface{}, error)
    FindAll() ([]interface{}, error)
    FindBy(criteria map[string]interface{}) ([]interface{}, error)
    FindOneBy(criteria map[string]interface{}) (interface{}, error)
    
    // Écriture
    Save(entity interface{}) error
    Update(entity interface{}) error
    Delete(entity interface{}) error
    
    // Utilitaires
    Count() (int64, error)
    Exists(id interface{}) (bool, error)
}
```

#### Patterns d'Utilisation {#patterns-utilisation}

1. **Création/Mise à jour intelligente**
   ```go
   user := &User{ID: 1, Name: "Alice"}
   repo.Save(user) // Crée si n'existe pas, met à jour sinon
   ```

2. **Recherche avec critères multiples**
   ```go
   users, err := repo.FindBy(map[string]interface{}{
       "age": 25,
       "active": true,
       "city": "Paris",
   })
   ```

3. **Vérification avant opération**
   ```go
   if exists, _ := repo.Exists(id); exists {
       user, err := repo.Find(id)
       // ...
   }
   ```

#### Exemples d'Opérations CRUD {#exemples-operations-crud}

1. **Création/Mise à jour intelligente**
   ```go
   user := &User{ID: 1, Name: "Alice"}
   repo.Save(user) // Crée si n'existe pas, met à jour sinon
   ```

2. **Recherche avec critères multiples**
   ```go
   users, err := repo.FindBy(map[string]interface{}{
       "age": 25,
       "active": true,
       "city": "Paris",
   })
   ```

3. **Vérification avant opération**
   ```go
   if exists, _ := repo.Exists(id); exists {
       user, err := repo.Find(id)
       // ...
   }
   ```

#### Recherche par Critères {#recherche-par-criteres}

1. **Création/Mise à jour intelligente**
   ```go
   user := &User{ID: 1, Name: "Alice"}
   repo.Save(user) // Crée si n'existe pas, met à jour sinon
   ```

2. **Recherche avec critères multiples**
   ```go
   users, err := repo.FindBy(map[string]interface{}{
       "age": 25,
       "active": true,
       "city": "Paris",
   })
   ```

3. **Vérification avant opération**
   ```go
   if exists, _ := repo.Exists(id); exists {
       user, err := repo.Find(id)
       // ...
   }
   ```

#### Bonnes Pratiques CRUD {#bonnes-pratiques-crud}

1. **Gestion des Erreurs**
   ```go
   user, err := repo.Find(id)
   if err != nil {
       if errors.Is(err, ErrNotFound) {
           // Gérer l'absence
       } else {
           // Gérer l'erreur
       }
   }
   ```

2. **Transactions pour les Opérations Multiples**
   ```go
   err := orm.Transaction(func(tx ORM) error {
       userRepo := tx.Repository(&User{})
       orderRepo := tx.Repository(&Order{})
       
       // Les opérations sont atomiques
       if err := userRepo.Save(user); err != nil {
           return err // Rollback automatique
       }
       return orderRepo.Save(order)
   })
   ```

3. **Validation Avant Sauvegarde**
   ```go
   func (u *User) BeforeSave() error {
       if u.Age < 18 {
           return errors.New("l'utilisateur doit être majeur")
       }
       return nil
   }
   ```

## Requêtes Avancées {#requetes-avancees}

### Query Builder {#query-builder}

Le Query Builder permet de construire des requêtes SQL complexes de manière type-safe et maintenable.

#### Construction de Requêtes {#construction-de-requetes}

```go
// Requête avec sous-requête et jointures
users, err := orm.Query(&User{}).
    Select("users.*, COUNT(orders.id) as order_count").
    LeftJoin("orders", "orders.user_id = users.id").
    Where("users.active", "=", true).
    WhereIn("users.role", []interface{}{"admin", "manager"}).
    GroupBy("users.id").
    Having("order_count > ?", 5).
    OrderBy("order_count", "DESC").
    Limit(10).
    Find()
```

#### Patterns Avancés {#patterns-avances}

1. **Requêtes Réutilisables**
   ```go
   func ActiveUsersQuery(qb QueryBuilder) QueryBuilder {
       return qb.Where("active", "=", true).
           WhereNotNull("email_verified_at")
   }
   
   // Utilisation
   users := orm.Query(&User{}).
       Pipe(ActiveUsersQuery).
       OrderBy("created_at", "DESC").
       Find()
   ```

2. **Agrégations Complexes**
   ```go
   stats, err := orm.Query(&Order{}).
       Select(
           "DATE(created_at) as date",
           "COUNT(*) as total_orders",
           "SUM(amount) as total_amount",
       ).
       GroupBy("date").
       Having("total_amount > ?", 1000).
       OrderBy("date", "DESC").
       Find()
   ```

3. **Jointures Multiples**
   ```go
   results, err := orm.Query(&Order{}).
       Select(
           "orders.*",
           "users.name as user_name",
           "products.title as product_title",
           "categories.name as category_name",
       ).
       Join("users", "users.id = orders.user_id").
       Join("order_items", "order_items.order_id = orders.id").
       Join("products", "products.id = order_items.product_id").
       LeftJoin("categories", "categories.id = products.category_id").
       Where("orders.status", "=", "completed").
       Find()
   ```

#### Requêtes de Base {#requetes-de-base}

```go
// Requête avec sous-requête et jointures
users, err := orm.Query(&User{}).
    Select("users.*, COUNT(orders.id) as order_count").
    LeftJoin("orders", "orders.user_id = users.id").
    Where("users.active", "=", true).
    WhereIn("users.role", []interface{}{"admin", "manager"}).
    GroupBy("users.id").
    Having("order_count > ?", 5).
    OrderBy("order_count", "DESC").
    Limit(10).
    Find()
```

## Transactions {#transactions}

### Gestion des Transactions {#gestion-des-transactions}

Les transactions garantissent l'intégrité des données lors d'opérations multiples.

#### Patterns Transactionnels {#patterns-transactionnels}

1. **Transaction Simple**
   ```go
   err := orm.Transaction(func(tx ORM) error {
       // Opérations dans la transaction
       return nil // Commit si pas d'erreur
   })
   ```

2. **Transaction avec Timeout**
   ```go
   ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
   defer cancel()
   
   err := orm.TransactionWithContext(ctx, func(tx ORM) error {
       // La transaction est annulée si elle dépasse 5 secondes
       return nil
   })
   ```

3. **Transaction avec Points de Sauvegarde**
   ```go
   err := orm.Transaction(func(tx ORM) error {
       // Première opération
       if err := tx.SavePoint("step1"); err != nil {
           return err
       }
       
       // Si erreur ici, retour au point de sauvegarde
       if err := someRiskyOperation(); err != nil {
           tx.RollbackTo("step1")
           return alternativeOperation()
       }
       
       return nil
   })
   ```

💡 **Bonnes Pratiques Transactionnelles**
- Gardez les transactions courtes
- Évitez les opérations externes (API, fichiers)
- Gérez correctement les timeouts
- Utilisez des points de sauvegarde pour les opérations complexes

#### Exemple Simple {#exemple-simple}

```go
err := orm.Transaction(func(tx ORM) error {
    // Opérations dans la transaction
    return nil // Commit si pas d'erreur
})
```

#### Contexte et Timeout {#contexte-et-timeout}

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

err := orm.TransactionWithContext(ctx, func(tx ORM) error {
    // La transaction est annulée si elle dépasse 5 secondes
    return nil
})
```

#### Points de Sauvegarde {#points-de-sauvegarde}

```go
err := orm.Transaction(func(tx ORM) error {
    // Première opération
    if err := tx.SavePoint("step1"); err != nil {
        return err
    }
    
    // Si erreur ici, retour au point de sauvegarde
    if err := someRiskyOperation(); err != nil {
        tx.RollbackTo("step1")
        return alternativeOperation()
    }
    
    return nil
})
```

## Dialectes et Métadonnées {#dialectes-et-metadonnees}

### Support Multi-Base de Données {#support-multi-base-de-donnees}

L'ORM supporte différentes bases de données via son système de dialectes.

#### Implémentation d'un Dialecte {#implementation-dun-dialecte}

```go
type CustomDialect struct {
    *BaseDialect
}

func (d *CustomDialect) GetSQLType(goType reflect.Type) string {
    switch goType.Kind() {
    case reflect.Int64:
        return "BIGINT"
    case reflect.String:
        return "VARCHAR(255)"
    // ...
    }
}
```

💡 **Cas d'Utilisation des Dialectes**
- Migration entre différentes bases
- Support de fonctionnalités spécifiques
- Tests avec base en mémoire
- Optimisations spécifiques

### Métadonnées des Modèles {#metadonnees-des-modeles}

Les métadonnées permettent d'inspecter et de manipuler la structure des modèles.

#### Utilisation des Métadonnées {#utilisation-des-metadonnees}

```go
// Inspection d'un modèle
metadata, err := orm.GetMetadata(&User{})
for _, column := range metadata.Columns {
    fmt.Printf("Colonne %s: %s\n", column.Name, column.Type)
    if column.ForeignKey != nil {
        fmt.Printf("  -> Référence %s.%s\n",
            column.ForeignKey.ReferencedTable,
            column.ForeignKey.ReferencedColumn)
    }
}
```

💡 **Applications des Métadonnées**
- Génération de schémas
- Validation de modèles
- Migration de données
- Génération de documentation 
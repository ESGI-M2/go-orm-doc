---
sidebar_position: 7
---

# Query Builder

Interface fluide pour construire des requêtes SQL complexes.

## Concepts Fondamentaux

### Query Builder

Constructeur de requêtes qui permet de :

- **Construire des requêtes fluides** avec méthodes chainables
- **Éviter les erreurs SQL** avec validation des paramètres
- **Sécuriser les requêtes** avec requêtes préparées automatiques
- **Maintenir la lisibilité** avec syntaxe proche du SQL naturel
- **Supporter plusieurs dialectes** sans changer le code applicatif

### Architecture

Pattern Builder pour créer des requêtes étape par étape :

```go
query := orm.Query(&User{}).
    Select("name", "email").
    Where("age", ">", 18).
    Where("is_active", "=", true).
    OrderBy("name", "ASC").
    Limit(10)

results, err := query.Find()
```

## Méthodes de Base

### Création d'une Requête

```go
// Créer un Query Builder pour un modèle
query := orm.Query(&User{})

// Ou via le SimpleORM
query := simpleORM.Query(&User{})
```

### Sélection des Champs

#### `Select(fields ...string) QueryBuilder`

Spécifie les champs à sélectionner.

```go
// Sélectionner des champs spécifiques
users, err := orm.Query(&User{}).
    Select("id", "name", "email").
    Find()

// Sélectionner tous les champs (par défaut)
users, err := orm.Query(&User{}).
    Find()

// Sélectionner avec alias
users, err := orm.Query(&User{}).
    Select("name as user_name", "email as user_email").
    Find()
```

### Conditions WHERE

#### `Where(field string, operator string, value interface{}) QueryBuilder`

Ajoute une condition WHERE à la requête.

```go
// Condition simple
users, err := orm.Query(&User{}).
    Where("age", ">", 18).
    Find()

// Conditions multiples (AND)
users, err := orm.Query(&User{}).
    Where("age", ">", 18).
    Where("is_active", "=", true).
    Where("name", "LIKE", "%John%").
    Find()

// Différents opérateurs
users, err := orm.Query(&User{}).
    Where("age", ">=", 18).
    Where("age", "<=", 65).
    Where("status", "!=", "banned").
    Find()
```

**Opérateurs supportés :**
- `=` : Égal
- `!=` : Différent
- `>` : Supérieur
- `>=` : Supérieur ou égal
- `<` : Inférieur
- `<=` : Inférieur ou égal
- `LIKE` : Correspondance de motif
- `NOT LIKE` : Pas de correspondance de motif

#### `WhereIn(field string, values []interface{}) QueryBuilder`

Condition WHERE IN pour plusieurs valeurs.

```go
// WHERE IN avec entiers
users, err := orm.Query(&User{}).
    WhereIn("id", []interface{}{1, 2, 3, 4, 5}).
    Find()

// WHERE IN avec chaînes
users, err := orm.Query(&User{}).
    WhereIn("status", []interface{}{"active", "premium", "verified"}).
    Find()
```

#### `WhereNotIn(field string, values []interface{}) QueryBuilder`

Condition WHERE NOT IN pour exclure des valeurs.

```go
users, err := orm.Query(&User{}).
    WhereNotIn("status", []interface{}{"banned", "suspended"}).
    Find()
```

#### `WhereNull(field string) QueryBuilder`

Condition WHERE IS NULL.

```go
users, err := orm.Query(&User{}).
    WhereNull("deleted_at").
    Find()
```

#### `WhereNotNull(field string) QueryBuilder`

Condition WHERE IS NOT NULL.

```go
users, err := orm.Query(&User{}).
    WhereNotNull("email_verified_at").
    Find()
```

## Jointures

### `Join(table string, leftField string, operator string, rightField string) QueryBuilder`

Ajoute une jointure INNER JOIN.

```go
// Jointure simple
posts, err := orm.Query(&Post{}).
    Join("users", "posts.user_id", "=", "users.id").
    Where("users.is_active", "=", true).
    Find()

// Jointure avec sélection de champs
posts, err := orm.Query(&Post{}).
    Select("posts.title", "posts.content", "users.name as author_name").
    Join("users", "posts.user_id", "=", "users.id").
    Find()
```

### `LeftJoin(table string, leftField string, operator string, rightField string) QueryBuilder`

Ajoute une jointure LEFT JOIN.

```go
// Récupérer tous les utilisateurs avec leurs posts (même sans posts)
users, err := orm.Query(&User{}).
    Select("users.name", "posts.title").
    LeftJoin("posts", "users.id", "=", "posts.user_id").
    Find()
```

### `RightJoin(table string, leftField string, operator string, rightField string) QueryBuilder`

Ajoute une jointure RIGHT JOIN.

```go
// Récupérer tous les posts avec leurs auteurs
posts, err := orm.Query(&Post{}).
    Select("posts.title", "users.name").
    RightJoin("users", "posts.user_id", "=", "users.id").
    Find()
```

### Jointures Multiples

```go
// Jointures multiples
comments, err := orm.Query(&Comment{}).
    Select("comments.content", "users.name", "posts.title").
    Join("users", "comments.user_id", "=", "users.id").
    Join("posts", "comments.post_id", "=", "posts.id").
    Find()
```

## Tri et Limitation

### `OrderBy(field string, direction string) QueryBuilder`

Trie les résultats par un champ.

```go
// Tri croissant
users, err := orm.Query(&User{}).
    OrderBy("name", "ASC").
    Find()

// Tri décroissant
users, err := orm.Query(&User{}).
    OrderBy("created_at", "DESC").
    Find()

// Tri multiple
users, err := orm.Query(&User{}).
    OrderBy("age", "DESC").
    OrderBy("name", "ASC").
    Find()
```

### `Limit(count int) QueryBuilder`

Limite le nombre de résultats.

```go
// Limiter à 10 résultats
users, err := orm.Query(&User{}).
    Limit(10).
    Find()
```

### `Offset(count int) QueryBuilder`

Définit le décalage pour la pagination.

```go
// Pagination : page 2, 10 éléments par page
users, err := orm.Query(&User{}).
    Limit(10).
    Offset(10).
    Find()
```

## Groupement et Agrégation

### `GroupBy(fields ...string) QueryBuilder`

Groupe les résultats par un ou plusieurs champs.

```go
// Grouper par champ
result, err := orm.Query(&Order{}).
    Select("status", "COUNT(*) as count").
    GroupBy("status").
    Find()
```

### `Having(field string, operator string, value interface{}) QueryBuilder`

Ajoute une condition HAVING.

```go
// Grouper avec condition
result, err := orm.Query(&Order{}).
    Select("user_id", "COUNT(*) as order_count").
    GroupBy("user_id").
    Having("order_count", ">", 5).
    Find()
```

## Conditions Avancées

### `WhereOr(conditions [][]interface{}) QueryBuilder`

Ajoute des conditions OR.

```go
// Conditions OR
users, err := orm.Query(&User{}).
    WhereOr([][]interface{}{
        {"age", ">", 65},
        {"is_vip", "=", true},
    }).
    Find()
```

### `WhereBetween(field string, min, max interface{}) QueryBuilder`

Condition BETWEEN.

```go
// Entre deux valeurs
users, err := orm.Query(&User{}).
    WhereBetween("age", 18, 65).
    Find()
```

### `WhereNotBetween(field string, min, max interface{}) QueryBuilder`

Condition NOT BETWEEN.

```go
// Pas entre deux valeurs
users, err := orm.Query(&User{}).
    WhereNotBetween("age", 13, 17).
    Find()
```

## Requêtes Spécialisées

### `Distinct() QueryBuilder`

Supprime les doublons.

```go
// Résultats uniques
cities, err := orm.Query(&User{}).
    Select("city").
    Distinct().
    Find()
```

### `FullTextSearch(field string, query string) QueryBuilder`

Recherche textuelle complète.

```go
// Recherche full-text
posts, err := orm.Query(&Post{}).
    FullTextSearch("content", "golang programming").
    Find()
```

### `SubQuery(subquery interfaces.QueryBuilder) QueryBuilder`

Utilise une sous-requête.

```go
// Sous-requête
activeUsers := orm.Query(&User{}).
    Select("id").
    Where("is_active", "=", true)

posts, err := orm.Query(&Post{}).
    Where("user_id", "IN", activeUsers).
    Find()
```

### `Union(query interfaces.QueryBuilder) QueryBuilder`

Union de requêtes.

```go
// Union
premiumUsers := orm.Query(&User{}).
    Where("is_premium", "=", true)

vipUsers := orm.Query(&User{}).
    Where("is_vip", "=", true)

allSpecialUsers, err := premiumUsers.Union(vipUsers).Find()
```

## Relations

### `With(relation string) QueryBuilder`

Charge une relation.

```go
// Charger la relation
users, err := orm.Query(&User{}).
    With("Posts").
    Find()
```

### `WithCount(relation string) QueryBuilder`

Compte les éléments d'une relation.

```go
// Compter les relations
users, err := orm.Query(&User{}).
    WithCount("Posts").
    Find()
```

### `WithExists(relation string) QueryBuilder`

Vérifie l'existence d'une relation.

```go
// Vérifier l'existence
users, err := orm.Query(&User{}).
    WithExists("Posts").
    Find()
```

## Pagination

### `CursorPaginate(limit int, cursor string) QueryBuilder`

Pagination par curseur.

```go
// Pagination par curseur
users, err := orm.Query(&User{}).
    CursorPaginate(10, "").
    Find()
```

### `OffsetPaginate(limit, offset int) QueryBuilder`

Pagination par offset.

```go
// Pagination par offset
users, err := orm.Query(&User{}).
    OffsetPaginate(10, 20).
    Find()
```

## Verrouillage

### `ForUpdate() QueryBuilder`

Verrouillage pour mise à jour.

```go
// Verrouiller pour mise à jour
user, err := orm.Query(&User{}).
    Where("id", "=", 1).
    ForUpdate().
    First()
```

### `ForShare() QueryBuilder`

Verrouillage partagé.

```go
// Verrouillage partagé
user, err := orm.Query(&User{}).
    Where("id", "=", 1).
    ForShare().
    First()
```

## Cache

### `Cache(ttl int) QueryBuilder`

Met en cache le résultat.

```go
// Cache pendant 5 minutes
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Cache(300).
    Find()
```

## Exécution des Requêtes

### `Find() ([]interface{}, error)`

Exécute la requête et retourne tous les résultats.

```go
users, err := orm.Query(&User{}).
    Where("age", ">", 18).
    Find()
```

### `First() (interface{}, error)`

Retourne le premier résultat.

```go
user, err := orm.Query(&User{}).
    Where("email", "=", "john@example.com").
    First()
```

### `Get() ([]interface{}, error)`

Alias pour Find().

```go
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Get()
```

### `Count() (int, error)`

Compte les résultats.

```go
count, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Count()
```

### `Exists() (bool, error)`

Vérifie l'existence.

```go
exists, err := orm.Query(&User{}).
    Where("email", "=", "john@example.com").
    Exists()
```

## Exemples Pratiques

### Requête Simple

```go
// Utilisateurs actifs
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    OrderBy("name", "ASC").
    Find()
```

### Requête avec Jointure

```go
// Posts avec auteurs
posts, err := orm.Query(&Post{}).
    Select("posts.title", "posts.content", "users.name as author").
    Join("users", "posts.user_id", "=", "users.id").
    Where("posts.published", "=", true).
    OrderBy("posts.created_at", "DESC").
    Find()
```

### Requête avec Pagination

```go
// Pagination des utilisateurs
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    OrderBy("created_at", "DESC").
    Limit(20).
    Offset(page * 20).
    Find()
```

### Requête d'Agrégation

```go
// Statistiques par statut
stats, err := orm.Query(&Order{}).
    Select("status", "COUNT(*) as count", "SUM(amount) as total").
    GroupBy("status").
    Having("count", ">", 0).
    Find()
```

### Requête Complexe

```go
// Utilisateurs avec posts récents
users, err := orm.Query(&User{}).
    Select("users.name", "COUNT(posts.id) as post_count").
    Join("posts", "users.id", "=", "posts.user_id").
    Where("posts.created_at", ">", time.Now().AddDate(0, -1, 0)).
    Where("users.is_active", "=", true).
    GroupBy("users.id", "users.name").
    Having("post_count", ">", 5).
    OrderBy("post_count", "DESC").
    Limit(10).
    Find()
```

## Gestion des Erreurs

### Validation des Paramètres

```go
users, err := orm.Query(&User{}).
    Where("age", ">", 18).
    Find()

if err != nil {
    switch err {
    case query.ErrInvalidOperator:
        log.Fatal("Opérateur invalide")
    case query.ErrMissingField:
        log.Fatal("Champ manquant")
    default:
        log.Fatal("Erreur de requête:", err)
    }
}
```

### Vérification des Résultats

```go
user, err := orm.Query(&User{}).
    Where("id", "=", 1).
    First()

if err != nil {
    if err == query.ErrNoRows {
        log.Println("Aucun utilisateur trouvé")
    } else {
        log.Fatal("Erreur:", err)
    }
}
```

## Performance et Optimisation

### Utilisation des Index

```go
// Utiliser les champs indexés
users, err := orm.Query(&User{}).
    Where("email", "=", "john@example.com"). // email est indexé
    Find()
```

### Limitation des Résultats

```go
// Limiter les résultats
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Limit(100). // Ne pas charger trop de données
    Find()
```

### Sélection de Champs

```go
// Sélectionner seulement les champs nécessaires
users, err := orm.Query(&User{}).
    Select("id", "name", "email").
    Where("is_active", "=", true).
    Find()
```

### Utilisation du Cache

```go
// Mettre en cache les requêtes fréquentes
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Cache(300). // 5 minutes
    Find()
``` 
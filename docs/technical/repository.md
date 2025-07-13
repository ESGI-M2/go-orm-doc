---
sidebar_position: 4
sidebar_label: Repository interne
---

# Repository - Implémentation technique

Cette page détaille l'implémentation interne du Repository.

## Fonctionnalités Go utilisées

### Packages standards
* `reflect` : Manipulation des structures et des champs
* `context` : Support du contexte pour les opérations
* `sync` : Protection des métadonnées partagées
* `errors` : Gestion des erreurs avec wrapping
* `time` : Gestion des timestamps et soft delete

### Concepts Go avancés
* **Generics** : Repository typé avec `Repository[T]`
* **Reflection** : Mapping dynamique struct ↔ DB
* **Interfaces** : Abstraction des opérations CRUD
* **Type embedding** : Composition des fonctionnalités
* **Method sets** : API complète sur les pointeurs
* **Interface detection** : Détection dynamique des hooks

### Patterns Go idiomatiques
* **Repository pattern** : Abstraction de la persistance
* **Options pattern** : Configuration flexible
* **Context usage** : Propagation du contexte
* **Error wrapping** : Enrichissement des erreurs
* **Middleware pattern** : Hooks pre/post opérations
* **Chain of responsibility** : Exécution des hooks

## Structure interne

```go
type Repository[T any] struct {
    dialect    Dialect
    metadata   *Metadata
    builder    QueryBuilder
    hooks      []Hook
    scopes     map[string]Scope
    ctx        context.Context
}

type Hook func(ctx context.Context, op Operation, entity interface{}) error
type Scope func(QueryBuilder) QueryBuilder
```

## Système de Hooks

Les hooks permettent d'exécuter du code avant/après les opérations :

```go
// Définition des hooks via interfaces
type BeforeCreate interface {
    BeforeCreate() error
}

type AfterCreate interface {
    AfterCreate() error
}

// Exécution
func (r *Repository) executeHooks(hookType string, entity interface{}) error {
    if hook, ok := entity.(BeforeCreate); ok && hookType == "BeforeCreate" {
        return hook.BeforeCreate()
    }
    // ... autres hooks
    return nil
}
```

### Hooks supportés
* BeforeCreate/AfterCreate
* BeforeSave/AfterSave
* BeforeUpdate/AfterUpdate
* BeforeDelete/AfterDelete

## Soft Delete

Implémentation du soft delete via un champ `deleted_at` :

```go
func (r *Repository) SoftDelete(entity interface{}) error {
    if !r.metadata.SoftDeletes {
        return ErrSoftDeletesNotEnabled
    }
    
    r.setDeletedAt(entity)
    return r.Save(entity)
}

func (r *Repository) Restore(entity interface{}) error {
    r.clearDeletedAt(entity)
    return r.Save(entity)
}

func (r *Repository) FindTrashed() ([]T, error) {
    return r.builder.
        WhereNotNull("deleted_at").
        Find()
}
```

## Système de Scopes

Les scopes sont des fonctions réutilisables qui modifient le query builder :

```go
// Définition d'un scope
repo.AddScope("active", func(q QueryBuilder) QueryBuilder {
    return q.Where("active", "=", true)
})

// Utilisation
users, err := repo.
    Scope("active").
    Where("age", ">", 18).
    Find()
```

### Fonctionnalités des scopes
* Chaînables avec le query builder
* Support des arguments
* Réutilisables
* Combinables

## Opérations CRUD

### Create
1. Validation des champs requis
2. Exécution des hooks pre-create
3. Construction de la requête INSERT
4. Exécution et récupération de l'ID
5. Mise à jour de l'entité
6. Exécution des hooks post-create

### Read
1. Construction du SELECT
2. Exécution de la requête
3. Mapping des résultats vers T
4. Gestion des relations

### Update
1. Détection des champs modifiés
2. Hooks pre-update
3. Construction de l'UPDATE
4. Exécution et vérification
5. Hooks post-update

### Delete
1. Hooks pre-delete
2. Soft delete si activé
3. Hard delete sinon
4. Hooks post-delete

## Gestion des erreurs

* ErrNotFound : Entité non trouvée
* ErrValidation : Validation échouée
* ErrHookFailed : Erreur dans un hook
* ErrTransaction : Erreur transactionnelle
* ErrSoftDeletesNotEnabled : Soft delete non activé

## Optimisations

* Réutilisation des requêtes préparées
* Batch operations pour les collections
* Détection intelligente des hooks

---

> Voir la documentation utilisateur pour les exemples d'utilisation. 
# Référence API

Cette documentation est conçue pour les développeurs utilisant l'ORM. Elle fournit des explications pratiques, des exemples concrets et des bonnes pratiques pour chaque fonctionnalité.

## Sommaire

- [Référence API](#référence-api)
  - [Sommaire](#sommaire)
  - [Configuration et Initialisation {#configuration-et-initialisation}](#configuration-et-initialisation-configuration-et-initialisation)
    - [Repository - Opérations CRUD {#repository-operations-crud}](#repository---opérations-crud-repository-operations-crud)
      - [Interface Repository {#interface-repository}](#interface-repository-interface-repository)
      - [Patterns d'Utilisation {#patterns-utilisation}](#patterns-dutilisation-patterns-utilisation)
    - [Query Builder {#query-builder}](#query-builder-query-builder)
      - [Construction de Requêtes {#construction-de-requetes}](#construction-de-requêtes-construction-de-requetes)
      - [Patterns Avancés {#patterns-avances}](#patterns-avancés-patterns-avances)
    - [Support Multi-Base de Données {#support-multi-base-de-donnees}](#support-multi-base-de-données-support-multi-base-de-donnees)
      - [Implémentation d'un Dialecte {#implementation-dun-dialecte}](#implémentation-dun-dialecte-implementation-dun-dialecte)
      - [Cas d'Utilisation des Dialectes {#cas-utilisation-dialectes}](#cas-dutilisation-des-dialectes-cas-utilisation-dialectes)
      - [Applications des Métadonnées {#applications-metadonnees}](#applications-des-métadonnées-applications-metadonnees)

## Configuration et Initialisation {#configuration-et-initialisation}

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

### Query Builder {#query-builder}

Le Query Builder permet de construire des requêtes SQL complexes de manière type-safe et maintenable.

#### Construction de Requêtes {#construction-de-requetes}

// ... existing code ...

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

### Support Multi-Base de Données {#support-multi-base-de-donnees}

L'ORM supporte différentes bases de données via son système de dialectes.

#### Implémentation d'un Dialecte {#implementation-dun-dialecte}

// ... existing code ...

#### Cas d'Utilisation des Dialectes {#cas-utilisation-dialectes}
- Migration entre différentes bases
- Support de fonctionnalités spécifiques
- Tests avec base en mémoire
- Optimisations spécifiques

#### Applications des Métadonnées {#applications-metadonnees}
- Génération de schémas
- Validation de modèles
- Migration de données
- Génération de documentation 
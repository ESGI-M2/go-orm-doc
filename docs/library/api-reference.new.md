# Référence API

Cette documentation est conçue pour les développeurs utilisant l'ORM. Elle fournit des explications pratiques, des exemples concrets et des bonnes pratiques pour chaque fonctionnalité.

## Sommaire

1. [Configuration et Initialisation](#configuration-et-initialisation)
   - [Configuration de la Connexion](#configuration-de-la-connexion)
     * [ConnectionConfig](#connectionconfig)
     * [Configuration Simple](#configuration-simple)
   - [Builder de Configuration](#builder-de-configuration)
     * [ConfigBuilder](#configbuilder)
   - [Initialisation de l'ORM](#initialisation-de-lorm)
     * [SimpleORM - Interface Simplifiée](#simpleorm-interface-simplifiee)
     * [Configuration de Base](#configuration-de-base)

2. [Opérations de Base](#operations-de-base)
   - [Gestion des Modèles](#gestion-des-modeles)
     * [Structure d'un Modèle](#structure-dun-modele)
     * [Tags ORM](#tags-orm)
   - [Repository - Opérations CRUD](#repository-operations-crud)
     * [Interface Repository](#interface-repository)
     * [Patterns d'Utilisation](#patterns-utilisation)
     * [Exemples d'Opérations CRUD](#exemples-operations-crud)
     * [Recherche par Critères](#recherche-par-criteres)
     * [Bonnes Pratiques CRUD](#bonnes-pratiques-crud)

3. [Requêtes Avancées](#requetes-avancees)
   - [Query Builder](#query-builder)
     * [Construction de Requêtes](#construction-de-requetes)
     * [Patterns Avancés](#patterns-avances)
     * [Requêtes de Base](#requetes-de-base)

4. [Transactions](#transactions)
   - [Gestion des Transactions](#gestion-des-transactions)
     * [Patterns Transactionnels](#patterns-transactionnels)
     * [Exemple Simple](#exemple-simple)
     * [Contexte et Timeout](#contexte-et-timeout)
     * [Points de Sauvegarde](#points-de-sauvegarde)

5. [Dialectes et Métadonnées](#dialectes-et-metadonnees)
   - [Support Multi-Base de Données](#support-multi-base-de-donnees)
     * [Implémentation d'un Dialecte](#implementation-dun-dialecte)
     * [Cas d'Utilisation des Dialectes](#cas-utilisation-dialectes)
   - [Métadonnées des Modèles](#metadonnees-des-modeles)
     * [Utilisation des Métadonnées](#utilisation-des-metadonnees)
     * [Applications des Métadonnées](#applications-metadonnees)

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
---
sidebar_position: 3
sidebar_label: Métadonnées & Réflexion
---

# Metadata - Implémentation technique

Cette page détaille l'implémentation du système de métadonnées qui analyse et met en cache les informations sur les structures.

## Fonctionnalités Go utilisées

### Packages standards
* `reflect` : Analyse complète des structures
* `sync` : Cache thread-safe avec `sync.Map`
* `strings` : Manipulation des noms de tables/colonnes
* `encoding/json` : Support des tags JSON
* `regexp` : Validation des noms d'identifiants

### Concepts Go avancés
* **Reflection** : Introspection profonde des types
* **Struct tags** : Parsing des métadonnées de mapping
* **Type switches** : Analyse des types de champs
* **Interface satisfaction** : Détection des hooks
* **Type embedding** : Héritage des métadonnées

### Patterns Go idiomatiques
* **Singleton** : Cache global des métadonnées
* **Lazy loading** : Analyse à la demande
* **Immutability** : Métadonnées immuables après création
* **Type registry** : Enregistrement des types personnalisés
* **Error handling** : Validation stricte des structures

## Structure interne

```go
type Metadata struct {
    ModelType    reflect.Type
    TableName    string
    PrimaryKey   string
    Columns      []Column
    Relationships []Relationship
    Hooks        []Hook
    cache        *sync.Map
}

type Column struct {
    Name         string
    Field        string
    Type         reflect.Type
    IsNullable   bool
    DefaultValue interface{}
    Tags         map[string]string
}
```

## Extraction des métadonnées

1. Analyse du type via reflection
2. Lecture des tags de structure
3. Détection des relations
4. Validation des contraintes
5. Mise en cache du résultat

## Tags supportés

* `orm:"column:name"` : Nom de colonne
* `orm:"primary_key"` : Clé primaire
* `orm:"type:varchar(255)"` : Type SQL
* `orm:"not null"` : Contrainte
* `orm:"default:value"` : Valeur par défaut

## Cache des métadonnées

* Utilisation de `sync.Map`
* Clé = `reflect.Type`
* Valeur = `*Metadata`
* Thread-safe par design

## Relations

* One-to-One : Champ unique
* One-to-Many : Slice
* Many-to-Many : Table de jointure
* Belongs-To : Clé étrangère

## Validation

* Noms de tables/colonnes valides
* Types supportés par les dialectes
* Relations cohérentes
* Tags syntaxiquement corrects

## Performance

* Cache des métadonnées
* Réutilisation des types reflect
* Analyse unique par type
* Validation à la compilation si possible

---

> Les métadonnées sont le cœur de l'ORM, permettant le mapping objet-relationnel. 
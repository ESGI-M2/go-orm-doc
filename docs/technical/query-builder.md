---
sidebar_position: 5
sidebar_label: Query Builder interne
---

# Query Builder - Implémentation technique

Cette page détaille l'implémentation interne du Query Builder.

## Fonctionnalités Go utilisées

### Packages standards
* `strings.Builder` : Construction efficace des requêtes SQL
* `fmt` : Formatage des paramètres et des conditions
* `reflect` : Analyse des structures pour les clauses WHERE
* `errors` : Gestion des erreurs de construction de requêtes

### Concepts Go avancés
* **Method chaining** : Retour du receveur pour un chaînage fluide
* **Variadic functions** : Arguments variables pour les conditions
* **Type switches** : Analyse dynamique des types de paramètres
* **Struct tags** : Extraction des métadonnées de mapping
* **Interface composition** : Séparation des responsabilités du builder

### Patterns Go idiomatiques
* **Builder pattern** : Construction progressive des requêtes
* **Fluent interface** : API chainable et expressive
* **Type safety** : Vérification des types à la compilation
* **Error handling** : Accumulation des erreurs pendant la construction
* **Immutability** : Clonage du builder pour les sous-requêtes

## Structure interne

```go
type QueryBuilder struct {
    dialect    Dialect
    model      interface{}
    table     string
    columns   []string
    where     []Condition
    joins     []Join
    orderBy   []string
    limit     *int
    offset    *int
    args      []interface{}
    err       error
}
```

## Méthodes principales

* **Select** : Spécifie les colonnes à retourner
* **Where** : Ajoute des conditions de filtrage
* **Join** : Gère les jointures entre tables
* **OrderBy** : Tri des résultats
* **Limit/Offset** : Pagination des résultats

## Construction des requêtes

1. Chaque méthode ajoute des éléments à la structure
2. `Build()` assemble la requête finale
3. Les paramètres sont collectés dans l'ordre
4. Le Dialect fournit les placeholders

## Gestion des erreurs

* Chaque méthode vérifie la validité des paramètres
* Les erreurs sont accumulées dans le champ `err`
* `Build()` retourne l'erreur si la construction échoue

## Sécurité

* Utilisation systématique des placeholders
* Échappement des identifiants via le Dialect
* Validation des noms de colonnes et tables

---

> Voir la documentation utilisateur pour les exemples d'utilisation. 
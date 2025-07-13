# Plan de la documentation « Technique »

> Cette section explique **comment** chaque fonctionnalité de GO ORM est implémentée en Go : conception, structures de données, algorithmes, limites, choix techniques. Chaque élément du sommaire correspond à **une page distincte** et fait écho à la page utilisateur.

## Sommaire proposé

1. **Architecture générale**
   * Découpage en packages (`orm`, `dialect`, `repository`, `query`, etc.).
   * Diagramme de dépendances.
2. **Gestion des Dialectes**
   * Interface `Dialect`.
   * Implémentations MySQL, PostgreSQL, Mock.
   * Mapping Go → SQL (`GetSQLType`), placeholders.
3. **Gestion de la Connexion**
   * Package `connection`.
   * Pool de connexions.
   * Stratégie de reconnexion.
4. **ConfigBuilder**
   * Pattern Builder en Go (méthodes fluentes).
   * Validation et valeurs par défaut.
5. **ORM (Simple & Advanced)**
   * Composition avec la Connexion.
   * Stratégie d'injection (dialecte).
6. **Métadonnées & Réflexion**
   * Package `metadata`.
   * Parsing des tags `orm:"..."`.
   * Gestion des relations.
7. **Repository**
   * Générique via `interface{}` + réflexion.
   * Détection Insert vs Update.
   * Hooks avant/après opérations.
8. **Query Builder**
   * Représentation interne (structs `select`, `where`, etc.).
   * Chaînage fluide.
   * Génération SQL + Args.
9. **Insert Builder**
   * Module spécifique `insert`.
   * Gestion `BatchCreate`.
10. **Transactions**
    * Interface `Transaction`.
    * Gestion de contexte.
    * Savepoints / imbrication (Mock dialect).
11. **Pagination**
    * Implémentation offset vs cursor.
    * Calcul `nextCursor`.
12. **Gestion des erreurs**
    * Types d'erreur dédiés.
    * Stratégie de wrapping (`fmt.Errorf("%w"...)`).
13. **Helpers**
    * `factory` (dialects), `dialect_helpers`, `pretty`.

## Conventions

* Diagrammes *Mermaid* pour illustrer les flux.
* Extraits de code réduits, pointant vers le module source.
* Liens vers la page utilisateur correspondante.

---

> Après validation, les pages techniques seront générées et intégrées au sommaire sous la section « Technique » (DOC05, DOC07). 
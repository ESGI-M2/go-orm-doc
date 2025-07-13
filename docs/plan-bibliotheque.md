# Plan de la documentation « Bibliothèque »

> Cette section décrit la structure et le contenu prévus pour la documentation d'utilisation de GO ORM. Chaque point correspond à **une page Docusaurus distincte** afin d'assurer une navigation claire via le sommaire.

## Sommaire proposé

1. **Introduction**
   * Présentation brève de GO ORM.
   * Principes de conception (builder, repository, SQL-less, etc.).
2. **Installation**
   * Pré-requis.
   * `go get` + configuration.
   * Chargement des variables d'environnement.
3. **Configuration & Connexion**
   * `ConfigBuilder` pas-à-pas.
   * Connexion SimpleORM vs AdvancedORM.
   * Auto-création de base, pooling.
   * Exemples de code complets.
4. **Modèles & Métadonnées**
   * Définition d'un modèle.
   * Tags `orm:"..."` (table, colonne, pk, auto, softDelete…).
   * Gestion des relations dans le modèle.
5. **Repository (CRUD)**
   * Création du repository.
   * Opérations Find / Save / Update / Delete.
   * Soft Delete & Restore.
   * Opérations en lot : BatchCreate/Update/Delete.
   * Scopes & Hooks.
6. **Query Builder**
   * Query basique (Select, Where, Join, GroupBy, OrderBy…).
   * Query avancée (SubQuery, With, Union, ForUpdate…).
   * Pagination offset / cursor.
7. **Transactions**
   * Début, commit, rollback.
   * Transactions imbriquées & contexte.
8. **Relations & Eager Loading**
   * `WithRelations`, `WithCount`, `WithExists`.
   * Exemples de chargement relationnel.
9. **Migrations & Schéma**
   * `CreateTable`, `Migrate`, `DropTable`.
   * Détection & helpers de dialecte.
10. **Pagination**
    * Utilisation de la pagination offset et cursor.
11. **Gestion des erreurs**
    * Types d'erreurs fournies.
    * Bonnes pratiques de handling.
12. **Recettes & Exemples complets**
    * CRUD complet.
    * Authentification simplifiée.
    * Reporting/statistiques.

## Règles rédactionnelles

* **Langue** : français.
* **Exemples** : courts, auto-contenus, copiables-collables.
* **Code** : formatage Go standard avec commentaires.
* **Navigation** : chaque page doit se trouver dans le sidebar sous la section « Bibliothèque ».
* **Liens croisés** : renvoyer vers la page technique correspondante quand pertinent.

---

> Une fois ce plan validé, les pages seront créées et reliées dans le sidebar. (Tâches DOC05, DOC06). 
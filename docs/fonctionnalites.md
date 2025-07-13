---
sidebar_position: 4
---

# Fonctionnalités

Ce document présente une vue d'ensemble des fonctionnalités de GO ORM.

## Fonctionnalités principales

### Configuration et connexion
- Support MySQL et PostgreSQL
- Configuration via builder pattern
- Configuration via variables d'environnement
- Création automatique de la base de données (optionnel)
- Pool de connexions basique via database/sql

### Modèles et métadonnées
- Définition via struct tags
- Extraction automatique des métadonnées
- Support des types Go de base
- Clés primaires et auto-increment
- Timestamps automatiques (created_at, updated_at)
- Soft delete avec deleted_at

### Repository
- Opérations CRUD complètes
  - Find(id)
  - FindAll()
  - FindBy(criteria)
  - FindOneBy(criteria)
  - Save(entity)
  - Update(entity)
  - Delete(entity)
  - Count()
  - Exists(id)
- Hooks de cycle de vie
  - BeforeCreate/AfterCreate
  - BeforeSave/AfterSave
  - BeforeUpdate/AfterUpdate
  - BeforeDelete/AfterDelete
- Scopes réutilisables
- Soft delete avec restauration

### Query Builder
- Sélection de champs (Select)
- Conditions WHERE
  - Égalité (=)
  - IN / NOT IN
  - BETWEEN / NOT BETWEEN
  - NULL / NOT NULL
  - LIKE / NOT LIKE
- Tri (OrderBy)
- Groupement (GroupBy, Having)
- Pagination simple (Limit, Offset)
- Jointures
  - INNER JOIN
  - LEFT JOIN
  - RIGHT JOIN
- Requêtes brutes (Raw SQL)
- Distinct
- Verrouillage (FOR UPDATE, FOR SHARE)

### Transactions
- Support des transactions ACID
- Gestion automatique commit/rollback
- Support du contexte (context.Context)
- Rollback automatique en cas de panique

### Migrations
- Création de tables (CreateTable)
- Suppression de tables (DropTable)
- Migration automatique des modèles enregistrés (Migrate)

### Relations
- One-to-One
- One-to-Many
- Support basique des clés étrangères

### Logging
- Logging basique des requêtes SQL
- Support des loggers personnalisés

## Fonctionnalités en développement

Les fonctionnalités suivantes sont prévues ou en cours de développement :

- Cache de requêtes
- Pagination avancée (cursor-based)
- Validation intégrée
- Opérations JSON natives
- Recherche full-text
- Relations Many-to-Many avancées
- Logging avancé configurable
- Configuration avancée du pool de connexions

## Dialectes supportés

### MySQL
- Types de données MySQL
- Fonctions spécifiques MySQL
- Placeholders adaptés

### PostgreSQL
- Types de données PostgreSQL
- Fonctions spécifiques PostgreSQL
- Placeholders adaptés

### Mock (Tests)
- Dialecte simulé pour les tests unitaires
- Pas de connexion réelle à une base de données
- Validation des requêtes générées

---

> Pour plus de détails sur l'implémentation technique, consultez la [documentation technique](technical/architecture.md). 
# Fonctionnalités de l'ORM

Ce document liste les fonctionnalités actuellement implémentées dans l'ORM.

## Fonctionnalités complètement implémentées

### Core
- CRUD basique (Create, Read, Update, Delete)
- Transactions avec rollback automatique
- Timestamps automatiques (created_at, updated_at)
- Hooks de cycle de vie (BeforeCreate, AfterCreate, etc.)

### Repository
- Opérations basiques (Find, FindAll, FindBy, FindOneBy)
- Opérations batch (BatchCreate, BatchUpdate, BatchDelete)
- Soft delete avec restore
- Incrémentation/Décrémentation atomique
- Méthodes utilitaires (Count, Exists, Pluck, Value)
- Traitement par lots (Chunk, Each)

### Query Builder
- Conditions WHERE avec opérateurs standards
- Jointures (INNER, LEFT, RIGHT)
- Tri et groupement (OrderBy, GroupBy)
- Pagination simple (Limit, Offset)
- Requêtes brutes (Raw SQL)

### Dialectes
- MySQL (types et fonctions spécifiques)
- PostgreSQL (types et fonctions spécifiques)
- Mock pour les tests

## Fonctionnalités partiellement implémentées

### Relations
- One-to-One basique
- One-to-Many basique
- Pas de Many-to-Many
- Chargement avec With() mais limité

### Configuration
- Pool de connexions via database/sql
- Configuration basique des dialectes
- Pas de configuration avancée du pool

### Logging
- Logging basique des requêtes
- Pas de configuration avancée des loggers
- Pas de formatage personnalisé

## Fonctionnalités non implémentées

### Cache et Performance
- Pas de cache de requêtes
- Pas de cache de métadonnées
- Pas de pagination cursor-based
- Pas d'optimisation des requêtes N+1

### Fonctionnalités avancées
- Pas de validation intégrée
- Pas d'opérations JSON natives
- Pas de recherche full-text
- Pas de migrations complexes
- Pas de scopes globaux

--- 
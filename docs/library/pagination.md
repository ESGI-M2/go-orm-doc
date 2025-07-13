---
sidebar_position: 9
---

# Pagination & Cache

## 1. Pagination Offset

```go
page, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    OrderBy("created_at", "DESC").
    OffsetPaginate(pageIndex, pageSize)
```

*Renvoie un objet `PaginationResult` contenant `Data`, `Total`, `Page`, `PerPage`.*

## 2. Pagination Cursor

```go
nextCursor, items, err := orm.Query(&User{}).
    Where("id", ">", lastID).
    Limit(20).
    CursorPaginate("id")
```

## 3. Activer / Désactiver le Cache Global

```go
orm.EnableCache()
// …
orm.DisableCache()
```

## 4. Cache par Requête

```go
users, err := orm.Query(&User{}).
    Where("is_active", "=", true).
    Cache(300). // TTL 5 minutes
    Find()
```

## 5. Invalidation du Cache

Le cache est automatiquement invalidé après :

* INSERT / UPDATE / DELETE via Repository ou Query Builder.
* Transaction commit.

## 6. Custom Cache Adapter

```go
type CustomCache struct {
    // Implémentez votre propre système de cache
}

func (c *CustomCache) Get(key string) (interface{}, bool) { /* ... */ }
func (c *CustomCache) Set(key string, value interface{}, ttl int) { /* ... */ }
func (c *CustomCache) Invalidate(pattern string) { /* ... */ }

orm.WithCacheAdapter(&CustomCache{})
```

---

> Utilisez le cache avec précaution : invalidez lorsque vous modifiez les données pour éviter les incohérences. 
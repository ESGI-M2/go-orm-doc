---
sidebar_position: 7
sidebar_label: Cache interne
---

# Cache interne

## 1. Interface générique

```go
type Cache interface {
    Get(key string) (interface{}, bool)
    Set(key string, value interface{}, ttl int)
    Invalidate(pattern string)
}
```

## 2. Implémentation mémoire

```go
type memoryCache struct {
    mu   sync.RWMutex
    data map[string]cacheEntry
}
```

* Utilise un `time.Timer` pour nettoyage TTL.

## 3. Points d’invalidation

| Action | Invalidation |
|--------|--------------|
| INSERT/UPDATE/DELETE | Clé de table + wildcard |
| Transaction Commit | Invalidate tables touchées |

## 4. Adapter personnalisé

Possibilité d'implémenter votre propre système de cache en respectant l'interface `Cache`.

---

> Le cache améliore les performances de lecture mais doit être invalidé rigoureusement. 
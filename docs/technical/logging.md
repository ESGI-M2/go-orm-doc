---
sidebar_position: 8
sidebar_label: Logging interne
---

# Logging interne

## 1. Interface

```go
type QueryLog struct {
    SQL      string
    Args     []interface{}
    Duration time.Duration
    Time     time.Time
}
```

## 2. Pipeline

1. Avant exécution de la requête, capture `time.Now()`.  
2. Après exécution, calcule `Duration` et stocke dans un slice protégé par mutex.

## 3. Collecte & nettoyage

* `GetQueryLogs()` retourne une copie du slice.  
* `ClearQueryLogs()` réinitialise le slice.

## 4. Overhead

* Coût minime : un `append` + calcul duration.  
* Peut être désactivé en production pour éviter la contention.

--- 
---
sidebar_position: 10
---

# Journalisation & Monitoring

GO ORM peut enregistrer chaque requête SQL exécutée, son temps d'exécution ainsi que les arguments utilisés.

## 1. Activer le Query Log

```go
orm.EnableQueryLog()
```

## 2. Exécuter des requêtes

```go
_ = orm.Query(&User{}).
    Where("is_active", "=", true).
    Find()
```

## 3. Lire les logs

```go
logs := orm.GetQueryLogs()
for _, l := range logs {
    fmt.Printf("%s (%.2f ms) Args: %v\n", l.SQL, l.Duration.Seconds()*1000, l.Args)
}

// Nettoyer
orm.ClearQueryLogs()
```

## 4. Désactiver en production

```go
orm.DisableQueryLog()
```

---

> Gardez le logging activé seulement en développement ou lorsque vous diagnostiquez des problèmes de performance. 
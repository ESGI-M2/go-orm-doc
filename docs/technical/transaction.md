---
sidebar_position: 6
sidebar_label: Transactions internes
---

# Transactions internes

## 1. Interface

```go
type Transaction interface {
    Begin() (*sql.Tx, error)
    Commit() error
    Rollback() error
}
```

Cette interface est implémentée par chaque Dialect.

## 2. Contexte imbriqué

La fonction :

```go
func (o *ORM) Transaction(fn func(tx ORM) error) error
```

1. Vérifie s’il y a déjà une transaction active (stockée dans `context.Context`).  
2. Sinon démarre une nouvelle : `dialect.Begin()`.  
3. Appelle le callback avec un clone de l’ORM utilisant ce `*sql.Tx`.  
4. Commit si pas d’erreur, sinon Rollback.

## 3. Savepoints (Mock dialect)

Le Mock Dialect simule les savepoints pour tester les transactions imbriquées.

## 4. Gestion des erreurs

* `ErrNoTransaction` renvoyé si `Commit` ou `Rollback` sans `Begin`.
* `ErrTransactionClosed` si la transaction a déjà été fermée.

---

> Les transactions garantissent l’atomicité et la cohérence en production et dans les tests. 
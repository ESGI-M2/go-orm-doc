---
sidebar_position: 8
---

# Transactions

Le système de transactions de GO ORM garantit l’atomicité de vos opérations, avec une API simple et sécurisée.

## 1. Démarrer une transaction

```go
err := orm.Transaction(func(txORM interfaces.ORM) error {
    // Toutes les opérations ci-dessous seront atomiques
    repo := txORM.Repository(&User{})
    if err := repo.Save(&User{Name: "Bob"}); err != nil {
        return err // rollback automatique
    }
    return nil // commit si nil
})
```

*Si la fonction callback retourne une erreur, la transaction est annulée (rollback).*

## 2. Transactions imbriquées

```go
err := orm.Transaction(func(tx interfaces.ORM) error {
    return tx.Transaction(func(inner interfaces.ORM) error {
        // …
        return nil
    })
})
```

## 3. Gestion explicite

```go
tx, err := orm.Begin()
if err != nil { … }

// … opérations via tx.Repository()

if err := tx.Commit(); err != nil {
    _ = tx.Rollback()
}
```

## 4. Utilisation avec contexte (`context.Context`)

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
defer cancel()

err := orm.TransactionWithContext(ctx, func(tx interfaces.ORM) error {
    …
    return nil
})
```

## 5. Erreurs courantes

| Code | Symbole | Signification |
|------|---------|--------------|
| `ErrNoTransaction` | Aucune transaction active pour `Commit`/`Rollback`. |
| `ErrTransactionClosed` | Transaction déjà terminée. |

---

> Les transactions sont compatibles avec tous les dialectes implémentant l’interface `Transaction`. 
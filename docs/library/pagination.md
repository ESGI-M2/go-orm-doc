---
sidebar_position: 9
---

# Pagination

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

---

> La pagination permet de gérer efficacement de grandes quantités de données. 
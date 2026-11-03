---
id: course-registration-engine
title: Course Registration Engine
subtitle: ACID-compliant relational allocation platform with SQL-native Weighted Sum Model
description: 11-table 3NF relational schema with a SQL-native Weighted Sum Model scoring engine processing multi-factor rankings in sub-50ms with ACID isolation.
category: work
tags: [Node.js, MySQL, React.js, SQL 3NF, Express]
image: https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/course-registration-engine
liveUrlLabel: View Codebase
sourceUrl: https://github.com/AayushmanKumar/course-registration-engine
sourceUrlLabel: View Source
completedAt: 2026-04-15
duration: 4 months
---

# Course Registration Engine

End-to-end, role-based course registration and automated seat allocation platform using Node.js, Express, MySQL, and React.js to eliminate manual approval friction across dynamic academic windows.

## Schema Architecture (3NF)

- **11 Normalized Tables**: Structured in strict Third Normal Form (3NF), using shared primary keys (`user_id` as PK/FK) for 1:1 user-profile specialization.
- **Composite Unique Constraints**: Enforced data consistency to prevent duplicate requests across overlapping academic semesters.
- **Composite Indexes**: Optimized high-frequency queries with `idx_enroll_student` and `idx_transcript_student`.

## SQL-Native Priority Scoring Engine

Engineered a SQL-native Weighted Sum Model (WSM) priority scoring engine across a 5-table join:

```sql
SELECT 
  e.student_id,
  (c.w_cpi * s.cpi + 
   c.w_year * s.academic_year + 
   IF(s.department = c.department, c.w_branch, 0)) AS priority_score
FROM enrollments e
JOIN students s ON e.student_id = s.user_id
JOIN course_offerings c ON e.course_id = c.course_id
ORDER BY priority_score DESC, e.created_at ASC;
```

## Prerequisite Verification & ACID Isolation

- Decoupled transient enrollment requests from append-only transcripts using SQL anti-joins across self-referential course DAGs to prevent cyclic prerequisite dependencies.
- Guaranteed ACID transaction isolation for batch seat allocations using MySQL connection pooling with explicit rollback safeguards.
- Reduced faculty evaluation and allocation cycle times from several days to under 50ms batch execution.


# SDPD Backend Curriculum

SDPD trong fork này là phòng thực hành chẩn đoán sự cố cho backend engineer. Nó rèn cách đọc symptom, log, metric, tìm root cause và bảo vệ một giải pháp. Nó không thay thế việc viết code, đọc tài liệu chính thức, làm lab và trình bày system design.

## Phạm vi hiện tại

### Distributed systems — case 01–33

- Replication, failover, replication lag và durability.
- Consistency, consensus, clock, partition và conflict.
- Load balancing, horizontal scaling, stateless service và partitioning.
- Cache invalidation, stampede, expiry, locking và CDN.
- Message durability, duplicate delivery, backpressure và ordering.
- Sharding, CAP, checksum và write amplification.
- Timeout, retry, circuit breaker và service discovery.
- Distributed deadlock, isolation level, saga và rate limiting.

### Database Engineering — case 34–39

| Case | Chủ đề | Năng lực cần đạt |
|---|---|---|
| 34 | Normalization | Nhận ra functional dependency và update anomaly; biết khi nào cần snapshot/denormalization. |
| 35 | Composite index | Chọn thứ tự cột theo equality/range/order và đọc `EXPLAIN ANALYZE`. |
| 36 | Sargability | Nhận ra expression làm index không seek được và viết half-open range đúng timezone. |
| 37 | N+1 query | Đo query count; chọn join, eager load hoặc batch load mà không tạo cartesian explosion. |
| 38 | Connection pool | Phân biệt DB chậm với pool saturation; thu nhỏ transaction scope và đặt timeout. |
| 39 | Lost update | Biểu diễn invariant bằng atomic update hoặc optimistic concurrency. |

### Operating Systems & Concurrency — case 40–49

| Case | Chủ đề | Năng lực cần đạt |
|---|---|---|
| 40 | Process isolation | Phân biệt process/thread, failure boundary, supervisor và IPC. |
| 41 | Race condition | Giải thích interleaving, atomicity, critical section và memory visibility. |
| 42 | Thread deadlock | Nhận ra circular wait từ thread dump và áp dụng lock ordering. |
| 43 | Python GIL | Chọn thread cho I/O-bound và process/native code cho CPU-bound dựa trên đo đạc. |
| 44 | Multiprocessing | Tính serialization/IPC overhead, task granularity và data movement. |
| 45 | Async event loop | Phát hiện blocking call, event-loop lag và bounded offloading trong FastAPI. |
| 46 | Memory leak | Phân biệt allocation cao với retained reference; đọc heap/RSS. |
| 47 | Virtual memory | Hiểu working set, page fault, swap và thrashing. |
| 48 | File descriptor | Quản lý lifecycle của file/socket và điều tra `EMFILE`. |
| 49 | CPU scheduling | Phân biệt concurrency/parallelism, CPU quota và context-switch overhead. |

### Backend Reliability & Security — case 50–58

| Case | Chủ đề | Năng lực cần đạt |
|---|---|---|
| 50 | Transactional outbox | Đóng dual-write gap và nêu được relay/duplicate/ordering trade-off. |
| 51 | Kafka offset | Phân biệt offset progress với business completion; thiết kế idempotent consumer/inbox. |
| 52 | Kafka rebalance | Điều tra `max.poll.interval.ms`, slow record và cooperative rebalance. |
| 53 | Redis hot key | Đọc shard skew; chọn near-cache, coalescing, replication hoặc split value. |
| 54 | SQL injection | Parameterize value, allowlist identifier và giữ tenant authorization. |
| 55 | SSRF | Validate từng network hop và kết hợp application rule với egress control. |
| 56 | AuthN/AuthZ | Phân biệt identity với object-level permission; test cross-tenant access. |
| 57 | API idempotency | Thiết kế key scope, request fingerprint, retention và concurrent replay. |
| 58 | Overload | Dùng admission control, bounded queue, deadline, load shedding và retry budget. |

## Definition of Done cho một case

Một case chỉ được coi là hoàn thành ở mức phỏng vấn khi người học làm đủ:

1. Chọn root cause và chỉ ra ít nhất hai bằng chứng từ log, metric hoặc state.
2. Giải thích vì sao hai phương án khác không khớp bằng chứng.
3. Nêu cách sửa, transaction/failure boundary và một trade-off.
4. Trả lời câu hỏi “nếu cách sửa này thất bại thì sao?”.
5. Với chủ đề quan trọng, làm một lab nhỏ hoặc tìm bằng chứng tương tự trong production code.

## Các lớp kỹ năng ngoài SDPD

Một software engineer vững cần thêm những hoạt động mà game chẩn đoán không thể thay thế:

- DSA và viết code không có autocomplete trong mock interview.
- Thiết kế API/data model từ requirement mơ hồ.
- Testing: unit, integration, contract, load và failure injection.
- Git, code review, refactoring và đọc codebase có sẵn.
- Linux/container/network commands và quan sát hệ thống thật.
- Security review, dependency/secret management và threat modeling.
- Cloud/CI/CD/IaC cùng cost, rollback và operational ownership.
- Giao tiếp: làm rõ requirement, viết design note, postmortem và bảo vệ trade-off.

Các chủ đề này nên được luyện bằng System Builder, Chaos Simulator, Mock Interview và lab code; không nên biến tất cả thành multiple-choice case.

## Cách thêm case tiếp theo

Nguồn sinh case 34–58 nằm tại `scripts/generate-backend-curriculum.mjs`.

```bash
npm run generate:curriculum
npm test
npm run build
```

Case mới cần có symptom quan sát được, bằng chứng đủ phân biệt cause/consequence, đúng một root cause, đúng một production-safe fix, và trade-off cụ thể. Không dùng tên, dữ liệu hoặc chi tiết nội bộ của công ty.

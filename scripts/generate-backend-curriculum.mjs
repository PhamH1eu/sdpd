import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const casesDir = path.join(root, 'src', 'data', 'cases');
const viCasesDir = path.join(casesDir, 'vi');
mkdirSync(viCasesDir, { recursive: true });

const specs = [
  {
    n: 34, id: 'database-normalization', icon: '🧩', resource: 'Order Database',
    en: ['The Repeating Customer', 'One address change corrupts hundreds of orders', 'Customer name, phone, and address are copied into every order row. Updating a customer touches hundreds of rows; a partial failure leaves conflicting profiles.', 'Duplicate customer attributes created an update anomaly in a denormalized transactional table.', 'Separate Customer and Order entities, reference customer_id, and use an explicit immutable shipping snapshot only where history requires it.', 'Normalization removes redundant facts and prevents insert, update, and delete anomalies. Denormalize only for a measured read path and define synchronization ownership.'],
    vi: ['Khách hàng bị nhân bản', 'Một lần đổi địa chỉ làm lệch hàng trăm đơn hàng', 'Tên, số điện thoại và địa chỉ khách hàng bị chép vào mọi dòng order. Một lần cập nhật phải sửa hàng trăm dòng; lỗi giữa chừng tạo ra nhiều hồ sơ mâu thuẫn.', 'Thuộc tính khách hàng bị lặp đã tạo update anomaly trong bảng giao dịch denormalized.', 'Tách Customer và Order, tham chiếu bằng customer_id; chỉ lưu shipping snapshot bất biến khi nghiệp vụ cần lịch sử.', 'Normalization loại bỏ dữ liệu lặp và tránh insert, update, delete anomaly. Chỉ denormalize cho read path đã đo được và phải xác định rõ bên chịu trách nhiệm đồng bộ.'],
    terms: [['Normalization', 'Organize facts so each fact has one authoritative place.'], ['Functional dependency', 'A relationship where one attribute determines another.'], ['Update anomaly', 'Conflicting copies created when a repeated fact is only partly updated.'], ['Denormalization', 'Intentional duplication for a measured read benefit.']],
    viTerms: [['Normalization', 'Tổ chức dữ liệu để mỗi fact có một nơi authoritative.'], ['Functional dependency', 'Quan hệ trong đó một thuộc tính xác định thuộc tính khác.'], ['Update anomaly', 'Các bản sao mâu thuẫn do chỉ cập nhật một phần dữ liệu lặp.'], ['Denormalization', 'Chủ động lặp dữ liệu để tối ưu read path đã được đo.']],
  },
  {
    n: 35, id: 'composite-index-design', icon: '🗂️', resource: 'PostgreSQL',
    en: ['The Ignored Index', 'A composite index exists, yet the query scans millions of rows', 'The table has an index on (tenant_id, status, created_at). A query filters status and created_at but omits tenant_id, so PostgreSQL chooses a sequential scan.', 'The query does not use the leftmost prefix of the composite B-tree index.', 'Design an index whose leading columns match equality predicates, then range/order predicates; verify with EXPLAIN ANALYZE instead of guessing.', 'Composite index order follows access patterns. Indexes cost memory and write I/O, so validate selectivity and remove redundant indexes.'],
    vi: ['Index bị bỏ quên', 'Đã có composite index nhưng query vẫn scan hàng triệu dòng', 'Bảng có index (tenant_id, status, created_at). Query lọc status và created_at nhưng thiếu tenant_id nên PostgreSQL chọn sequential scan.', 'Query không sử dụng leftmost prefix của composite B-tree index.', 'Thiết kế index với các cột equality ở đầu, sau đó là range/order; kiểm chứng bằng EXPLAIN ANALYZE thay vì đoán.', 'Thứ tự composite index phải đi theo access pattern. Index làm tốn memory và write I/O nên cần đo selectivity và loại index thừa.'],
    terms: [['Composite index', 'An index over multiple ordered columns.'], ['Leftmost prefix', 'The leading column sequence a B-tree can efficiently search.'], ['Selectivity', 'How strongly a predicate narrows the result set.'], ['EXPLAIN ANALYZE', 'The actual execution plan and runtime measurements.']],
    viTerms: [['Composite index', 'Index gồm nhiều cột có thứ tự.'], ['Leftmost prefix', 'Chuỗi cột đầu tiên mà B-tree có thể tìm hiệu quả.'], ['Selectivity', 'Mức độ predicate thu hẹp tập kết quả.'], ['EXPLAIN ANALYZE', 'Execution plan thực tế cùng số liệu runtime.']],
  },
  {
    n: 36, id: 'sargable-queries', icon: '🔎', resource: 'Query Planner',
    en: ['The Function Wrapped Column', 'A harmless date conversion defeats the index', 'A report uses DATE(created_at) = :day on a 90-million-row table. The function is evaluated for every row and the normal created_at index cannot seek the range.', 'Applying a function to the indexed column made the predicate non-sargable.', 'Rewrite as created_at >= start AND created_at < next_day, or add a justified expression index.', 'Sargable predicates let the planner navigate an index. Compare plans and preserve timezone semantics when rewriting date ranges.'],
    vi: ['Cột bị bọc bởi function', 'Một phép đổi ngày vô hiệu hóa index', 'Report dùng DATE(created_at) = :day trên bảng 90 triệu dòng. Function chạy cho từng dòng và index created_at thông thường không thể seek theo range.', 'Bọc indexed column trong function khiến predicate trở thành non-sargable.', 'Viết lại thành created_at >= start AND created_at < next_day, hoặc tạo expression index khi có lý do rõ ràng.', 'Sargable predicate cho phép planner đi thẳng vào index. Khi đổi sang date range phải so sánh execution plan và giữ đúng timezone semantics.'],
    terms: [['Sargable', 'A predicate an index can search directly.'], ['Sequential scan', 'Reading most or all table pages.'], ['Expression index', 'An index on a computed expression.'], ['Half-open range', 'A range including its start and excluding its end.']],
    viTerms: [['Sargable', 'Predicate mà index có thể tìm trực tiếp.'], ['Sequential scan', 'Đọc phần lớn hoặc toàn bộ page của bảng.'], ['Expression index', 'Index được tạo trên một biểu thức.'], ['Half-open range', 'Range bao gồm điểm đầu và loại điểm cuối.']],
  },
  {
    n: 37, id: 'n-plus-one-queries', icon: '📡', resource: 'FastAPI Service',
    en: ['The Thousand Tiny Queries', 'The endpoint is fast locally and collapses in production', 'Listing 500 orders issues one query for orders and one lazy-loaded customer query per order. Database CPU is moderate, but network round trips dominate latency.', 'ORM lazy loading produced an N+1 query pattern.', 'Fetch related rows in a bounded join/batch, select only required fields, and verify query count in tests or tracing.', 'N+1 is a latency and connection-pool problem. Eager loading is not universally correct; bound result size and avoid cartesian explosions.'],
    vi: ['Một nghìn query nhỏ', 'Endpoint chạy nhanh ở local nhưng sụp ở production', 'Danh sách 500 order chạy một query lấy order rồi lazy-load thêm một query customer cho từng order. CPU database chưa cao nhưng network round trip chiếm gần hết latency.', 'ORM lazy loading tạo ra N+1 query pattern.', 'Lấy relation bằng join/batch có giới hạn, chỉ select field cần thiết và kiểm tra query count bằng test hoặc tracing.', 'N+1 gây vấn đề latency và connection pool. Eager loading không phải lúc nào cũng đúng; phải giới hạn result và tránh cartesian explosion.'],
    terms: [['N+1 query', 'One parent query followed by one child query per row.'], ['Lazy loading', 'Loading related data only when accessed.'], ['Eager loading', 'Fetching known related data in advance.'], ['Batch loading', 'Fetching many related records in one bounded query.']],
    viTerms: [['N+1 query', 'Một query cha rồi thêm một query con cho mỗi dòng.'], ['Lazy loading', 'Chỉ tải relation khi code truy cập.'], ['Eager loading', 'Tải trước relation đã biết sẽ cần.'], ['Batch loading', 'Lấy nhiều record liên quan bằng một query có giới hạn.']],
  },
  {
    n: 38, id: 'connection-pool-exhaustion', icon: '🏊', resource: 'DB Connection Pool',
    en: ['The Empty Connection Pool', 'Requests wait although the database has spare CPU', 'A slow external HTTP call is made while a database transaction remains open. All 30 pool connections become checked out and new requests time out waiting for a connection.', 'Transactions hold pooled connections across unrelated network I/O.', 'Keep transactions short, release connections before external calls, set pool/statement timeouts, and size the pool against database capacity.', 'A larger pool can overload the database. Measure checkout time, transaction age, active/idle connections, and slow statements.'],
    vi: ['Connection pool trống rỗng', 'Request phải chờ dù database vẫn còn CPU', 'Một external HTTP call chậm được gọi khi database transaction vẫn mở. Cả 30 connection đều bị checkout và request mới timeout khi chờ connection.', 'Transaction giữ connection trong pool qua một đoạn network I/O không liên quan.', 'Giữ transaction ngắn, trả connection trước external call, đặt pool/statement timeout và tính pool size theo capacity của database.', 'Tăng pool vô hạn có thể làm database quá tải. Cần đo checkout time, transaction age, active/idle connection và slow statement.'],
    terms: [['Connection pool', 'A bounded set of reusable database connections.'], ['Checkout time', 'Time spent waiting to borrow a connection.'], ['Transaction scope', 'The exact work protected by a transaction.'], ['Pool saturation', 'All connections are busy or leaked.']],
    viTerms: [['Connection pool', 'Tập connection database có giới hạn và được tái sử dụng.'], ['Checkout time', 'Thời gian chờ mượn một connection.'], ['Transaction scope', 'Phần công việc chính xác được transaction bảo vệ.'], ['Pool saturation', 'Mọi connection đều đang bận hoặc bị leak.']],
  },
  {
    n: 39, id: 'lost-update', icon: '🔄', resource: 'Inventory Database',
    en: ['The Vanishing Update', 'Two valid writes leave the wrong stock count', 'Two workers read stock=10, independently subtract 3 and 4, then write 7 and 6. The final value is 6 although seven units were sold.', 'A read-modify-write race caused a lost update.', 'Use an atomic conditional UPDATE or optimistic version check; retry conflicts and enforce the invariant in the database.', 'Transactions alone do not prevent lost updates at every isolation level. Express invariants atomically and make retries safe.'],
    vi: ['Update biến mất', 'Hai lần ghi hợp lệ tạo ra tồn kho sai', 'Hai worker cùng đọc stock=10, độc lập trừ 3 và 4 rồi ghi 7 và 6. Giá trị cuối là 6 dù đã bán tổng cộng 7 sản phẩm.', 'Race trong chuỗi read-modify-write gây lost update.', 'Dùng atomic conditional UPDATE hoặc optimistic version check; retry conflict và enforce invariant tại database.', 'Chỉ mở transaction chưa chắc ngăn lost update ở mọi isolation level. Hãy biểu diễn invariant bằng thao tác atomic và làm retry an toàn.'],
    terms: [['Lost update', 'One concurrent write silently overwrites another.'], ['Optimistic concurrency', 'Detect conflicts with a version and retry.'], ['Atomic update', 'A read and write performed as one indivisible database operation.'], ['Invariant', 'A condition that must remain true for valid data.']],
    viTerms: [['Lost update', 'Một concurrent write âm thầm ghi đè write khác.'], ['Optimistic concurrency', 'Phát hiện conflict bằng version rồi retry.'], ['Atomic update', 'Read và write được database thực hiện như một thao tác không thể chia nhỏ.'], ['Invariant', 'Điều kiện luôn phải đúng để dữ liệu hợp lệ.']],
  },
  {
    n: 40, id: 'process-isolation', icon: '🧱', resource: 'Worker Process',
    en: ['The Crash That Stayed Contained', 'One worker dies while its siblings keep serving', 'A native library segfault kills one worker process. Other workers continue because each process has its own virtual address space and OS-managed resources.', 'The failure boundary is a process, not a thread; memory is isolated between processes.', 'Run unsafe or CPU-heavy work in supervised worker processes and define IPC, restart, timeout, and idempotency behavior.', 'Processes provide isolation at higher memory and communication cost. Threads share memory and fail together inside one process.'],
    vi: ['Crash được cô lập', 'Một worker chết nhưng các worker khác vẫn phục vụ', 'Native library gây segmentation fault và giết một worker process. Worker khác vẫn chạy vì mỗi process có virtual address space và resource riêng do OS quản lý.', 'Failure boundary là process chứ không phải thread; memory được cô lập giữa các process.', 'Chạy công việc không an toàn hoặc CPU-bound trong worker process được supervisor quản lý; thiết kế IPC, restart, timeout và idempotency.', 'Process cho isolation tốt hơn nhưng tốn memory và communication. Thread chia sẻ memory và cùng chết khi process sập.'],
    terms: [['Process', 'An OS isolation unit with its own virtual address space.'], ['Thread', 'An execution unit sharing its process memory.'], ['IPC', 'Inter-process communication.'], ['Supervisor', 'A parent that monitors and restarts workers.']],
    viTerms: [['Process', 'Đơn vị isolation của OS với virtual address space riêng.'], ['Thread', 'Đơn vị thực thi chia sẻ memory của process.'], ['IPC', 'Cơ chế giao tiếp giữa các process.'], ['Supervisor', 'Tiến trình cha theo dõi và restart worker.']],
  },
  {
    n: 41, id: 'thread-race-condition', icon: '🏁', resource: 'Shared Counter',
    en: ['The Counter That Lost Requests', 'A million increments produce a smaller number', 'Multiple threads execute read-increment-write on shared state without synchronization. Interleavings cause increments to overwrite each other.', 'A data race on a non-atomic shared counter caused lost increments.', 'Use an atomic primitive or lock around the minimal critical section, or remove shared mutable state through partitioning/message passing.', 'Correctness depends on all possible interleavings, not the one seen in a local test. Locks add contention and require disciplined scope.'],
    vi: ['Counter làm mất request', 'Một triệu lần increment cho ra con số nhỏ hơn', 'Nhiều thread chạy read-increment-write trên shared state mà không synchronization. Các interleaving khiến increment ghi đè nhau.', 'Data race trên shared counter không atomic làm mất increment.', 'Dùng atomic primitive hoặc lock quanh critical section nhỏ nhất; hoặc loại shared mutable state bằng partitioning/message passing.', 'Correctness phụ thuộc mọi interleaving có thể xảy ra, không chỉ lần chạy local. Lock tạo contention và cần scope chặt chẽ.'],
    terms: [['Race condition', 'Correctness depends on nondeterministic execution order.'], ['Atomicity', 'An operation appears indivisible to other threads.'], ['Critical section', 'Code that accesses shared mutable state.'], ['Memory visibility', 'Whether one thread sees another thread’s writes.']],
    viTerms: [['Race condition', 'Correctness phụ thuộc thứ tự thực thi không xác định.'], ['Atomicity', 'Operation trông như không thể chia nhỏ đối với thread khác.'], ['Critical section', 'Đoạn code truy cập shared mutable state.'], ['Memory visibility', 'Một thread có nhìn thấy write của thread khác hay không.']],
  },
  {
    n: 42, id: 'thread-deadlock', icon: '🔒', resource: 'Thread Pool',
    en: ['The Local Deadlock', 'Two threads wait forever with zero CPU', 'Thread A locks account 1 then waits for account 2. Thread B locks account 2 then waits for account 1. Both block forever.', 'Opposite lock ordering created a circular wait.', 'Define a global lock order, acquire in that order, keep lock scope small, and use timeouts only as a recovery safety net.', 'Deadlock requires mutual exclusion, hold-and-wait, no preemption, and circular wait. Break at least one condition by design.'],
    vi: ['Deadlock trong một process', 'Hai thread chờ mãi trong khi CPU bằng không', 'Thread A lock account 1 rồi chờ account 2. Thread B lock account 2 rồi chờ account 1. Cả hai block vô hạn.', 'Thứ tự lấy lock ngược nhau tạo circular wait.', 'Định nghĩa global lock order, luôn acquire theo thứ tự đó, thu nhỏ lock scope; timeout chỉ là safety net để recovery.', 'Deadlock cần mutual exclusion, hold-and-wait, no preemption và circular wait. Thiết kế phải phá ít nhất một điều kiện.'],
    terms: [['Deadlock', 'Participants wait forever in a dependency cycle.'], ['Lock ordering', 'A global order for acquiring multiple locks.'], ['Liveness', 'The system continues making progress.'], ['Thread dump', 'A snapshot of thread states and lock waits.']],
    viTerms: [['Deadlock', 'Các thành phần chờ nhau vô hạn theo một vòng phụ thuộc.'], ['Lock ordering', 'Thứ tự toàn cục khi acquire nhiều lock.'], ['Liveness', 'Hệ thống tiếp tục tạo tiến triển.'], ['Thread dump', 'Snapshot trạng thái thread và lock đang chờ.']],
  },
  {
    n: 43, id: 'python-gil-cpu-bound', icon: '🐍', resource: 'Python Runtime',
    en: ['The Busy Thread Pool', 'More Python threads do not speed up image hashing', 'Eight threads run pure-Python CPU work. All cores except one remain mostly idle while context switches increase.', 'CPython’s GIL serializes execution of Python bytecode for CPU-bound threads.', 'Use multiprocessing, a native library that releases the GIL, or a separate compute service; benchmark serialization and memory costs.', 'Threads are effective for blocking I/O. For CPU-bound Python code, measure whether the workload releases the GIL before choosing concurrency.'],
    vi: ['Thread pool bận rộn', 'Thêm Python thread không làm image hashing nhanh hơn', 'Tám thread chạy pure-Python CPU work. Hầu hết core vẫn rảnh trong khi context switch tăng.', 'GIL của CPython tuần tự hóa việc chạy Python bytecode giữa các CPU-bound thread.', 'Dùng multiprocessing, native library có release GIL hoặc compute service riêng; benchmark serialization và memory cost.', 'Thread phù hợp blocking I/O. Với CPU-bound Python, cần đo workload có release GIL hay không trước khi chọn concurrency model.'],
    terms: [['GIL', 'The CPython lock allowing one thread to execute Python bytecode at a time.'], ['CPU-bound', 'Limited mainly by computation.'], ['I/O-bound', 'Limited mainly by waiting for external I/O.'], ['Native extension', 'Compiled code that may release the GIL.']],
    viTerms: [['GIL', 'Lock trong CPython chỉ cho một thread chạy Python bytecode tại một thời điểm.'], ['CPU-bound', 'Bị giới hạn chủ yếu bởi computation.'], ['I/O-bound', 'Bị giới hạn chủ yếu bởi thời gian chờ I/O.'], ['Native extension', 'Code đã compile và có thể release GIL.']],
  },
  {
    n: 44, id: 'multiprocessing-overhead', icon: '📦', resource: 'Process Pool',
    en: ['The Slower Process Pool', 'Parallel work is slower than one process', 'Tiny tasks send 20 MB Python objects to worker processes. Pickling, copying, and IPC cost more than the computation itself.', 'Task granularity is too small relative to multiprocessing serialization and IPC overhead.', 'Batch work into larger chunks, send compact identifiers, use shared memory only with clear ownership, and benchmark end to end.', 'Multiprocessing bypasses the GIL but does not make communication free. Minimize data movement and bound worker count.'],
    vi: ['Process pool chậm hơn', 'Chạy parallel lại chậm hơn một process', 'Các task rất nhỏ gửi Python object 20 MB sang worker process. Pickle, copy và IPC tốn thời gian hơn computation.', 'Task granularity quá nhỏ so với serialization và IPC overhead của multiprocessing.', 'Gộp việc thành chunk lớn hơn, chỉ gửi identifier gọn, dùng shared memory khi ownership rõ ràng và benchmark end-to-end.', 'Multiprocessing vượt qua GIL nhưng communication không miễn phí. Cần giảm data movement và giới hạn worker count.'],
    terms: [['Serialization', 'Encoding data for transfer across a boundary.'], ['Pickle', 'Python object serialization format.'], ['Task granularity', 'Amount of useful work per scheduled task.'], ['Shared memory', 'Memory explicitly accessible by multiple processes.']],
    viTerms: [['Serialization', 'Encode dữ liệu để truyền qua một boundary.'], ['Pickle', 'Định dạng serialization object của Python.'], ['Task granularity', 'Lượng công việc hữu ích trong mỗi task được schedule.'], ['Shared memory', 'Vùng memory nhiều process cùng truy cập có chủ đích.']],
  },
  {
    n: 45, id: 'blocking-event-loop', icon: '⏳', resource: 'FastAPI Event Loop',
    en: ['The Frozen Event Loop', 'One innocent call stalls every async request', 'An async FastAPI handler calls a synchronous SDK that blocks for three seconds. Event-loop lag rises and unrelated requests stop progressing.', 'Blocking I/O ran directly on the event-loop thread.', 'Use an async client, move blocking calls to a bounded thread pool, set timeouts, and monitor event-loop lag.', 'async improves concurrency only when tasks yield. Unbounded offloading can merely move saturation to a thread pool.'],
    vi: ['Event loop bị đóng băng', 'Một lời gọi tưởng vô hại làm mọi async request đứng lại', 'Async handler của FastAPI gọi synchronous SDK block ba giây. Event-loop lag tăng và request không liên quan cũng không tiến triển.', 'Blocking I/O chạy trực tiếp trên event-loop thread.', 'Dùng async client, chuyển blocking call sang bounded thread pool, đặt timeout và theo dõi event-loop lag.', 'async chỉ tăng concurrency khi task chịu yield. Offload không giới hạn chỉ chuyển saturation sang thread pool.'],
    terms: [['Event loop', 'A scheduler that advances non-blocking tasks cooperatively.'], ['Cooperative scheduling', 'Tasks must yield so others can run.'], ['Event-loop lag', 'Delay between scheduled and actual loop execution.'], ['Offloading', 'Moving blocking work to another executor.']],
    viTerms: [['Event loop', 'Scheduler thúc đẩy các non-blocking task theo cơ chế cooperative.'], ['Cooperative scheduling', 'Task phải yield để task khác chạy.'], ['Event-loop lag', 'Độ trễ giữa lúc được schedule và lúc loop thực thi.'], ['Offloading', 'Chuyển blocking work sang executor khác.']],
  },
  {
    n: 46, id: 'memory-leak', icon: '🪣', resource: 'Application Heap',
    en: ['The Growing Heap', 'Memory rises after every request and never returns', 'A global dictionary stores request objects by trace ID with no eviction. Garbage collection cannot reclaim objects that remain reachable.', 'An unbounded retained-reference cache caused a memory leak.', 'Bound the cache with size/TTL, remove entries at lifecycle completion, and compare heap profiles by retained path.', 'A leak is about unintended reachability, not merely high allocation. RSS may also stay high because allocators retain arenas.'],
    vi: ['Heap cứ lớn dần', 'Memory tăng sau mỗi request và không bao giờ giảm', 'Global dictionary lưu request object theo trace ID mà không eviction. Garbage collector không thể reclaim object vẫn còn reachable.', 'Cache chứa reference không giới hạn gây memory leak.', 'Giới hạn cache bằng size/TTL, xóa entry khi lifecycle kết thúc và so sánh heap profile theo retained path.', 'Memory leak liên quan đến reachability ngoài ý muốn, không chỉ allocation cao. RSS cũng có thể giữ cao vì allocator giữ arena.'],
    terms: [['Reachability', 'Whether a live reference path still points to an object.'], ['Heap profile', 'A view of allocations and retained objects.'], ['RSS', 'Resident memory pages currently held by a process.'], ['Eviction', 'Removing entries under a bounded policy.']],
    viTerms: [['Reachability', 'Có còn reference path sống trỏ đến object hay không.'], ['Heap profile', 'Thông tin allocation và object còn được giữ.'], ['RSS', 'Các memory page đang resident trong process.'], ['Eviction', 'Loại entry theo policy có giới hạn.']],
  },
  {
    n: 47, id: 'virtual-memory-thrashing', icon: '💾', resource: 'Linux Host',
    en: ['The Thrashing Host', 'CPU is low while latency explodes and disk stays busy', 'Working sets exceed RAM. Major page faults and swap I/O surge, so processes spend more time moving pages than executing.', 'Memory pressure caused virtual-memory thrashing.', 'Reduce working sets, cap concurrency/cache memory, add RAM only after measurement, and alert on major faults and swap activity.', 'Virtual memory makes address space flexible, but disk is orders of magnitude slower than RAM. More concurrent work can reduce throughput.'],
    vi: ['Host bị thrashing', 'CPU thấp nhưng latency bùng nổ và disk luôn bận', 'Working set vượt quá RAM. Major page fault và swap I/O tăng mạnh, process dành nhiều thời gian chuyển page hơn thực thi.', 'Memory pressure gây virtual-memory thrashing.', 'Giảm working set, giới hạn concurrency/cache memory, chỉ thêm RAM sau khi đo và alert theo major fault cùng swap activity.', 'Virtual memory giúp address space linh hoạt nhưng disk chậm hơn RAM nhiều bậc. Tăng concurrent work có thể làm throughput giảm.'],
    terms: [['Virtual memory', 'Per-process address spaces mapped to physical memory or storage.'], ['Page fault', 'Access requiring the OS to map or load a page.'], ['Working set', 'Pages actively needed by a workload.'], ['Thrashing', 'Excessive paging that prevents useful progress.']],
    viTerms: [['Virtual memory', 'Address space của từng process được map vào physical memory hoặc storage.'], ['Page fault', 'Lần truy cập buộc OS phải map hoặc load một page.'], ['Working set', 'Nhóm page workload đang cần dùng.'], ['Thrashing', 'Paging quá mức làm hệ thống gần như không làm được việc hữu ích.']],
  },
  {
    n: 48, id: 'file-descriptor-exhaustion', icon: '📂', resource: 'Linux File Table',
    en: ['Too Many Open Files', 'Healthy dependencies become unreachable after hours', 'HTTP responses are not closed on an error path. Open socket descriptors climb until accept/connect fail with EMFILE.', 'A socket/file-descriptor leak exhausted the per-process limit.', 'Close resources with context managers/finally, reuse bounded client pools, expose descriptor metrics, and keep a deliberate ulimit.', 'Files, sockets, pipes, and epoll handles consume descriptors. Raising the limit hides a leak and delays failure.'],
    vi: ['Quá nhiều file đang mở', 'Dependency khỏe nhưng không truy cập được sau vài giờ', 'HTTP response không được close trên error path. Số socket descriptor tăng đến khi accept/connect lỗi EMFILE.', 'Socket/file-descriptor leak làm cạn per-process limit.', 'Đóng resource bằng context manager/finally, tái sử dụng bounded client pool, expose descriptor metric và đặt ulimit có chủ đích.', 'File, socket, pipe và epoll handle đều dùng descriptor. Chỉ tăng limit sẽ che leak và trì hoãn failure.'],
    terms: [['File descriptor', 'A process handle for a file, socket, pipe, or kernel object.'], ['EMFILE', 'The process has reached its open-file limit.'], ['Resource lifecycle', 'Acquire, use, and reliably release a resource.'], ['ulimit', 'A shell view/control of process resource limits.']],
    viTerms: [['File descriptor', 'Handle của process tới file, socket, pipe hoặc kernel object.'], ['EMFILE', 'Process đã chạm open-file limit.'], ['Resource lifecycle', 'Acquire, sử dụng và release resource một cách chắc chắn.'], ['ulimit', 'Cách xem/đặt resource limit của process.']],
  },
  {
    n: 49, id: 'scheduler-oversubscription', icon: '🧮', resource: 'CPU Scheduler',
    en: ['The Context Switch Tax', 'More workers reduce throughput', 'A four-core container runs 200 CPU-bound workers. Run queues and context switches soar, caches churn, and throughput falls.', 'CPU oversubscription created scheduling and cache-locality overhead.', 'Size CPU-bound workers near the effective CPU quota, batch work, and measure run queue, throttling, switches, and throughput.', 'Concurrency is not parallelism. Worker count should follow workload type, CPU quota, blocking ratio, and memory constraints.'],
    vi: ['Thuế context switch', 'Thêm worker lại làm throughput giảm', 'Container bốn core chạy 200 CPU-bound worker. Run queue và context switch tăng vọt, CPU cache liên tục mất locality và throughput giảm.', 'CPU oversubscription tạo scheduling overhead và phá cache locality.', 'Đặt số CPU-bound worker gần effective CPU quota, batch work và đo run queue, throttling, context switch, throughput.', 'Concurrency khác parallelism. Worker count phụ thuộc workload, CPU quota, blocking ratio và memory constraint.'],
    terms: [['Context switch', 'Saving one execution context and restoring another.'], ['Oversubscription', 'More runnable work than available execution capacity.'], ['CPU quota', 'The CPU time a container may consume.'], ['Cache locality', 'Reusing data already close to a CPU core.']],
    viTerms: [['Context switch', 'Lưu execution context hiện tại và khôi phục context khác.'], ['Oversubscription', 'Runnable work nhiều hơn execution capacity.'], ['CPU quota', 'Lượng CPU time container được phép dùng.'], ['Cache locality', 'Tái sử dụng dữ liệu đang ở gần CPU core.']],
  },
  {
    n: 50, id: 'transactional-outbox', icon: '📬', resource: 'Order Service',
    en: ['The Missing Order Event', 'The database commits but Kafka never hears about it', 'The service commits an order, then crashes before publishing OrderCreated. Retrying cannot infer whether publication happened.', 'A dual write to the database and broker was not atomic.', 'Write the business row and outbox row in one database transaction, relay with retries, and make consumers idempotent.', 'The outbox closes the atomicity gap but adds relay lag, cleanup, ordering decisions, and duplicate delivery.'],
    vi: ['Order event bị thất lạc', 'Database đã commit nhưng Kafka không nhận được gì', 'Service commit order rồi crash trước khi publish OrderCreated. Khi retry không thể biết event đã được publish hay chưa.', 'Dual write vào database và broker không atomic.', 'Ghi business row và outbox row trong cùng database transaction, relay có retry và consumer phải idempotent.', 'Outbox đóng atomicity gap nhưng tạo relay lag, cleanup, ordering decision và duplicate delivery.'],
    terms: [['Dual write', 'One logical action written to two independent systems.'], ['Transactional outbox', 'Events stored atomically beside business data.'], ['Relay', 'A process that publishes pending outbox rows.'], ['Idempotent consumer', 'A consumer safe under duplicate delivery.']],
    viTerms: [['Dual write', 'Một logical action được ghi vào hai hệ thống độc lập.'], ['Transactional outbox', 'Event được lưu atomic cùng business data.'], ['Relay', 'Process publish các outbox row đang chờ.'], ['Idempotent consumer', 'Consumer an toàn khi nhận duplicate delivery.']],
  },
  {
    n: 51, id: 'kafka-offset-commit', icon: '📍', resource: 'Kafka Consumer',
    en: ['The Message That Returned', 'A completed payment is processed twice after a crash', 'The consumer writes the payment result, crashes before committing the offset, then receives the same record after restart.', 'At-least-once delivery replayed a record whose side effect was already committed.', 'Use an idempotency/inbox key in the same transaction as the side effect, then commit offsets; choose Kafka transactions only when their boundary fits.', 'Offset commit records progress, not business completion. Exactly-once claims are bounded by the systems participating in the transaction.'],
    vi: ['Message quay trở lại', 'Payment đã hoàn thành nhưng bị xử lý lần hai sau crash', 'Consumer ghi payment result rồi crash trước khi commit offset. Sau restart, nó nhận lại đúng record đó.', 'At-least-once delivery replay record có side effect đã commit.', 'Dùng idempotency/inbox key trong cùng transaction với side effect rồi commit offset; chỉ chọn Kafka transaction khi transaction boundary phù hợp.', 'Offset commit ghi nhận tiến độ đọc, không chứng minh business completion. Cam kết exactly-once luôn bị giới hạn bởi các hệ thống cùng tham gia transaction.'],
    terms: [['Offset', 'A record position within a Kafka partition.'], ['At-least-once', 'Records may be delivered more than once but should not be lost.'], ['Inbox pattern', 'Persist processed event IDs with the side effect.'], ['Exactly-once boundary', 'The precise resources covered by an atomic guarantee.']],
    viTerms: [['Offset', 'Vị trí record trong một Kafka partition.'], ['At-least-once', 'Record có thể được deliver nhiều lần nhưng không nên bị mất.'], ['Inbox pattern', 'Lưu processed event ID cùng side effect.'], ['Exactly-once boundary', 'Các resource chính xác nằm trong atomic guarantee.']],
  },
  {
    n: 52, id: 'kafka-consumer-rebalance', icon: '🔀', resource: 'Consumer Group',
    en: ['The Rebalance Loop', 'Consumers repeatedly lose partitions and make no progress', 'A handler takes longer than max.poll.interval.ms. The coordinator removes it, reassigns partitions, and the next consumer repeats the same slow work.', 'Processing exceeded the poll interval and triggered repeated consumer-group rebalances.', 'Reduce/bound processing, tune poll records and interval from measured worst cases, use cooperative rebalancing, and isolate poison or slow records.', 'Rebalance safety requires pausing intake, finishing or cancelling work, and committing only completed offsets. Tuning one timeout cannot fix unbounded work.'],
    vi: ['Vòng lặp rebalance', 'Consumer liên tục mất partition và không tạo tiến triển', 'Handler chạy lâu hơn max.poll.interval.ms. Coordinator loại consumer, gán lại partition và consumer tiếp theo lặp lại công việc chậm đó.', 'Processing vượt poll interval và kích hoạt consumer-group rebalance liên tục.', 'Giảm/giới hạn processing, tune poll records và interval từ worst case đã đo, dùng cooperative rebalancing và cô lập poison/slow record.', 'Rebalance an toàn cần pause intake, finish hoặc cancel work, và chỉ commit offset đã hoàn tất. Tune một timeout không sửa được unbounded work.'],
    terms: [['Consumer group', 'Consumers sharing partitions of a topic.'], ['Rebalance', 'Partition ownership redistribution.'], ['max.poll.interval.ms', 'Maximum allowed time between poll calls.'], ['Cooperative rebalancing', 'Incremental partition movement that reduces stop-the-world churn.']],
    viTerms: [['Consumer group', 'Các consumer chia nhau partition của topic.'], ['Rebalance', 'Phân phối lại ownership của partition.'], ['max.poll.interval.ms', 'Khoảng tối đa được phép giữa hai lần poll.'], ['Cooperative rebalancing', 'Di chuyển partition từng phần để giảm stop-the-world churn.']],
  },
  {
    n: 53, id: 'cache-hot-key', icon: '🔥', resource: 'Redis Cluster',
    en: ['The Celebrity Hot Key', 'One Redis shard melts while the cluster looks idle', 'A viral profile key receives 40% of all reads. Hash partitioning maps that key to one shard, which saturates while other shards remain quiet.', 'A single hot key concentrated traffic on one partition.', 'Use near-cache/request coalescing, replicate or split the hot value when safe, protect origin with limits, and track per-key/per-shard load.', 'Adding shards does not split one key. Mitigation depends on staleness tolerance, write rate, value size, and invalidation cost.'],
    vi: ['Celebrity hot key', 'Một Redis shard quá tải trong khi cả cluster trông vẫn rảnh', 'Một profile đang viral nhận 40% tổng read. Hash partitioning map key đó vào một shard khiến shard bão hòa, các shard khác gần như không tải.', 'Một hot key tập trung traffic vào duy nhất một partition.', 'Dùng near-cache/request coalescing, replicate hoặc split hot value khi an toàn, bảo vệ origin bằng limit và đo load theo key/shard.', 'Thêm shard không tự chia một key. Cách xử lý phụ thuộc staleness tolerance, write rate, value size và invalidation cost.'],
    terms: [['Hot key', 'A key receiving disproportionate traffic.'], ['Request coalescing', 'One origin fetch shared by concurrent misses.'], ['Near cache', 'A small cache close to each application instance.'], ['Shard skew', 'Uneven load across partitions.']],
    viTerms: [['Hot key', 'Key nhận lượng traffic lớn bất thường.'], ['Request coalescing', 'Nhiều concurrent miss dùng chung một origin fetch.'], ['Near cache', 'Cache nhỏ nằm gần mỗi application instance.'], ['Shard skew', 'Load phân bố không đều giữa các partition.']],
  },
  {
    n: 54, id: 'sql-injection', icon: '🛡️', resource: 'Search API',
    en: ['The Search Box Breach', 'A filter returns every tenant’s records', 'The API concatenates a user filter into SQL. An attacker changes the query structure with quotes and boolean syntax.', 'Untrusted input was interpreted as SQL code.', 'Use parameterized queries for values, allowlist dynamic identifiers/operators, minimize DB privileges, and test authorization independently.', 'Escaping by hand is brittle. Parameterization separates code from data, but it does not replace tenant authorization.'],
    vi: ['Search box bị khai thác', 'Một filter trả về record của mọi tenant', 'API nối trực tiếp user filter vào SQL. Attacker thay đổi cấu trúc query bằng quote và boolean syntax.', 'Untrusted input bị database hiểu thành SQL code.', 'Dùng parameterized query cho value, allowlist identifier/operator động, giảm DB privilege và test authorization độc lập.', 'Tự escape bằng tay rất dễ sai. Parameterization tách code khỏi data nhưng không thay thế tenant authorization.'],
    terms: [['SQL injection', 'Input changes the structure of a SQL statement.'], ['Parameterized query', 'SQL structure is fixed while values are bound separately.'], ['Allowlist', 'Only explicitly permitted choices are accepted.'], ['Least privilege', 'Grant only permissions required for a task.']],
    viTerms: [['SQL injection', 'Input làm thay đổi cấu trúc SQL statement.'], ['Parameterized query', 'Cấu trúc SQL cố định còn value được bind riêng.'], ['Allowlist', 'Chỉ lựa chọn được cho phép rõ ràng mới được chấp nhận.'], ['Least privilege', 'Chỉ cấp permission cần cho nhiệm vụ.']],
  },
  {
    n: 55, id: 'ssrf-defense', icon: '🌐', resource: 'URL Fetcher',
    en: ['The Internal URL', 'A thumbnail feature reads cloud credentials', 'The server fetches any user-provided URL. Redirects and alternate IP formats reach the instance metadata endpoint and private services.', 'Server-Side Request Forgery let an attacker choose a privileged network destination.', 'Allowlist schemes/destinations, resolve and validate every hop, block private/link-local ranges at egress, limit redirects, and isolate the fetcher.', 'String-prefix checks are bypassable through DNS, redirects, IPv6, and encoding. Defense needs application validation plus network controls.'],
    vi: ['URL nội bộ', 'Tính năng tạo thumbnail đọc được cloud credential', 'Server fetch mọi URL do user cung cấp. Redirect và cách viết IP khác nhau dẫn đến instance metadata endpoint cùng private service.', 'Server-Side Request Forgery cho attacker chọn network destination có quyền cao.', 'Allowlist scheme/destination, resolve và validate mọi hop, chặn private/link-local range ở egress, giới hạn redirect và cô lập fetcher.', 'String-prefix check có thể bị vượt qua bằng DNS, redirect, IPv6 và encoding. Cần cả application validation lẫn network control.'],
    terms: [['SSRF', 'An attacker makes a server send requests to unintended destinations.'], ['Link-local', 'Addresses valid only on the local network segment.'], ['Egress control', 'Policy limiting outbound network access.'], ['DNS rebinding', 'A hostname changes resolution to bypass validation.']],
    viTerms: [['SSRF', 'Attacker khiến server gửi request tới destination ngoài ý muốn.'], ['Link-local', 'Address chỉ có hiệu lực trên local network segment.'], ['Egress control', 'Policy giới hạn outbound network access.'], ['DNS rebinding', 'Hostname đổi kết quả resolve để vượt validation.']],
  },
  {
    n: 56, id: 'authentication-authorization', icon: '🪪', resource: 'Tenant API',
    en: ['The Valid Token, Wrong Account', 'Authentication succeeds and data still leaks', 'The endpoint validates the JWT signature and user identity but loads an invoice directly by ID without checking tenant ownership.', 'Authentication was present, but object-level authorization was missing.', 'Enforce authorization in the data access boundary with tenant/user scope, deny by default, and test cross-tenant IDs.', 'A valid token proves identity and selected claims. Every protected action still needs policy evaluation for the target resource.'],
    vi: ['Token hợp lệ, tài khoản sai', 'Authentication thành công nhưng dữ liệu vẫn bị lộ', 'Endpoint validate JWT signature và user identity nhưng load invoice trực tiếp theo ID mà không kiểm tra tenant ownership.', 'Đã có authentication nhưng thiếu object-level authorization.', 'Enforce authorization tại data-access boundary với tenant/user scope, deny by default và test cross-tenant ID.', 'Valid token chứng minh identity và một số claim. Mỗi protected action vẫn cần policy evaluation cho resource đích.'],
    terms: [['Authentication', 'Establishing who a caller is.'], ['Authorization', 'Deciding what that caller may do to a resource.'], ['BOLA/IDOR', 'Accessing an object without object-level authorization.'], ['Deny by default', 'Access is rejected unless an explicit policy allows it.']],
    viTerms: [['Authentication', 'Xác lập caller là ai.'], ['Authorization', 'Quyết định caller được làm gì với resource.'], ['BOLA/IDOR', 'Truy cập object khi thiếu object-level authorization.'], ['Deny by default', 'Từ chối access trừ khi policy rõ ràng cho phép.']],
  },
  {
    n: 57, id: 'api-idempotency-key', icon: '🪪', resource: 'Payment API',
    en: ['The Double Charge', 'A mobile retry creates a second payment', 'The client times out after the server commits, then retries POST /payments. The server treats the retry as a new command.', 'The create operation lacked a stable idempotency key and replayed a committed side effect.', 'Require a scoped idempotency key, atomically store request hash and result, return the original result on replay, and reject key reuse with different input.', 'Idempotency needs a key scope, retention window, concurrent-request behavior, and an atomic relationship with the side effect.'],
    vi: ['Thanh toán hai lần', 'Mobile retry tạo thêm một payment', 'Client timeout sau khi server đã commit rồi retry POST /payments. Server coi retry là command mới.', 'Create operation thiếu stable idempotency key nên replay side effect đã commit.', 'Yêu cầu idempotency key có scope, atomic lưu request hash cùng result, trả original result khi replay và từ chối tái dùng key với input khác.', 'Idempotency cần key scope, retention window, cách xử lý concurrent request và quan hệ atomic với side effect.'],
    terms: [['Idempotency key', 'A client-supplied identity for one logical command.'], ['Request fingerprint', 'A hash used to detect conflicting key reuse.'], ['Replay', 'Repeating a previously attempted command.'], ['Atomic persistence', 'Saving deduplication state and outcome without a partial gap.']],
    viTerms: [['Idempotency key', 'Identity do client cung cấp cho một logical command.'], ['Request fingerprint', 'Hash để phát hiện tái dùng key với input khác.'], ['Replay', 'Lặp lại command đã từng thử.'], ['Atomic persistence', 'Lưu deduplication state và outcome mà không có partial gap.']],
  },
  {
    n: 58, id: 'overload-load-shedding', icon: '🚦', resource: 'Public API',
    en: ['The Polite Collapse', 'The service accepts every request until none finish', 'Arrival rate exceeds capacity. Queues grow without bounds, latency exceeds client timeouts, retries multiply load, and useful throughput approaches zero.', 'Unbounded queueing and retries turned overload into congestion collapse.', 'Set admission limits, bounded queues and deadlines; shed low-priority work, apply retry budgets/backoff, degrade gracefully, and scale from saturation signals.', 'Availability is the fraction of useful responses within a deadline. Rejecting excess work early can preserve more successful work overall.'],
    vi: ['Sụp đổ vì quá lịch sự', 'Service nhận mọi request cho đến khi không request nào xong', 'Arrival rate vượt capacity. Queue tăng vô hạn, latency vượt client timeout, retry nhân load và useful throughput gần về zero.', 'Unbounded queueing cùng retry biến overload thành congestion collapse.', 'Đặt admission limit, bounded queue và deadline; shed low-priority work, áp dụng retry budget/backoff, graceful degradation và scale theo saturation signal.', 'Availability nên tính response hữu ích trong deadline. Từ chối excess work sớm có thể giữ lại nhiều successful work hơn.'],
    terms: [['Load shedding', 'Rejecting excess work to protect useful throughput.'], ['Admission control', 'Deciding whether new work may enter.'], ['Retry budget', 'A cap on extra load generated by retries.'], ['Saturation', 'A constrained resource operating near its limit.']],
    viTerms: [['Load shedding', 'Từ chối excess work để bảo vệ useful throughput.'], ['Admission control', 'Quyết định work mới có được đi vào hệ thống hay không.'], ['Retry budget', 'Giới hạn extra load do retry sinh ra.'], ['Saturation', 'Resource bị giới hạn đang hoạt động gần capacity.']],
  },
];

const conceptTitles = {
  en: {
    'database-normalization': 'Database Normalization',
    'composite-index-design': 'Composite Index Design',
    'sargable-queries': 'Sargable Queries',
    'n-plus-one-queries': 'N+1 Queries',
    'connection-pool-exhaustion': 'Connection Pool Exhaustion',
    'lost-update': 'Lost Update',
    'process-isolation': 'Process vs Thread',
    'thread-race-condition': 'Thread Race Conditions',
    'thread-deadlock': 'Thread Deadlocks',
    'python-gil-cpu-bound': 'Python GIL & CPU-bound Work',
    'multiprocessing-overhead': 'Multiprocessing Overhead',
    'blocking-event-loop': 'Async Event Loop',
    'memory-leak': 'Memory Leaks',
    'virtual-memory-thrashing': 'Virtual Memory & Thrashing',
    'file-descriptor-exhaustion': 'File Descriptor Exhaustion',
    'scheduler-oversubscription': 'CPU Scheduling & Oversubscription',
    'transactional-outbox': 'Transactional Outbox',
    'kafka-offset-commit': 'Kafka Offsets & Delivery Semantics',
    'kafka-consumer-rebalance': 'Kafka Consumer Rebalancing',
    'cache-hot-key': 'Cache Hot Keys',
    'sql-injection': 'SQL Injection Defense',
    'ssrf-defense': 'SSRF Defense',
    'authentication-authorization': 'Authentication & Authorization',
    'api-idempotency-key': 'API Idempotency',
    'overload-load-shedding': 'Overload & Load Shedding',
  },
  vi: {
    'database-normalization': 'Database Normalization',
    'composite-index-design': 'Thiết kế Composite Index',
    'sargable-queries': 'Sargable Query',
    'n-plus-one-queries': 'N+1 Query',
    'connection-pool-exhaustion': 'Connection Pool Exhaustion',
    'lost-update': 'Lost Update',
    'process-isolation': 'Process và Thread',
    'thread-race-condition': 'Race Condition giữa các Thread',
    'thread-deadlock': 'Thread Deadlock',
    'python-gil-cpu-bound': 'Python GIL và CPU-bound Work',
    'multiprocessing-overhead': 'Multiprocessing Overhead',
    'blocking-event-loop': 'Async Event Loop',
    'memory-leak': 'Memory Leak',
    'virtual-memory-thrashing': 'Virtual Memory và Thrashing',
    'file-descriptor-exhaustion': 'File Descriptor Exhaustion',
    'scheduler-oversubscription': 'CPU Scheduling và Oversubscription',
    'transactional-outbox': 'Transactional Outbox',
    'kafka-offset-commit': 'Kafka Offset và Delivery Semantics',
    'kafka-consumer-rebalance': 'Kafka Consumer Rebalance',
    'cache-hot-key': 'Cache Hot Key',
    'sql-injection': 'Phòng chống SQL Injection',
    'ssrf-defense': 'Phòng chống SSRF',
    'authentication-authorization': 'Authentication và Authorization',
    'api-idempotency-key': 'API Idempotency',
    'overload-load-shedding': 'Overload và Load Shedding',
  },
};

const generic = {
  en: {
    symptoms: (resource) => [`${resource} metrics diverge from the service-level symptom`, 'The problem reproduces only under the triggering workload', 'Logs contain enough evidence to distinguish cause from consequence'],
    objective: 'Identify the root cause, select a production-safe fix, and explain the trade-off.',
    wrongRoots: ['A random network outage with no relation to the supplied evidence', 'Insufficient server count is the only possible cause', 'The monitoring system is wrong and the user-visible failure did not happen'],
    wrongFixes: ['Retry every operation immediately and without a limit', 'Add more instances without measuring the constrained resource', 'Hide the error and keep accepting work with no bound'],
    wrongFeedback: 'This choice does not explain the complete evidence or leaves the underlying correctness/reliability problem intact.',
  },
  vi: {
    symptoms: (resource) => [`Metric của ${resource} khác với service-level symptom`, 'Vấn đề chỉ tái hiện dưới triggering workload', 'Log có đủ bằng chứng để phân biệt cause với consequence'],
    objective: 'Xác định root cause, chọn cách sửa an toàn cho production và giải thích trade-off.',
    wrongRoots: ['Network outage ngẫu nhiên không liên quan tới bằng chứng', 'Thiếu server là nguyên nhân duy nhất có thể xảy ra', 'Monitoring sai và user-visible failure chưa từng xảy ra'],
    wrongFixes: ['Retry mọi operation ngay lập tức và không giới hạn', 'Thêm instance mà không đo constrained resource', 'Ẩn lỗi rồi tiếp tục nhận work không giới hạn'],
    wrongFeedback: 'Lựa chọn này không giải thích toàn bộ bằng chứng hoặc vẫn để nguyên vấn đề correctness/reliability bên dưới.',
  },
};

function rotatedOptions(correctText, wrongTexts, correctFeedback, wrongFeedback, seed, prefix) {
  const options = [
    { id: `${prefix}-correct`, text: correctText, correct: true, feedback: correctFeedback },
    ...wrongTexts.map((text, index) => ({ id: `${prefix}-wrong-${index + 1}`, text, correct: false, feedback: wrongFeedback })),
  ];
  const shift = seed % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
}

function trackForCase(number) {
  if (number <= 39) return specs.filter((spec) => spec.n >= 34 && spec.n <= 39);
  if (number <= 49) return specs.filter((spec) => spec.n >= 40 && spec.n <= 49);
  return specs.filter((spec) => spec.n >= 50 && spec.n <= 58);
}

function distractorsFor(spec, locale, tupleIndex) {
  const candidates = trackForCase(spec.n).filter((candidate) => candidate.n !== spec.n);
  const offset = spec.n % candidates.length;
  return Array.from({ length: 3 }, (_, index) => candidates[(offset + index) % candidates.length][locale][tupleIndex]);
}

function buildCase(spec, locale) {
  const [title, subtitle, narrative, rootCause, fix, principle] = spec[locale];
  const copy = generic[locale];
  const isVi = locale === 'vi';
  const logs = isVi
    ? ['[09:00:00] INFO workload bắt đầu', `[09:00:10] WARN ${spec.resource} xuất hiện anomaly`, `[09:00:20] WARN ${subtitle}`, '[09:00:30] INFO đã chụp trace, metric và resource state trong cùng evidence window']
    : ['[09:00:00] INFO workload started', `[09:00:10] WARN ${spec.resource} shows an anomaly`, `[09:00:20] WARN ${subtitle}`, '[09:00:30] INFO trace, metrics, and resource state captured in the same evidence window'];

  return {
    id: `case-${spec.n}`,
    number: spec.n,
    title,
    subtitle,
    brief: { narrative, symptoms: copy.symptoms(spec.resource), objective: copy.objective },
    diagram: {
      nodes: [
        { id: 'client', type: 'client', label: isVi ? 'Affected Client' : 'Affected Client', status: 'degraded', position: { x: 80, y: 250 }, inspectable: true, inspectData: { title: isVi ? 'User-visible symptom' : 'User-visible symptom', logs: [subtitle], data: { impact: isVi ? 'Request lỗi hoặc chậm' : 'Requests fail or slow' }, status: subtitle } },
        { id: 'service', type: 'server', label: 'Application Service', status: 'failed', position: { x: 330, y: 70 }, inspectable: true, inspectData: { title: isVi ? 'Bằng chứng từ application' : 'Application evidence', logs, data: { observed_impact: subtitle, evidence_window: '30s' }, status: isVi ? 'Cần đối chiếu log với resource state để tìm root cause.' : 'Correlate logs with resource state to find the root cause.' } },
        { id: 'resource', type: 'database', label: spec.resource, status: 'degraded', position: { x: 580, y: 250 }, inspectable: true, inspectData: { title: spec.resource, logs: copy.symptoms(spec.resource), data: { state: 'DEGRADED', correlated: 'true' }, status: isVi ? 'Resource bị degraded trong đúng evidence window.' : 'The resource degraded during the same evidence window.' } },
      ],
      edges: [
        { id: 'client-service', source: 'client', target: 'service', label: isVi ? 'request chậm/lỗi' : 'slow/failed request', animated: true, style: 'slow' },
        { id: 'service-resource', source: 'service', target: 'resource', label: isVi ? 'constrained path' : 'constrained path', animated: true, style: 'broken' },
      ],
    },
    diagnosis: {
      rootCause: {
        question: isVi ? 'Root cause nào giải thích đầy đủ các bằng chứng?' : 'Which root cause explains all of the evidence?',
        options: rotatedOptions(rootCause, distractorsFor(spec, locale, 3), `${isVi ? 'Chính xác. ' : 'Correct. '}${principle}`, copy.wrongFeedback, spec.n, 'rc'),
      },
      fix: {
        question: isVi ? 'Cách sửa nào an toàn nhất cho production?' : 'Which fix is safest for production?',
        options: rotatedOptions(fix, distractorsFor(spec, locale, 4), `${isVi ? 'Chính xác. ' : 'Correct. '}${principle}`, copy.wrongFeedback, spec.n + 1, 'fix'),
      },
    },
    conceptId: spec.id,
    badge: { name: title, icon: spec.icon },
  };
}

function buildConcept(spec, locale) {
  const [, , , rootCause, fix, principle] = spec[locale];
  const terms = locale === 'vi' ? spec.viTerms : spec.terms;
  return {
    id: spec.id,
    title: conceptTitles[locale][spec.id],
    summary: principle,
    explanation: [rootCause, fix, principle],
    keyTerms: terms.map(([term, definition]) => ({ term, definition })),
  };
}

for (const spec of specs) {
  const name = `case-${spec.n}.json`;
  writeFileSync(path.join(casesDir, name), `${JSON.stringify(buildCase(spec, 'en'), null, 2)}\n`);
  writeFileSync(path.join(viCasesDir, name), `${JSON.stringify(buildCase(spec, 'vi'), null, 2)}\n`);
}

const conceptsPath = path.join(root, 'src', 'data', 'concepts.json');
const existingConcepts = JSON.parse(readFileSync(conceptsPath, 'utf8'));
const generatedIds = new Set(specs.map((spec) => spec.id));
const mergedConcepts = [
  ...existingConcepts.filter((concept) => !generatedIds.has(concept.id)),
  ...specs.map((spec) => buildConcept(spec, 'en')),
];
writeFileSync(conceptsPath, `${JSON.stringify(mergedConcepts, null, 2)}\n`);
const viConceptsPath = path.join(root, 'src', 'data', 'concepts-vi.json');
const existingViConcepts = JSON.parse(readFileSync(viConceptsPath, 'utf8'));
const mergedViConcepts = [
  ...existingViConcepts.filter((concept) => !generatedIds.has(concept.id)),
  ...specs.map((spec) => buildConcept(spec, 'vi')),
];
writeFileSync(viConceptsPath, `${JSON.stringify(mergedViConcepts, null, 2)}\n`);

console.log(`Generated ${specs.length} backend curriculum cases in English and Vietnamese.`);

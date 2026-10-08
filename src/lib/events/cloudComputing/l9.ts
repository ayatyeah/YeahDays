import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 9 — хранилища и базы данных AWS (Cloud Foundations, модули 7–8,
 * Lab 4 «Working with EBS», Lab 5 «Build a Database Server»). Дополняет
 * лекцию 3 (общие типы хранилищ и основы S3) спецификой AWS.
 */

const p1 = part(
  "cc-l9-p1",
  { en: "Amazon EBS, instance store and Lab 4", ru: "Amazon EBS, instance store и Lab 4" },
  {
    en: `## Storage types in AWS
In AWS each storage type from Lecture 3 is a separate service; the exam asks which one fits a scenario.
| Storage type | AWS service | Unit of storage | Who can use it |
|---|---|---|---|
| Block | Amazon EBS, instance store | volume | one EC2 instance (EBS: in the same AZ) |
| File | Amazon EFS (Linux, NFS), Amazon FSx (Windows SMB, Lustre and others) | file system | many instances at the same time |
| Object | Amazon S3, S3 Glacier | object in a bucket | anything that can call the API |
- **Block** storage rewrites only the blocks that changed — good for an OS, databases and anything that writes often.
- **Object** storage replaces the whole object on every change — good for files written once and read many times.
## Amazon EBS — Elastic Block Store
**Amazon EBS** provides **persistent block storage volumes** for EC2 instances. The instance sees a volume as a raw disk: you create a file system on it, mount it and use it like a hard drive.
- **Network-attached and persistent**: the volume is not inside the host, so its data survives an instance **stop** and, if configured, **termination**.
- **AZ-scoped**: a volume is created in **one Availability Zone** and attaches only to instances in **that same AZ**. AWS **replicates it inside its AZ** to protect against component failure.
- Normally **one volume is attached to one instance at a time**; one instance can have **many volumes**. A volume can be **detached** and attached to another instance in the same AZ.
- **Elastic Volumes**: increase the size or change the type and performance **while the volume is in use** — the size can only grow, never shrink.
- **Encryption** with AWS KMS covers data at rest, snapshots and data moving between the instance and the volume.
- **Pricing**: you pay per **GB-month provisioned** (the full size, not the space used), plus extra IOPS or throughput on some types, plus snapshot storage.
## EBS volume types
| Type | Media | Best for | Boot volume? |
|---|---|---|---|
| gp3 / gp2 General Purpose SSD | SSD | most workloads: boot volumes, dev/test, small and medium databases | yes |
| io2 / io1 Provisioned IOPS SSD | SSD | critical, I/O-intensive databases that need sustained high IOPS and low latency | yes |
| st1 Throughput Optimized HDD | HDD | big data, data warehouses, log processing — large sequential reads | no |
| sc1 Cold HDD | HDD | cold, rarely accessed data at the lowest cost per GB | no |
- **SSD** types are rated in **IOPS** (small random reads and writes); **HDD** types in **throughput**, MB/s (large sequential reads).
- **gp3** gives a baseline of **3,000 IOPS and 125 MB/s** at any size, and more can be bought separately; on **gp2**, IOPS grow with size (3 IOPS per GiB).
- HDD volumes **cannot be boot volumes**.
## EBS snapshots
An **EBS snapshot** is a **point-in-time, incremental backup** of a volume that is **stored in Amazon S3** (in storage managed by AWS — it does not appear in your buckets).
- **Incremental**: the first snapshot copies all used blocks; each next one saves **only the blocks changed** since the previous snapshot, so you pay less. Deleting an old snapshot is safe: AWS keeps any blocks that later snapshots still need.
- A snapshot belongs to the **Region**, not to an AZ: from it you can create a **new volume in any AZ of the Region** — this is how a volume "moves" to another AZ. A snapshot can also be **copied to another Region** or **shared** with another account.
- **Amazon Data Lifecycle Manager** (or AWS Backup) creates and deletes snapshots on a schedule; a snapshot of a root volume can become an **AMI**.
@diagram cc9-ebs-snapshot
## Multi-Attach — the one exception
**EBS Multi-Attach** lets one **Provisioned IOPS SSD (io1 or io2)** volume be attached to **up to 16 Nitro-based instances** — but only instances in the **same AZ** as the volume. The application must coordinate writes; ordinary file systems such as ext4 would corrupt the data.
> Exam trap: "Can one EBS volume be attached to instances in **different AZs**?" — **No**. EBS volumes are AZ-scoped, and even Multi-Attach works only inside one AZ. For storage shared between instances and AZs, use **Amazon EFS** (Linux) or **Amazon FSx** (Windows).
## Instance store
An **instance store** is **temporary block storage** on disks **physically attached to the host** computer.
- Very fast and **included in the instance price**; its size depends on the instance type, and not every type has one.
- **Ephemeral**: data survives a **reboot** but is **lost** when the instance is **stopped, hibernated or terminated**, or when the disk fails.
- Use it for **buffers, caches and scratch data** — never for the only copy of anything important.
| Event | EBS volume | Instance store |
|---|---|---|
| Reboot | data kept | data kept |
| Stop or hibernate | data kept (the volume is still billed) | data lost |
| Terminate | root volume deleted by default; volumes attached later kept by default | data lost |
| Attach to another instance | possible, in the same AZ | impossible |
- The **DeleteOnTermination** flag decides what happens at termination: it is **on for the root volume** by default and **off for volumes attached later**. Turn it off on the root volume if its data must outlive the instance.
## Lab 4 — Working with EBS
The lab adds a second disk to a running Linux instance, backs it up and restores it.
- **1. Create a volume**: EC2 → Volumes → Create volume: General Purpose SSD, **1 GiB**, in the **same AZ as the instance**, tag Name = My Volume. The state is *Available*.
- **2. Attach** it to the instance as **/dev/sdf**. The state becomes *In-use*.
- **3. Connect** to the instance (EC2 Instance Connect) and run df -h: the new disk is not listed yet — it has no file system and is not mounted.
- **4. Create a file system and mount it**:
= sudo mkfs -t ext3 /dev/sdf
= sudo mkdir /mnt/data-store
= sudo mount /dev/sdf /mnt/data-store
= echo "/dev/sdf /mnt/data-store ext3 defaults,noatime 1 2" | sudo tee -a /etc/fstab
The /etc/fstab line makes the mount **come back after a reboot**. A test file is then written to /mnt/data-store/file.txt.
- **5. Create a snapshot** (My Snapshot) of My Volume, then delete file.txt from the disk.
- **6. Restore**: create a **new volume from the snapshot** (Restored Volume) in the instance's AZ, attach it as **/dev/sdg** and mount it on /mnt/data-store2 — **without mkfs**, because the volume already holds the file system — and file.txt is back.
> Lab 4 in one line: volume in the instance's AZ → attach → mkfs (only for an empty volume) → mount → fstab → snapshot → new volume from the snapshot → mount.
?? An instance in us-east-1a needs the data of a volume in us-east-1b. What is the way?
?= Take a snapshot of the volume, create a new volume from it in us-east-1a and attach that volume. A volume cannot be attached across AZs.
?? Why is mkfs not run on the volume restored from a snapshot?
?= mkfs creates a new, empty file system and would wipe the restored data; the volume already contains the file system from the snapshot.
?? After a stop and start, which data is still there: on the EBS root volume or on the instance store?
?= On the EBS volume. Instance store data is lost on stop; it survives only a reboot.`,
    ru: `## Типы хранилищ в AWS
В AWS каждому типу хранилища из лекции 3 соответствует отдельный сервис; на экзамене спрашивают, какой из них подходит под сценарий.
| Тип хранилища | Сервис AWS | Единица хранения | Кто может пользоваться |
|---|---|---|---|
| Блочное (block) | Amazon EBS, instance store | том (volume) | один инстанс EC2 (EBS — в той же AZ) |
| Файловое (file) | Amazon EFS (Linux, NFS), Amazon FSx (Windows SMB, Lustre и другие) | файловая система | много инстансов одновременно |
| Объектное (object) | Amazon S3, S3 Glacier | объект в бакете | всё, что умеет вызывать API |
- **Блочное** хранилище перезаписывает только изменившиеся блоки — подходит для ОС, баз данных и всего, что часто пишет.
- **Объектное** хранилище при любом изменении заменяет объект целиком — подходит для файлов, которые пишут один раз и читают много раз.
## Amazon EBS — Elastic Block Store
**Amazon EBS** даёт инстансам EC2 **постоянные (persistent) блочные тома**. Инстанс видит том как «сырой» диск: на нём создают файловую систему, монтируют его и пользуются им как жёстким диском.
- **Подключён по сети и постоянен**: том находится не внутри хоста, поэтому его данные переживают **остановку (stop)** инстанса и, если так настроено, **удаление (termination)**.
- **Привязан к AZ (AZ-scoped)**: том создаётся в **одной Availability Zone** и подключается только к инстансам **в той же AZ**. AWS **реплицирует его внутри этой AZ**, чтобы защитить от отказа компонентов.
- Обычно **один том подключён к одному инстансу за раз**; у одного инстанса может быть **много томов**. Том можно **отключить (detach)** и подключить к другому инстансу в той же AZ.
- **Elastic Volumes**: размер можно увеличить, а тип и производительность — сменить **прямо во время работы тома**; размер только растёт, уменьшить его нельзя.
- **Шифрование** через AWS KMS покрывает данные в покое (at rest), snapshots и данные, которые идут между инстансом и томом.
- **Оплата**: за **выделенные GB в месяц** (весь размер тома, а не занятое место), плюс дополнительные IOPS или пропускная способность у некоторых типов, плюс хранение snapshots.
## Типы томов EBS
| Тип | Носитель | Для чего | Загрузочный? |
|---|---|---|---|
| gp3 / gp2 General Purpose SSD | SSD | большинство задач: загрузочные тома, dev/test, небольшие и средние БД | да |
| io2 / io1 Provisioned IOPS SSD | SSD | критичные БД с интенсивным вводом-выводом: стабильно высокие IOPS и низкая задержка | да |
| st1 Throughput Optimized HDD | HDD | big data, хранилища данных, обработка логов — большие последовательные чтения | нет |
| sc1 Cold HDD | HDD | холодные, редко читаемые данные по самой низкой цене за GB | нет |
- Типы **SSD** оцениваются в **IOPS** (мелкие случайные чтения и записи), типы **HDD** — в **пропускной способности (throughput)**, MB/s (большие последовательные чтения).
- **gp3** даёт базовые **3 000 IOPS и 125 MB/s** при любом размере, больше можно докупить отдельно; у **gp2** IOPS растут вместе с размером (3 IOPS на GiB).
- Тома HDD **не могут быть загрузочными**.
## Snapshots EBS
**EBS snapshot** — **инкрементная резервная копия тома на момент времени (point-in-time)**, которая **хранится в Amazon S3** (в хранилище под управлением AWS — в ваших бакетах её не видно).
- **Инкрементная**: первый snapshot копирует все занятые блоки, каждый следующий сохраняет **только блоки, изменившиеся** с прошлого snapshot, поэтому платить приходится меньше. Удалять старый snapshot безопасно: AWS сохраняет блоки, которые ещё нужны более поздним.
- Snapshot принадлежит **региону**, а не AZ: из него можно создать **новый том в любой AZ региона** — так том «переезжает» в другую AZ. Snapshot также можно **скопировать в другой регион** или **поделиться (share)** им с другим аккаунтом.
- **Amazon Data Lifecycle Manager** (или AWS Backup) создаёт и удаляет snapshots по расписанию; из snapshot корневого тома можно сделать **AMI**.
@diagram cc9-ebs-snapshot
## Multi-Attach — единственное исключение
**EBS Multi-Attach** позволяет подключить один том **Provisioned IOPS SSD (io1 или io2)** **максимум к 16 инстансам на базе Nitro** — но только к инстансам в **той же AZ**, что и том. Записи должно согласовывать само приложение; обычные файловые системы вроде ext4 испортят данные.
> Ловушка экзамена: «Можно ли подключить один том EBS к инстансам в **разных AZ**?» — **Нет**. Тома EBS привязаны к AZ, и даже Multi-Attach работает только внутри одной AZ. Для общего хранилища между инстансами и AZ нужен **Amazon EFS** (Linux) или **Amazon FSx** (Windows).
## Instance store
**Instance store** — **временное блочное хранилище** на дисках, **физически подключённых к хосту**.
- Очень быстрое и **входит в цену инстанса**; размер зависит от типа инстанса, и есть оно не у всех типов.
- **Эфемерное (ephemeral)**: данные переживают **перезагрузку (reboot)**, но **теряются**, когда инстанс **останавливают, переводят в hibernate или удаляют**, а также при отказе диска.
- Подходит для **буферов, кэшей и временных (scratch) данных** — но никогда для единственной копии чего-то важного.
| Событие | Том EBS | Instance store |
|---|---|---|
| Reboot | данные сохраняются | данные сохраняются |
| Stop или hibernate | данные сохраняются (за том по-прежнему платят) | данные теряются |
| Terminate | корневой том по умолчанию удаляется; подключённые позже по умолчанию остаются | данные теряются |
| Подключить к другому инстансу | можно, в той же AZ | нельзя |
- Что будет при удалении инстанса, решает флаг **DeleteOnTermination**: по умолчанию он **включён у корневого тома** и **выключен у томов, подключённых позже**. Если данные корневого тома должны пережить инстанс, флаг выключают.
## Lab 4 — Working with EBS
В лабораторной к работающему Linux-инстансу добавляют второй диск, делают его резервную копию и восстанавливают её.
- **1. Создать том**: EC2 → Volumes → Create volume: General Purpose SSD, **1 GiB**, в **той же AZ, что и инстанс**, тег Name = My Volume. Состояние — *Available*.
- **2. Подключить (attach)** его к инстансу как **/dev/sdf**. Состояние становится *In-use*.
- **3. Подключиться** к инстансу (EC2 Instance Connect) и выполнить df -h: нового диска в списке ещё нет — на нём нет файловой системы, и он не смонтирован.
- **4. Создать файловую систему и смонтировать её**:
= sudo mkfs -t ext3 /dev/sdf
= sudo mkdir /mnt/data-store
= sudo mount /dev/sdf /mnt/data-store
= echo "/dev/sdf /mnt/data-store ext3 defaults,noatime 1 2" | sudo tee -a /etc/fstab
Строка в /etc/fstab нужна, чтобы том **монтировался снова после перезагрузки**. Затем в /mnt/data-store/file.txt записывают тестовый файл.
- **5. Создать snapshot** (My Snapshot) тома My Volume, затем удалить file.txt с диска.
- **6. Восстановить**: создать **новый том из snapshot** (Restored Volume) в AZ инстанса, подключить его как **/dev/sdg** и смонтировать в /mnt/data-store2 — **без mkfs**, потому что на томе уже есть файловая система, — и file.txt снова на месте.
> Lab 4 одной строкой: том в AZ инстанса → attach → mkfs (только для пустого тома) → mount → fstab → snapshot → новый том из snapshot → mount.
?? Инстансу в us-east-1a нужны данные тома из us-east-1b. Как быть?
?= Сделать snapshot тома, создать из него новый том в us-east-1a и подключить этот том. Подключить том через границу AZ нельзя.
?? Почему на томе, восстановленном из snapshot, не запускают mkfs?
?= mkfs создаёт новую пустую файловую систему и стёр бы восстановленные данные; на томе уже есть файловая система из snapshot.
?? Какие данные остаются после stop и start: на корневом томе EBS или в instance store?
?= На томе EBS. Данные instance store при stop теряются; они переживают только reboot.`,
  },
  [
    qx("An EC2 instance runs in us-east-1a. Where must a new EBS volume be created so that it can be attached to this instance?", "In us-east-1a, the same AZ as the instance", [
      ["In any AZ of the same Region", "Attachment is AZ-scoped: an instance in 1a cannot attach a volume created in 1b or 1c.", "Подключение привязано к AZ: инстанс в 1a не может подключить том, созданный в 1b или 1c."],
      ["In us-east-1b, so the data sits in a second AZ", "Then the volume could not be attached at all; durability inside the AZ is already handled by EBS replication.", "Тогда том вообще не подключится; надёжность внутри AZ и так обеспечивает репликация EBS."],
      ["In any Region, as EBS is a global service", "EBS is not global: each volume lives in exactly one AZ of one Region.", "EBS — не глобальный сервис: каждый том живёт ровно в одной AZ одного региона."],
    ], "EBS volumes are AZ-scoped: a volume attaches only to instances in the AZ where it was created.", "Тома EBS привязаны к AZ: том подключается только к инстансам в той AZ, где он создан."),
    qx("A team wants one EBS volume to be used by EC2 instances in two different Availability Zones for shared access. What is the right answer?", "Not possible: EBS is AZ-scoped, so use Amazon EFS", [
      ["Possible with Multi-Attach on Provisioned IOPS io2 volumes", "Multi-Attach does exist for io1/io2, but only for instances in the same AZ as the volume.", "Multi-Attach для io1/io2 существует, но только для инстансов в той же AZ, что и том."],
      ["Possible once termination protection is turned on", "Termination protection only blocks accidental termination; it has nothing to do with attachment.", "Termination protection лишь защищает от случайного удаления инстанса и к подключению томов отношения не имеет."],
      ["Possible if snapshots are enabled on the volume", "Snapshots are backups; they never let a volume be attached in another AZ.", "Snapshots — это резервные копии; они не позволяют подключить том в другой AZ."],
    ], "A volume lives in one AZ and Multi-Attach works only inside that AZ. Shared storage across AZs is Amazon EFS (or FSx for Windows).", "Том живёт в одной AZ, и Multi-Attach работает только внутри неё. Общее хранилище между AZ — Amazon EFS (или FSx для Windows)."),
    qx("What is the primary function of an Amazon EBS snapshot?", "A point-in-time incremental backup of the volume, kept in S3", [
      ["A live copy of the volume kept up to date in a second Region", "Snapshots are not replicated automatically; you can copy one to another Region yourself.", "Snapshots не реплицируются автоматически; скопировать snapshot в другой регион можно только самому."],
      ["A fast cache that holds the volume's most frequently read blocks", "A snapshot is a backup, not a cache; it does not speed up reads.", "Snapshot — резервная копия, а не кэш; чтение он не ускоряет."],
      ["A shared mode that lets several instances read the same volume", "Sharing a volume between instances is Multi-Attach, not a snapshot.", "Общий доступ к тому для нескольких инстансов — это Multi-Attach, а не snapshot."],
    ], "An EBS snapshot is a point-in-time backup; after the first one, only changed blocks are saved, and the data is stored in Amazon S3.", "EBS snapshot — резервная копия на момент времени; после первого сохраняются только изменённые блоки, а хранятся данные в Amazon S3."),
    qx("Three snapshots are taken of a 100 GiB volume; between snapshots about 2 GiB of blocks change. What do the second and third snapshots store?", "Only the blocks that changed, about 2 GiB each", [
      ["A full copy of all 100 GiB, every time", "That would be a full backup; EBS snapshots are incremental.", "Это была бы полная копия; snapshots EBS инкрементные."],
      ["Only a list of changed file names, no data", "Snapshots work at block level and store the changed data blocks themselves, not file names.", "Snapshots работают на уровне блоков и хранят сами изменённые блоки данных, а не имена файлов."],
      ["Nothing; they just point to the first one", "They do point to unchanged blocks, but they must store the blocks that changed.", "На неизменённые блоки они действительно ссылаются, но изменённые блоки обязаны хранить."],
    ], "Snapshots are incremental: the first copies all used blocks, each later one saves only the blocks changed since the previous snapshot.", "Snapshots инкрементные: первый копирует все занятые блоки, каждый следующий — только блоки, изменённые с прошлого snapshot."),
    qx("A volume in us-west-2a holds data that an instance in us-west-2b needs. What is the standard way to get it there?", "Create a snapshot, then a new volume from it in us-west-2b", [
      ["Detach it and attach it directly to the instance in us-west-2b", "A volume can be attached only in its own AZ, so this attach fails.", "Том подключается только в своей AZ, поэтому такое подключение не сработает."],
      ["Enable Multi-Attach so both AZs can use the volume", "Multi-Attach works only for instances in the volume's own AZ.", "Multi-Attach работает только для инстансов в AZ самого тома."],
      ["Change the volume's AZ with Elastic Volumes", "Elastic Volumes changes size, type and performance, never the AZ.", "Elastic Volumes меняет размер, тип и производительность, но не AZ."],
    ], "A snapshot is Regional: a new volume can be created from it in any AZ of the Region, then attached there.", "Snapshot принадлежит региону: из него можно создать новый том в любой AZ региона и подключить его там."),
    qx("A log-processing cluster reads large files sequentially all day and needs high throughput at a low price per GB. Which EBS volume type fits?", "st1 Throughput Optimized HDD", [
      ["io2 Provisioned IOPS SSD", "io2 is built for random I/O in critical databases and is the most expensive type.", "io2 рассчитан на случайный ввод-вывод критичных БД и стоит дороже всех."],
      ["sc1 Cold HDD, the lowest cost per GB", "sc1 is for cold, rarely read data; its throughput is lower than st1, so a busy cluster would be slow.", "sc1 — для холодных, редко читаемых данных; пропускная способность ниже, чем у st1, и загруженный кластер будет тормозить."],
      ["gp3 General Purpose SSD", "gp3 would work, but it costs more per GB and is tuned for IOPS rather than sequential throughput.", "gp3 подойдёт, но дороже за GB и рассчитан на IOPS, а не на последовательную пропускную способность."],
    ], "st1 is designed for frequently read, large sequential workloads — big data, data warehouses, log processing — at a low price per GB.", "st1 создан для часто читаемых больших последовательных данных — big data, хранилищ данных, обработки логов — по низкой цене за GB."),
    qx("A business-critical OLTP database needs sustained high IOPS and consistently low latency. Which EBS volume type fits best?", "io2 Provisioned IOPS SSD", [
      ["st1 Throughput Optimized HDD", "st1 is rated in throughput for large sequential reads, not in IOPS for random database I/O.", "st1 оценивается по пропускной способности для больших последовательных чтений, а не по IOPS для случайного ввода-вывода БД."],
      ["sc1 Cold HDD", "sc1 is the cheapest type for rarely accessed data — the opposite of a busy database.", "sc1 — самый дешёвый тип для редко читаемых данных, полная противоположность нагруженной БД."],
      ["Instance store on the host", "Instance store is fast but ephemeral; a critical database would lose its data on stop.", "Instance store быстрый, но эфемерный; критичная БД потеряет данные при остановке."],
    ], "Provisioned IOPS SSD (io2/io1) lets you set the IOPS level you need and is meant for critical, I/O-intensive databases.", "Provisioned IOPS SSD (io2/io1) позволяет задать нужный уровень IOPS и предназначен для критичных БД с интенсивным вводом-выводом."),
    tfx("An HDD-backed EBS volume such as st1 or sc1 can be used as the boot volume of an EC2 instance.", false,
      "Only SSD types (gp2, gp3, io1, io2) can be boot volumes; st1 and sc1 are for data only.",
      "Загрузочными могут быть только SSD-типы (gp2, gp3, io1, io2); st1 и sc1 — только для данных.",
      "'True' ignores the rule that HDD volume types cannot hold the operating system to boot from.",
      "Ответ «верно» не учитывает правило: с томов HDD загрузить операционную систему нельзя."),
    qx("A developer stops an instance whose root volume is EBS and starts it again the next day. What happens to the data on the root volume?", "It is still there: EBS persists across stop and start", [
      ["It is lost unless a snapshot was taken before the stop", "A snapshot is not needed to survive a stop; EBS data stays on the volume.", "Чтобы пережить stop, snapshot не нужен: данные EBS остаются на томе."],
      ["It is deleted as soon as the instance is in the stopped state", "Stopping deletes nothing on EBS; that is instance store behaviour.", "Остановка ничего не удаляет на EBS — так ведёт себя instance store."],
      ["It survives only if termination protection is turned on", "Termination protection matters for terminate, not for stop.", "Termination protection важна при terminate, а не при stop."],
    ], "EBS volumes are persistent and independent of the instance's running state; you keep paying for them while the instance is stopped.", "Тома EBS постоянные и не зависят от того, запущен ли инстанс; пока он остановлен, за том продолжают платить."),
    qx("An instance has data on an instance store volume. The instance is stopped and then started. What happens to that data?", "It is lost; instance store survives only a reboot", [
      ["It is kept, just like data on an EBS root volume", "Instance store is ephemeral: unlike EBS, it does not survive a stop.", "Instance store эфемерный: в отличие от EBS, он не переживает остановку."],
      ["It is saved to Amazon S3 automatically before the stop", "AWS does not back up instance store; copying data out is your job.", "AWS не делает резервных копий instance store; вынести данные — ваша задача."],
      ["It is kept, but moved to a new EBS volume", "No automatic conversion happens; the disks belong to the old host.", "Никакого автоматического переноса нет: диски принадлежат старому хосту."],
    ], "A stopped instance usually starts on a different host, and the instance store disks stay with the old host — the data is gone. Only a reboot keeps it.", "Остановленный инстанс обычно запускается на другом хосте, а диски instance store остаются на старом — данных больше нет. Сохраняет их только reboot."),
    qx("Which workload is the best fit for an instance store volume?", "Scratch data and caches that can be rebuilt at any time", [
      ["The only copy of the company's customer order database", "Losing the only copy on a stop or a disk failure would be a disaster.", "Потеря единственной копии при stop или отказе диска — катастрофа."],
      ["Log files that must be kept after the instance is terminated", "Instance store data is lost on termination; use EBS or S3.", "Данные instance store теряются при terminate; нужен EBS или S3."],
      ["Shared documents that several instances edit together", "Instance store belongs to one host and cannot be shared; use EFS.", "Instance store принадлежит одному хосту и не делится; нужен EFS."],
    ], "Instance store is fast and free with the instance, but temporary — ideal for buffers, caches and scratch data.", "Instance store быстрый и входит в цену инстанса, но временный — идеален для буферов, кэшей и временных данных."),
    qx("An instance has an EBS root volume and an EBS data volume that was attached after launch. Both use default settings. The instance is terminated. What happens?", "The root volume is deleted; the data volume is kept", [
      ["Both volumes are deleted together with the instance", "Volumes attached after launch have DeleteOnTermination off by default.", "У томов, подключённых после запуска, DeleteOnTermination по умолчанию выключен."],
      ["Both volumes are kept until someone deletes them", "The root volume has DeleteOnTermination on by default, so it is deleted.", "У корневого тома DeleteOnTermination по умолчанию включён, поэтому он удаляется."],
      ["The data volume is deleted; the root volume is kept", "It is the other way round.", "Всё ровно наоборот."],
    ], "DeleteOnTermination is true for the root volume and false for volumes attached later, so the data volume stays (and is still billed).", "DeleteOnTermination включён у корневого тома и выключен у томов, подключённых позже, поэтому том данных остаётся (и по-прежнему оплачивается)."),
    qx("A developer deletes most files from a 500 GiB EBS volume, but the monthly EBS bill does not change. Why?", "EBS charges for the provisioned size, not the space used", [
      ["EBS bills by the number of files written during the month", "EBS has no per-file charge; it bills the provisioned GB-month.", "У EBS нет оплаты за файлы; оплачиваются выделенные GB в месяц."],
      ["Deleting files only frees space after the instance reboots", "Space is freed in the file system at once; billing never depended on it.", "Место в файловой системе освобождается сразу, а оплата от него и не зависела."],
      ["EBS charges for the peak data stored during the month", "There is no peak-usage billing; the full provisioned size is billed.", "Оплаты по пиковому объёму нет: оплачивается весь выделенный размер."],
    ], "You pay for the provisioned volume size per GB-month, no matter how much of it is filled. To pay less, use a smaller volume.", "Оплачивается выделенный размер тома за GB в месяц, сколько бы в нём ни было данных. Чтобы платить меньше, нужен том меньшего размера."),
    qx("Which statement about EBS Multi-Attach is correct?", "It works only with io1/io2 volumes and instances in one AZ", [
      ["It works with every volume type, across all AZs in the Region", "Only Provisioned IOPS SSD volumes support it, and only within one AZ.", "Его поддерживают только тома Provisioned IOPS SSD и только внутри одной AZ."],
      ["It turns an EBS volume into an NFS share that any instance can mount", "Multi-Attach shares a raw block device, not an NFS share; that is EFS.", "Multi-Attach делит «сырой» блочный диск, а не NFS-ресурс; NFS — это EFS."],
      ["It is the default mode for every new gp3 volume", "It is off by default and not available for gp3.", "По умолчанию он выключен и для gp3 недоступен."],
    ], "Multi-Attach: one io1/io2 volume, up to 16 Nitro instances, all in the volume's AZ, and the app must coordinate writes.", "Multi-Attach: один том io1/io2, до 16 инстансов на Nitro, все в AZ тома, а записи согласует приложение."),
    qx("In Lab 4, a new empty 1 GiB volume is attached, but df -h does not show it. Why?", "It has no file system yet and is not mounted", [
      ["The volume is still in another Availability Zone", "It was attached successfully, which is only possible in the same AZ.", "Том успешно подключился, а это возможно только в той же AZ."],
      ["df -h lists only instance store disks", "df -h lists mounted file systems of any kind, EBS included.", "df -h показывает смонтированные файловые системы любого вида, включая EBS."],
      ["The instance must be rebooted to see new disks", "The OS sees the attached device right away; it just needs mkfs and mount.", "ОС видит подключённое устройство сразу; нужно только mkfs и mount."],
    ], "df -h shows mounted file systems. The raw volume appears only after mkfs creates a file system and mount attaches it to a directory.", "df -h показывает смонтированные файловые системы. «Сырой» том появится, когда mkfs создаст файловую систему, а mount подключит её к каталогу."),
    qx("Which Lab 4 command creates the file system on the new volume?", "sudo mkfs -t ext3 /dev/sdf", [
      ["sudo mount /dev/sdf /mnt/data-store", "mount attaches an existing file system to a directory; it does not create one.", "mount подключает уже готовую файловую систему к каталогу, а не создаёт её."],
      ["sudo mkdir /mnt/data-store", "mkdir only creates the empty directory used as the mount point.", "mkdir лишь создаёт пустой каталог — точку монтирования."],
      ["sudo tee -a /etc/fstab", "Appending to /etc/fstab only makes the mount persistent across reboots.", "Запись в /etc/fstab лишь делает монтирование постоянным после перезагрузок."],
    ], "mkfs (make file system) formats the device; -t ext3 sets the file system type used in the lab.", "mkfs (make file system) форматирует устройство; -t ext3 задаёт тип файловой системы из лабораторной."),
    qx("Why does Lab 4 append a line for /dev/sdf to /etc/fstab?", "So the volume is mounted again after every reboot", [
      ["So the volume is formatted with ext3 automatically", "Formatting is done once with mkfs; fstab only lists what to mount.", "Форматирует один раз mkfs; fstab лишь перечисляет, что монтировать."],
      ["So a snapshot is taken each time the system boots", "Snapshots are created through EC2 or Data Lifecycle Manager, not fstab.", "Snapshots создаются через EC2 или Data Lifecycle Manager, а не через fstab."],
      ["So other instances can mount the same volume", "fstab is local to this instance and does not share anything.", "fstab действует только на этом инстансе и ничем не делится."],
    ], "/etc/fstab lists file systems to mount at boot; without the line, /mnt/data-store would be empty after a reboot.", "/etc/fstab перечисляет файловые системы для монтирования при загрузке; без этой строки после перезагрузки /mnt/data-store был бы пуст."),
    qx("In Lab 4 the volume restored from the snapshot is attached as /dev/sdg. Which step from the first volume is skipped, and why?", "mkfs, since the restored volume already holds a file system", [
      ["mount, since AWS mounts restored volumes automatically", "AWS attaches the device, but mounting is still done inside the OS.", "AWS подключает устройство, но монтировать его всё равно нужно внутри ОС."],
      ["attach, since volumes from snapshots join the instance by themselves", "A new volume must be attached explicitly, as /dev/sdg in the lab.", "Новый том нужно подключить явно — в лабораторной как /dev/sdg."],
      ["mkdir, since the old mount point /mnt/data-store is reused", "The lab creates a new directory, /mnt/data-store2, for the restored volume.", "В лабораторной для восстановленного тома создают новый каталог /mnt/data-store2."],
    ], "The snapshot contains the ext3 file system and file.txt. Running mkfs would erase them, so the volume is only mounted.", "В snapshot уже есть файловая система ext3 и file.txt. mkfs стёр бы их, поэтому том только монтируют."),
    tfx("Deleting an older EBS snapshot makes the newer snapshots of the same volume unusable, because they store only the changed blocks.", false,
      "AWS keeps every block that a later snapshot still references; deleting a snapshot removes only data no other snapshot needs.",
      "AWS сохраняет все блоки, на которые ещё ссылаются более поздние snapshots; при удалении стираются только данные, не нужные ни одному другому snapshot.",
      "'True' assumes incremental snapshots form a fragile chain; EBS manages the shared blocks for you.",
      "Ответ «верно» предполагает хрупкую цепочку инкрементных копий; общими блоками EBS управляет сам."),
    qx("A gp3 data volume on a production server is running out of space. What can be done without detaching it?", "Grow it with Elastic Volumes, then extend the file system", [
      ["Nothing; an EBS volume's size is fixed once it is created", "Elastic Volumes can grow a volume while it is in use.", "Elastic Volumes позволяет увеличить том прямо во время работы."],
      ["Convert it to instance store, which grows on its own", "Volumes cannot become instance store, and instance store does not grow.", "Том нельзя превратить в instance store, и instance store сам не растёт."],
      ["Enable Multi-Attach so a second volume adds its space", "Multi-Attach shares one volume between instances; it adds no capacity.", "Multi-Attach делит один том между инстансами и места не добавляет."],
    ], "Elastic Volumes increases size (or changes type and IOPS) online; afterwards the file system is extended inside the OS to use the new space.", "Elastic Volumes увеличивает размер (или меняет тип и IOPS) на ходу; затем файловую систему расширяют внутри ОС, чтобы она заняла новое место."),
  ],
);

const p2 = part(
  "cc-l9-p2",
  { en: "Amazon S3, EFS, FSx and hybrid storage", ru: "Amazon S3, EFS, FSx и гибридное хранение" },
  {
    en: `## Amazon S3 beyond the basics
Lecture 3 covered buckets, URLs and the main classes. What the Cloud Foundations exam adds:
- **Object = data + metadata + key.** The **key** is the object's full name in the bucket, e.g. photos/2026/cat.jpg. The slashes only look like folders: the namespace is **flat**, and the console just shows prefixes as folders.
- S3 suits **flat files written once and read many times**: documents such as Word files, photos, videos, backups, logs, static website files. To change an object, you **upload it again** — S3 is not a disk for an OS or a database.
- **Durability 99.999999999% (11 nines)**: S3 keeps copies on many devices and, except the One Zone classes, in **at least three AZs** of the Region. **Durability** means data is not lost; **availability** means it can be read right now (S3 Standard: 99.99%).
- A bucket is created in **one Region**, and its data stays there unless you replicate it.
## Storage classes, including the Glacier family
| Class | Access pattern | First byte | Minimum storage |
|---|---|---|---|
| S3 Standard | frequent | milliseconds | none |
| S3 Intelligent-Tiering | unknown or changing | milliseconds | none |
| S3 Standard-IA | infrequent, but fast when needed | milliseconds, fee per GB read | 30 days |
| S3 One Zone-IA | infrequent, re-creatable, one AZ | milliseconds, fee per GB read | 30 days |
| S3 Glacier Instant Retrieval | archive opened about once a quarter | milliseconds | 90 days |
| S3 Glacier Flexible Retrieval | archive read a few times a year | minutes to 12 hours | 90 days |
| S3 Glacier Deep Archive | archive read once or twice a year | within 12 hours (bulk: 48) | 180 days |
The further down the table, the **cheaper the storage** and the **slower or more expensive the retrieval**.
## Lifecycle, versioning and replication
- **Lifecycle rules** cut costs automatically: **transition actions** move objects to a cheaper class after N days; **expiration actions** delete them.
= S3 Standard -> day 30 -> Standard-IA -> day 90 -> Glacier Flexible Retrieval -> day 365 -> expire
- **Versioning** keeps every version of an object: an overwrite creates a new version, and a delete only adds a **delete marker**, so accidental deletes and overwrites can be undone. Once enabled, versioning can be **suspended**, never fully turned off.
- **Replication**: **Cross-Region Replication (CRR)** copies new objects to a bucket in another Region (disaster recovery, compliance, lower latency); **Same-Region Replication (SRR)** stays in one Region. Both need **versioning on both buckets**.
## Security and pricing
- **Private by default**: new buckets have **Block Public Access** on, and new objects are **encrypted at rest** (SSE-S3). Access is granted with **IAM policies** and **bucket policies**; ACLs are legacy and off by default. A **presigned URL** gives temporary access to one object.
- You pay for **GB stored per month** (by class), **requests** (PUT, COPY, POST, LIST, GET), **retrieval** from IA and Glacier classes, and **data transfer out** of the Region. **Data transfer in is free**, as is transfer to CloudFront or to EC2 in the same Region.
## Amazon EFS — a shared file system for Linux
**Amazon EFS (Elastic File System)** is a fully managed **NFS file system** that **many Linux EC2 instances** can mount and **read and write at the same time**, across several AZs.
- **Elastic**: capacity **grows and shrinks automatically** as files are added and removed, up to petabytes, with **no provisioning and no disruption** to applications. You pay only for the storage used.
- **Regional** by default: data is stored redundantly in **several AZs** (EFS One Zone is a cheaper single-AZ option). Storage classes Standard, Infrequent Access and Archive, with lifecycle management for cold files.
- Instances reach EFS through **mount targets**: **one mount target per AZ**, in a subnet of that AZ. A mount target is a **network interface** with an IP address and a DNS name; its security group must allow **NFS, TCP 2049**, from the instances.
- Setup order: launch the EC2 instances → create the file system → create mount targets in the subnets → mount the file system on the instances → test.
= sudo mount -t efs fs-0123456789abcdef0:/ /mnt/efs
@diagram cc9-efs-mount-targets
> Exam picture: a VPC with three AZs, a **mount target (network interface)** in each private subnet, and unlabeled chip icons wired to the mount targets. Those icons are **EC2 instances** — the network interface is the part already labeled. An AZ may have a mount target that no instance uses yet.
## Amazon FSx — managed file systems for other worlds
| Service | Protocol | Typical use |
|---|---|---|
| FSx for Windows File Server | **SMB**, NTFS, **Microsoft Active Directory** | Windows apps on EC2, home folders, SharePoint, SQL Server |
| FSx for Lustre | Lustre, sub-millisecond latency, links to S3 | **HPC**, machine learning, video rendering |
| FSx for NetApp ONTAP | NFS, SMB and iSCSI | moving NetApp storage to AWS |
| FSx for OpenZFS | NFS | moving ZFS-based Linux file servers |
> Exam trap: **Windows + shared files + SMB → FSx for Windows File Server**. EFS speaks NFS and is not supported on Windows instances; EBS is one instance's disk; S3 is not a mounted file system.
## Hybrid storage and moving data
- **AWS Storage Gateway** connects **on-premises** apps to AWS storage, with a local cache for hot data: **S3 File Gateway** (NFS or SMB files stored as S3 objects), **Volume Gateway** (iSCSI block volumes backed up as EBS snapshots), **Tape Gateway** (a virtual tape library for existing backup software, archived to S3 Glacier).
- **AWS Snowball Edge** — a rugged device that AWS ships to you for **offline** transfer of terabytes to petabytes when the network would take too long; it can also run compute on site. Older slides also list Snowcone and the Snowmobile truck; AWS has retired both.
| Need | Choose |
|---|---|
| a boot or database disk for one instance | EBS (gp3; io2 for heavy I/O) |
| temporary scratch data on the fastest local disk | instance store |
| many Linux instances share files and write at once | EFS |
| Windows instances share files over SMB | FSx for Windows File Server |
| photos, documents, backups, static website, data lake | S3 |
| archive at the lowest cost | S3 Glacier Deep Archive |
| on-premises apps need cloud storage | Storage Gateway |
?? Ten Linux EC2 instances in one VPC must read and write the same files at the same time. EBS, EFS, S3 or instance store?
?= EFS: a shared NFS file system that all of them mount at once. EBS is one instance's disk, instance store is local and temporary, and S3 is object storage used through an API, not a mounted file system.
?? Why is S3 Glacier Deep Archive a poor choice for files needed every month?
?= It is built for data read once or twice a year: retrieval takes up to 12 hours, and objects are billed for at least 180 days.
?? What is an EFS mount target?
?= A network interface with an IP address in a subnet of one AZ; instances in that AZ mount the file system through it. You create one per AZ.`,
    ru: `## Amazon S3 сверх основ
В лекции 3 разобраны бакеты, URL и основные классы. Что добавляет экзамен Cloud Foundations:
- **Объект = данные + метаданные + ключ.** **Ключ (key)** — полное имя объекта в бакете, например photos/2026/cat.jpg. Косые черты лишь похожи на папки: пространство имён **плоское (flat)**, а консоль просто показывает префиксы как папки.
- S3 подходит для **плоских файлов, которые пишут один раз и читают много раз**: документы (например, файлы Word), фото, видео, резервные копии, логи, файлы статического сайта. Чтобы изменить объект, его **загружают заново** — S3 не диск для ОС или базы данных.
- **Durability 99,999999999% (11 девяток)**: S3 хранит копии на многих устройствах и, кроме классов One Zone, **минимум в трёх AZ** региона. **Durability (сохранность)** — данные не потеряются; **availability (доступность)** — их можно прочитать прямо сейчас (у S3 Standard — 99,99%).
- Бакет создаётся в **одном регионе**, и данные остаются там, пока их не реплицируют.
## Классы хранения, включая семейство Glacier
| Класс | Характер доступа | Первый байт | Минимальный срок |
|---|---|---|---|
| S3 Standard | частый | миллисекунды | нет |
| S3 Intelligent-Tiering | неизвестный или меняющийся | миллисекунды | нет |
| S3 Standard-IA | редкий, но быстрый, когда нужен | миллисекунды, плата за каждый прочитанный GB | 30 дней |
| S3 One Zone-IA | редкий, данные можно пересоздать, одна AZ | миллисекунды, плата за прочитанный GB | 30 дней |
| S3 Glacier Instant Retrieval | архив, который открывают примерно раз в квартал | миллисекунды | 90 дней |
| S3 Glacier Flexible Retrieval | архив, который читают несколько раз в год | от минут до 12 часов | 90 дней |
| S3 Glacier Deep Archive | архив, который читают раз-два в год | до 12 часов (bulk — до 48) | 180 дней |
Чем ниже по таблице, тем **дешевле хранение** и тем **медленнее или дороже извлечение**.
## Lifecycle, versioning и replication
- **Правила жизненного цикла (lifecycle rules)** экономят автоматически: **transition actions** переносят объекты в более дешёвый класс через N дней, **expiration actions** удаляют их.
= S3 Standard -> day 30 -> Standard-IA -> day 90 -> Glacier Flexible Retrieval -> day 365 -> expire
- **Versioning (версионирование)** хранит все версии объекта: перезапись создаёт новую версию, а удаление лишь ставит **delete marker**, поэтому случайное удаление или перезапись можно отменить. Включённое версионирование можно **приостановить (suspend)**, но не выключить совсем.
- **Репликация**: **Cross-Region Replication (CRR)** копирует новые объекты в бакет другого региона (аварийное восстановление, требования регуляторов, меньшая задержка); **Same-Region Replication (SRR)** работает внутри одного региона. Обеим нужно **versioning на обоих бакетах**.
## Безопасность и цены
- **Закрыто по умолчанию**: у новых бакетов включён **Block Public Access**, новые объекты **шифруются в покое** (SSE-S3). Доступ выдают через **IAM policies** и **bucket policies**; ACL устарели и по умолчанию выключены. **Presigned URL** даёт временный доступ к одному объекту.
- Платят за **хранимые GB в месяц** (по классу), **запросы** (PUT, COPY, POST, LIST, GET), **извлечение** из классов IA и Glacier и **исходящий трафик** из региона. **Входящий трафик бесплатен**, как и передача в CloudFront или в EC2 того же региона.
## Amazon EFS — общая файловая система для Linux
**Amazon EFS (Elastic File System)** — полностью управляемая **файловая система NFS**, которую **много Linux-инстансов EC2** монтируют и **одновременно читают и пишут**, в том числе из разных AZ.
- **Эластичная**: объём **растёт и сжимается автоматически** по мере добавления и удаления файлов, до петабайт, **без заблаговременного выделения места и без простоя** приложений. Платят только за занятое место.
- По умолчанию **региональная (Regional)**: данные хранятся избыточно в **нескольких AZ** (EFS One Zone — более дешёвый вариант в одной AZ). Классы хранения Standard, Infrequent Access и Archive; lifecycle management переносит холодные файлы.
- Инстансы обращаются к EFS через **mount targets**: **по одному mount target в каждой AZ**, в подсети этой AZ. Mount target — это **network interface (сетевой интерфейс)** с IP-адресом и DNS-именем; его security group должна пропускать **NFS, TCP 2049**, от инстансов.
- Порядок настройки: запустить инстансы EC2 → создать файловую систему → создать mount targets в подсетях → смонтировать файловую систему на инстансах → проверить.
= sudo mount -t efs fs-0123456789abcdef0:/ /mnt/efs
@diagram cc9-efs-mount-targets
> Картинка с экзамена: VPC с тремя AZ, в каждой частной подсети — **mount target (network interface)**, а к mount targets подключены квадратные значки-«чипы» без подписи. Эти значки — **инстансы EC2**: network interface на схеме уже подписан. В какой-то AZ может быть mount target, которым пока не пользуется ни один инстанс.
## Amazon FSx — управляемые файловые системы для других миров
| Сервис | Протокол | Типичное применение |
|---|---|---|
| FSx for Windows File Server | **SMB**, NTFS, **Microsoft Active Directory** | Windows-приложения на EC2, домашние папки, SharePoint, SQL Server |
| FSx for Lustre | Lustre, задержка меньше миллисекунды, связь с S3 | **HPC**, машинное обучение, рендеринг видео |
| FSx for NetApp ONTAP | NFS, SMB и iSCSI | перенос хранилищ NetApp в AWS |
| FSx for OpenZFS | NFS | перенос Linux-файловых серверов на ZFS |
> Ловушка экзамена: **Windows + общие файлы + SMB → FSx for Windows File Server**. EFS работает по NFS и на Windows-инстансах не поддерживается; EBS — диск одного инстанса; S3 — не монтируемая файловая система.
## Гибридное хранение и перенос данных
- **AWS Storage Gateway** соединяет **локальные (on-premises)** приложения с хранилищами AWS и держит горячие данные в локальном кэше: **S3 File Gateway** (файлы по NFS или SMB хранятся как объекты S3), **Volume Gateway** (блочные тома iSCSI с резервными копиями в виде EBS snapshots), **Tape Gateway** (виртуальная ленточная библиотека для привычного ПО резервного копирования, архив в S3 Glacier).
- **AWS Snowball Edge** — защищённое устройство, которое AWS присылает для **офлайн-переноса** терабайт и петабайт, когда по сети это заняло бы слишком много времени; на нём можно и запускать вычисления на месте. В старых слайдах есть ещё Snowcone и грузовик Snowmobile — AWS вывел из оборота оба.
| Задача | Выбор |
|---|---|
| загрузочный диск или диск БД для одного инстанса | EBS (gp3; io2 для тяжёлого ввода-вывода) |
| временные данные на самом быстром локальном диске | instance store |
| много Linux-инстансов делят файлы и пишут одновременно | EFS |
| Windows-инстансы делят файлы по SMB | FSx for Windows File Server |
| фото, документы, резервные копии, статический сайт, data lake | S3 |
| архив по самой низкой цене | S3 Glacier Deep Archive |
| локальным приложениям нужно облачное хранилище | Storage Gateway |
?? Десять Linux-инстансов EC2 в одном VPC должны одновременно читать и писать одни и те же файлы. EBS, EFS, S3 или instance store?
?= EFS: общая файловая система NFS, которую все они монтируют сразу. EBS — диск одного инстанса, instance store — локальный и временный, а S3 — объектное хранилище с доступом через API, а не смонтированная файловая система.
?? Почему S3 Glacier Deep Archive плохо подходит для файлов, нужных каждый месяц?
?= Он рассчитан на данные, которые читают раз-два в год: извлечение занимает до 12 часов, а объекты оплачиваются минимум за 180 дней.
?? Что такое mount target в EFS?
?= Сетевой интерфейс с IP-адресом в подсети одной AZ; через него инстансы этой AZ монтируют файловую систему. Создаётся по одному на каждую AZ.`,
  },
  [
    tfx("Amazon S3 is object storage that is well suited to storing flat files such as Microsoft Word documents and photos.", true,
      "S3 stores whole files as objects with metadata and a key — exactly right for documents, photos, videos and backups that are written once and read many times.",
      "S3 хранит файлы целиком как объекты с метаданными и ключом — как раз то, что нужно для документов, фото, видео и резервных копий, которые пишут один раз и читают много раз.",
      "'False' would fit an OS disk or a database file, which change in small blocks; ordinary flat files are S3's main use case.",
      "Ответ «неверно» подошёл бы для диска ОС или файлов БД, которые меняются мелкими блоками; обычные плоские файлы — главный сценарий S3."),
    qx("Which AWS service is designed for 99.999999999% (11 nines) durability of the data it stores?", "Amazon S3 (Simple Storage Service)", [
      ["Amazon EBS (Elastic Block Store)", "EBS volumes are replicated inside one AZ; their durability is far below 11 nines.", "Тома EBS реплицируются внутри одной AZ; их сохранность намного ниже 11 девяток."],
      ["Amazon EC2 (Elastic Compute Cloud)", "EC2 is compute, not a storage service with a durability target.", "EC2 — это вычисления, а не хранилище с целевой сохранностью."],
      ["Amazon VPC (Virtual Private Cloud)", "A VPC is a private network; it stores no data.", "VPC — частная сеть; данных она не хранит."],
    ], "S3 is designed for 11 nines of durability by keeping copies on many devices across at least three AZs.", "S3 рассчитан на сохранность в 11 девяток: копии хранятся на многих устройствах минимум в трёх AZ."),
    qx("An object is uploaded to a bucket with the key reports/2026/q1.pdf. What is 'reports/2026/' in S3?", "Part of the key; the console just shows it as folders", [
      ["A real folder tree stored as directories inside the bucket", "S3 has a flat namespace; there are no real directories, only key prefixes.", "У S3 плоское пространство имён: настоящих каталогов нет, есть только префиксы ключей."],
      ["A nested bucket inside the reports bucket", "Buckets cannot be placed inside other buckets.", "Бакет нельзя вложить в другой бакет."],
      ["A path on an EBS volume behind the bucket", "S3 is not built on a volume you can see; the key is just a name.", "S3 не построен на видимом вам томе; ключ — просто имя."],
    ], "The key is the object's full name. Slashes form a prefix that the console displays as folders, but the storage itself is flat.", "Ключ — полное имя объекта. Косые черты образуют префикс, который консоль показывает как папки, но само хранилище плоское."),
    tfx("Amazon EFS file systems can be mounted on Windows EC2 instances over the SMB protocol.", false,
      "EFS is an NFS file system for Linux instances and is not supported on Windows. Windows shared storage over SMB is Amazon FSx for Windows File Server.",
      "EFS — файловая система NFS для Linux-инстансов, на Windows она не поддерживается. Общее хранилище для Windows по SMB — это Amazon FSx for Windows File Server.",
      "'True' confuses EFS with FSx: only FSx for Windows File Server speaks SMB with Active Directory.",
      "Ответ «верно» путает EFS с FSx: по SMB с Active Directory работает только FSx for Windows File Server."),
    qx("What is the difference between durability and availability for Amazon S3?", "Durability is about not losing data; availability, about reading it now", [
      ["Durability is about read speed; availability, about the price per GB", "Neither term is about speed or price.", "Ни один из терминов не о скорости и не о цене."],
      ["Durability is about encryption; availability, about who has access", "Encryption and access control are security topics, not durability or availability.", "Шифрование и контроль доступа — это безопасность, а не сохранность или доступность."],
      ["They are two names for the same 11 nines guarantee", "11 nines is durability; S3 Standard availability is 99.99%.", "11 девяток — это сохранность; доступность S3 Standard — 99,99%."],
    ], "Durability (11 nines) means objects are not lost; availability (99.99% for S3 Standard) means they can be retrieved when requested.", "Durability (11 девяток) означает, что объекты не потеряются; availability (99,99% у S3 Standard) — что их можно получить по запросу."),
    qx("Medical scans are opened about once a quarter, but when a doctor opens one it must load in milliseconds. Which class costs the least while meeting this?", "S3 Glacier Instant Retrieval", [
      ["S3 Glacier Flexible Retrieval", "Retrieval takes minutes to hours, too slow for a waiting doctor.", "Извлечение занимает от минут до часов — слишком долго для ожидающего врача."],
      ["S3 Glacier Deep Archive", "Restores take up to 12 hours.", "Восстановление занимает до 12 часов."],
      ["S3 Standard", "It meets the speed but costs more to store data read only quarterly.", "По скорости подходит, но хранить данные, которые читают раз в квартал, тут дороже."],
    ], "Glacier Instant Retrieval is the cheapest class that still returns data in milliseconds, built for data accessed about once a quarter.", "Glacier Instant Retrieval — самый дешёвый класс, который всё ещё отдаёт данные за миллисекунды; он создан для данных, которые читают примерно раз в квартал."),
    qx("Project archives are read a few times a year. Waiting hours is usually fine, but now and then a file is needed within minutes. Which class fits best?", "S3 Glacier Flexible Retrieval", [
      ["S3 Glacier Deep Archive", "It is cheaper, but it has no minutes-level retrieval; restores take up to 12 hours.", "Он дешевле, но извлечения за минуты в нём нет: восстановление занимает до 12 часов."],
      ["S3 Standard-IA with lifecycle rules", "Standard-IA gives milliseconds but costs more to store archives read only a few times a year.", "Standard-IA отдаёт данные за миллисекунды, но хранить архив, который читают пару раз в год, тут дороже."],
      ["S3 Intelligent-Tiering", "It suits unknown access patterns; here the pattern is known and archival.", "Он для неизвестного характера доступа, а здесь доступ известен — архивный."],
    ], "Glacier Flexible Retrieval offers retrieval from minutes (expedited) to 12 hours (bulk) at archive prices.", "Glacier Flexible Retrieval даёт извлечение от минут (expedited) до 12 часов (bulk) по архивной цене."),
    qx("Logs are read often for 30 days, rarely for a year, and must then be deleted. What automates this with the least effort?", "An S3 Lifecycle rule: transition, then expiration", [
      ["S3 Versioning that adds a delete marker after a year", "Versioning keeps versions; it never moves objects between classes or deletes on a timer.", "Versioning хранит версии, но не переносит объекты между классами и не удаляет их по таймеру."],
      ["Cross-Region Replication to a cheaper Region", "Replication copies data — it adds cost and deletes nothing.", "Репликация копирует данные — это добавляет расходов и ничего не удаляет."],
      ["A bucket policy that denies GET after 30 days", "Policies control access; they do not change storage class or delete objects.", "Политики управляют доступом; класс хранения они не меняют и объекты не удаляют."],
    ], "Lifecycle transition actions move objects to cheaper classes after N days, and expiration actions delete them when they are no longer needed.", "Transition actions в lifecycle переносят объекты в более дешёвые классы через N дней, а expiration actions удаляют их, когда они больше не нужны."),
    qx("Versioning is enabled on a bucket. A user deletes an object without giving a version ID. What happens?", "S3 adds a delete marker; older versions can be restored", [
      ["The object and all its versions are erased for good", "A simple delete in a versioned bucket removes no versions.", "Простое удаление в бакете с версионированием не стирает ни одной версии."],
      ["The delete is refused until versioning is suspended", "Deletes are allowed; they just create a delete marker.", "Удалять можно; удаление просто создаёт delete marker."],
      ["The object moves to Glacier Deep Archive for 180 days", "Deletes never change the storage class.", "Удаление никогда не меняет класс хранения."],
    ], "With versioning, a delete adds a delete marker as the newest version; removing the marker or reading an older version brings the object back.", "При версионировании удаление добавляет delete marker как самую новую версию; если убрать marker или прочитать старую версию, объект вернётся."),
    qx("What must be enabled before S3 Cross-Region Replication can be set up?", "Versioning on the source and destination buckets", [
      ["Static website hosting on the destination bucket", "Website hosting serves pages; replication does not need it.", "Хостинг сайта отдаёт страницы; репликации он не нужен."],
      ["Transfer Acceleration on the source bucket", "Transfer Acceleration speeds up client uploads; it is not required for replication.", "Transfer Acceleration ускоряет загрузку клиентами; для репликации он не требуется."],
      ["Object Lock on the destination bucket only", "Object Lock is for write-once retention; it is optional for replication.", "Object Lock нужен для хранения без возможности изменения; для репликации он необязателен."],
    ], "Both CRR and SRR require versioning on the source and the destination bucket.", "И CRR, и SRR требуют versioning на исходном и целевом бакетах."),
    qx("Which of these S3 data transfers is free of charge?", "Data transferred into S3 from the internet", [
      ["Data transferred out of S3 to the internet", "Data transfer out to the internet is billed per GB.", "Исходящий трафик в интернет оплачивается за каждый GB."],
      ["Data replicated to a bucket in another Region", "Cross-Region transfer is billed.", "Передача между регионами оплачивается."],
      ["Retrieval of objects stored in Standard-IA", "IA classes charge a per-GB retrieval fee.", "Классы IA берут плату за каждый извлечённый GB."],
    ], "Inbound transfer to S3 is free; you pay for storage, requests, retrievals and data transferred out.", "Входящий трафик в S3 бесплатен; платят за хранение, запросы, извлечение и исходящий трафик."),
    qx("A new S3 bucket is created with default settings. Which statement is true?", "Block Public Access is on, so objects are not public", [
      ["Objects are public until a bucket policy blocks them", "It is the reverse: everything is private until access is granted.", "Наоборот: всё закрыто, пока доступ не выдан."],
      ["Anyone with the bucket URL can list its objects", "Listing needs permission; anonymous access is blocked by default.", "Для просмотра списка нужно разрешение; анонимный доступ по умолчанию закрыт."],
      ["Objects are stored unencrypted unless you enable it", "New objects are encrypted at rest with SSE-S3 by default.", "Новые объекты по умолчанию шифруются в покое через SSE-S3."],
    ], "New buckets are private: Block Public Access is on, ACLs are disabled and new objects are encrypted by default.", "Новые бакеты закрыты: Block Public Access включён, ACL выключены, новые объекты шифруются по умолчанию."),
    qx("Twelve Linux EC2 instances in one VPC must all read and write the same files at the same time. Which storage fits best?", "Amazon EFS", [
      ["Amazon EBS gp3 volume", "An EBS volume is a disk for one instance in one AZ.", "Том EBS — диск для одного инстанса в одной AZ."],
      ["Amazon S3", "S3 is object storage used through an API, not a shared file system with in-place writes.", "S3 — объектное хранилище с доступом через API, а не общая файловая система с записью на месте."],
      ["Instance store", "Instance store is local to one host and temporary.", "Instance store локален для одного хоста и временный."],
    ], "EFS is a shared NFS file system that many instances mount and write to at the same time.", "EFS — общая файловая система NFS, которую много инстансов монтируют и в которую одновременно пишут."),
    qx("Windows applications on EC2 need a shared file system with SMB and Active Directory integration. Which service is best?", "Amazon FSx for Windows File Server", [
      ["Amazon EFS with mount targets in each AZ", "EFS is NFS for Linux and is not supported on Windows.", "EFS — это NFS для Linux, на Windows он не поддерживается."],
      ["EBS Multi-Attach on an io2 volume", "Multi-Attach shares a raw block device in one AZ, not an SMB file share.", "Multi-Attach делит «сырой» блочный диск в одной AZ, а не SMB-ресурс."],
      ["Amazon S3 with a bucket policy", "S3 is object storage, not an SMB file system.", "S3 — объектное хранилище, а не файловая система SMB."],
    ], "FSx for Windows File Server provides fully managed SMB shares with NTFS and Active Directory for Windows workloads.", "FSx for Windows File Server даёт полностью управляемые SMB-ресурсы с NTFS и Active Directory для Windows-нагрузок."),
    qx("A market-data app scales its EC2 fleet up and down with demand, and every node needs the same datasets. Which benefit of Amazon EFS matters most here?", "Its capacity grows and shrinks with the files, without disruption", [
      ["It is the lowest-cost option for rarely read financial data", "Archive classes of S3 are far cheaper for rarely read data.", "Для редко читаемых данных архивные классы S3 намного дешевле."],
      ["It reads faster than local instance store for trading algorithms", "Local instance store is faster; EFS goes over the network.", "Локальный instance store быстрее; EFS работает через сеть."],
      ["It replicates data worldwide, so backups are no longer needed", "EFS is Regional, and replication never replaces backups.", "EFS региональный, а репликация никогда не заменяет резервные копии."],
    ], "EFS is elastic: storage scales automatically as files are added and removed, and every instance the fleet launches mounts the same data.", "EFS эластичен: хранилище масштабируется само по мере добавления и удаления файлов, и каждый новый инстанс монтирует те же данные."),
    qx("An exam diagram shows a VPC with three AZs. Each private subnet has an EFS mount target labeled 'network interface', and unlabeled chip icons are wired to the mount targets. What are the chip icons?", "EC2 instances that mount the file system", [
      ["Network interfaces belonging to the mount targets", "The network interface is the labeled part of the mount target; the icons connect to it.", "Network interface — это подписанная часть mount target; значки подключены к нему."],
      ["EBS volumes that cache EFS data", "EBS volumes do not connect to mount targets.", "Тома EBS к mount targets не подключаются."],
      ["VPC adapters that connect AZs", "There is no 'VPC adapter' component in AWS.", "Компонента «VPC adapter» в AWS не существует."],
    ], "The orange chip icon is the AWS symbol for an EC2 instance; instances mount EFS through the mount target in their own AZ.", "Оранжевый значок-«чип» — символ инстанса EC2 в AWS; инстансы монтируют EFS через mount target своей AZ."),
    qx("A Regional EFS file system is used from three AZs. How many mount targets are needed, and where?", "One per AZ, in a subnet of that AZ", [
      ["One for the whole VPC, in any subnet", "Instances use the mount target in their own AZ, so each AZ needs one.", "Инстансы ходят через mount target своей AZ, поэтому он нужен в каждой AZ."],
      ["One per EC2 instance that mounts it", "Many instances in an AZ share the same mount target.", "Много инстансов одной AZ используют один и тот же mount target."],
      ["One per Region, outside the VPC", "Mount targets are network interfaces inside the VPC's subnets.", "Mount targets — сетевые интерфейсы внутри подсетей VPC."],
    ], "You create one mount target in each AZ; all instances in that AZ mount the file system through it.", "В каждой AZ создают один mount target; все инстансы этой AZ монтируют файловую систему через него."),
    qx("EC2 instances time out when mounting EFS. The mount target's security group allows only SSH. What fixes it?", "Allow inbound NFS on TCP 2049 from the instances' group", [
      ["Allow inbound SMB on TCP 445 from the instances' group", "SMB is the Windows protocol used by FSx, not EFS.", "SMB — протокол Windows для FSx, а не для EFS."],
      ["Attach an Elastic IP address to every mount target interface", "Mount targets are reached privately inside the VPC; a public IP does not help.", "К mount targets обращаются приватно внутри VPC; публичный IP не поможет."],
      ["Add a 0.0.0.0/0 route to an internet gateway", "EFS traffic stays in the VPC; the problem is the blocked port.", "Трафик EFS не выходит из VPC; проблема в закрытом порте."],
    ], "EFS uses NFS on TCP port 2049, so the mount target's security group must allow it from the instances' security group.", "EFS работает по NFS на TCP-порте 2049, поэтому security group mount target должна пропускать его от security group инстансов."),
    qx("An on-premises backup application writes to tape. The company wants to keep the software but store the 'tapes' in AWS. Which service fits?", "Tape Gateway (AWS Storage Gateway)", [
      ["Amazon EFS with lifecycle to the Archive class", "Backup software that expects tapes cannot write to an NFS file system as tapes.", "ПО, которое ждёт ленты, не может писать в файловую систему NFS как в ленты."],
      ["A Snowball Edge device shipped every week", "Snowball is for one-off bulk transfers, not ongoing backups.", "Snowball — для разовых больших переносов, а не для постоянного резервного копирования."],
      ["Amazon FSx for Lustre linked to S3", "Lustre is an HPC file system, not a tape library.", "Lustre — файловая система для HPC, а не ленточная библиотека."],
    ], "Tape Gateway presents a virtual tape library to existing backup software and stores the tapes in S3 and S3 Glacier.", "Tape Gateway показывает привычному ПО резервного копирования виртуальную ленточную библиотеку и хранит ленты в S3 и S3 Glacier."),
    qx("A company must move 500 TB to AWS over a 100 Mbps internet link. What is the practical choice?", "Ship the data on AWS Snowball Edge devices", [
      ["Copy it through an S3 File Gateway over the link", "At 100 Mbps, 500 TB takes over a year; the gateway does not speed up the link.", "На 100 Мбит/с 500 ТБ передаются больше года; шлюз канал не ускоряет."],
      ["Attach EBS volumes to the on-premises servers", "EBS volumes attach only to EC2 instances.", "Тома EBS подключаются только к инстансам EC2."],
      ["Mount EFS on-premises over the internet", "EFS would still push 500 TB through the same slow link.", "С EFS те же 500 ТБ всё равно пойдут по тому же медленному каналу."],
    ], "500 TB × 8 = 4,000,000 Gb; at 0.1 Gbps that is about 460 days. Snowball Edge moves the data offline in days.", "500 ТБ × 8 = 4 000 000 Гбит; при 0,1 Гбит/с это около 460 дней. Snowball Edge переносит данные офлайн за несколько дней."),
  ],
);

const p3 = part(
  "cc-l9-p3",
  { en: "Managed databases, Amazon RDS, Aurora and Lab 5", ru: "Управляемые базы данных, Amazon RDS, Aurora и Lab 5" },
  {
    en: `## Unmanaged versus managed databases
- **Unmanaged** (self-managed): you install the database on an **EC2 instance**. AWS runs the hardware; **you** handle OS patches, database installation and patches, backups, replication, high availability and scaling. Choose it when you need full control of the OS or the engine.
- **Managed** (Amazon RDS, Aurora, DynamoDB, Redshift): AWS also takes over server maintenance, OS and database installation and patching, automated backups, high availability and scaling. **The customer** focuses on the **application**: designing the **schema and data structures**, writing and tuning queries, and managing **access controls** (security groups, database users, IAM).
| Task | Database on EC2 (unmanaged) | Amazon RDS (managed) |
|---|---|---|
| Power, racks, hardware | AWS | AWS |
| OS installation and patching | customer | AWS |
| Database installation and patching | customer | AWS, in the maintenance window |
| Backups | customer | AWS, automated |
| High availability and failover | customer builds it | AWS, with the Multi-AZ option |
| Scaling | customer | AWS, a few clicks |
| Schema, queries, indexes | customer | customer |
| Network access and DB users | customer | customer |
> Exam trap: with a fully managed database service the customer is responsible for **designing data structures and managing access controls** — not for provisioning, patching, scaling or backups.
## Amazon RDS
**Amazon RDS (Relational Database Service)** is a managed service to set up, operate and scale a **relational database**: tables, SQL, joins and transactions.
- The building block is the **DB instance** — an isolated database environment with an **instance class** (CPU and memory, e.g. db.t3.micro) and **EBS-based storage** (General Purpose SSD or Provisioned IOPS SSD).
- **Engines**: **Amazon Aurora** (MySQL- and PostgreSQL-compatible), **MySQL**, **PostgreSQL**, **MariaDB**, **Oracle** and **Microsoft SQL Server**; IBM Db2 was added in 2023.
- **Not RDS engines**: **Amazon Redshift** (a data warehouse), **DynamoDB** (NoSQL), MongoDB-style document databases and graph databases.
- A DB instance runs **inside your VPC**, normally in **private subnets**, behind a **security group**. A **DB subnet group** lists the subnets, in **at least two AZs**, where RDS may place it.
- **Automated backups**: a daily snapshot plus transaction logs, kept **1 to 35 days**, which allow a **point-in-time restore** to any second in that window, as a new DB instance. **Manual snapshots** stay until you delete them.
- **Engine patches** are applied in a weekly **maintenance window** that you choose.
## Multi-AZ deployments and read replicas
@diagram cc9-rds-multiaz
| | Multi-AZ deployment | Read replica |
|---|---|---|
| Goal | **high availability**: automatic failover | **scaling reads**: read-heavy apps, reports |
| Replication | **synchronous**, to a standby in another AZ | **asynchronous**, from the primary |
| Serves queries? | no, the standby only waits (classic Multi-AZ instance) | yes, read-only queries |
| If the primary fails | **automatic failover**: the same endpoint now points to the standby | no automatic failover; can be **promoted** by hand to a standalone database |
| Where | another AZ of the same Region | the same AZ, another AZ or another Region |
- On failover RDS repoints the **DNS endpoint** to the standby, which becomes the new primary — the app reconnects to the same name, usually within one or two minutes.
- Multi-AZ supports the **Reliability** pillar of the Well-Architected Framework. A newer option, the Multi-AZ DB cluster, has two standbys that can serve reads.
> Exam trap: "automatic failover to another AZ" → **Multi-AZ deployment**, not a read replica. "The primary is overloaded by reads" → **read replicas**. Provisioned IOPS makes storage faster but gives no failover.
## RDS pricing and when to use it
- You pay per **hour** that the DB instance runs (by engine and class, **On-Demand or Reserved**), plus **storage** per GB-month, backup storage beyond the free amount (equal to your database size), and **data transfer out**. **Multi-AZ costs about twice as much**: two instances run.
- RDS fits apps that need **complex transactions, joins and SQL** with medium-to-high query and write rates: web and mobile back ends, online shops, ERP and CRM.
- It fits worse for simple key-value access at huge scale (→ DynamoDB) or when full control of the OS or engine is needed (→ a database on EC2).
## Amazon Aurora
**Amazon Aurora** is AWS's own cloud-built relational engine, run through RDS and **compatible with MySQL and PostgreSQL**, so existing apps move with few changes.
- Up to **5 times the throughput of MySQL** and **3 times that of PostgreSQL** on the same hardware (AWS figures).
- Storage is a shared cluster volume that **grows automatically** and keeps **six copies of the data across three AZs**, with continuous backup to S3.
- Up to **15 Aurora Replicas** share that storage: they serve reads and take over as primary in a failover, usually in about 30 seconds. **Aurora Serverless** scales capacity automatically.
## Lab 5 — Build a database server
The lab adds an RDS MySQL database to a web app that already runs in the Lab VPC.
- **1. Security group** (DB Security Group): inbound rule **MySQL/Aurora, TCP 3306**, source = the **Web Security Group** — only the web servers can reach the database, nothing from the internet.
- **2. DB subnet group** (DB-Subnet-Group): the Lab VPC's **private subnets in two AZs**, 10.0.1.0/24 and 10.0.3.0/24.
- **3. RDS DB instance**: engine **MySQL**, template **Dev/Test**, **Multi-AZ DB instance**, identifier lab-db, master user main, a small burstable class, Lab VPC, DB Security Group, initial database name lab; automated backups and enhanced monitoring are turned off to launch faster. When the status is *Available*, the **endpoint** is copied.
- **4. Use it**: open the web server in a browser, choose RDS, enter the endpoint, database lab, user main and the password — the address book app now keeps its data in RDS, replicated to the standby in the second AZ.
= lab-db.abc123xyz.us-east-1.rds.amazonaws.com:3306
> Why the rule's source is a security group, not IP addresses: it automatically covers every web server in that group, even new ones with new IPs.
?? An RDS MySQL database must survive the loss of an AZ with no manual work. What is enabled, and what does the app connect to?
?= A Multi-AZ deployment. The app keeps the same DB endpoint, which RDS repoints to the standby during failover.
?? Why does the DB subnet group in Lab 5 contain subnets in two AZs?
?= RDS needs subnets in at least two AZs so it can place the primary and the Multi-AZ standby in different zones.
?? Heavy SELECT reports slow down the primary database. Which RDS feature helps?
?= Read replicas: the reports run against asynchronous read-only copies, and the primary keeps serving writes.`,
    ru: `## Неуправляемые и управляемые базы данных
- **Неуправляемая (unmanaged, self-managed)**: базу данных устанавливают на **инстанс EC2**. AWS отвечает за оборудование, а **клиент** — за патчи ОС, установку и патчи СУБД, резервные копии, репликацию, высокую доступность и масштабирование. Такой вариант выбирают, когда нужен полный контроль над ОС или движком.
- **Управляемая (managed)** — Amazon RDS, Aurora, DynamoDB, Redshift: AWS берёт на себя ещё и обслуживание серверов, установку и патчи ОС и СУБД, автоматические резервные копии, высокую доступность и масштабирование. **Клиент** сосредоточен на **приложении**: проектирует **схему и структуры данных**, пишет и оптимизирует запросы и управляет **доступом (access controls)** — security groups, пользователи БД, IAM.
| Задача | БД на EC2 (unmanaged) | Amazon RDS (managed) |
|---|---|---|
| Питание, стойки, оборудование | AWS | AWS |
| Установка и патчи ОС | клиент | AWS |
| Установка и патчи СУБД | клиент | AWS, в окно обслуживания |
| Резервные копии | клиент | AWS, автоматически |
| Высокая доступность и failover | клиент строит сам | AWS, опция Multi-AZ |
| Масштабирование | клиент | AWS, в несколько кликов |
| Схема, запросы, индексы | клиент | клиент |
| Сетевой доступ и пользователи БД | клиент | клиент |
> Ловушка экзамена: при полностью управляемой БД клиент отвечает за **проектирование структур данных и управление доступом** — а не за выделение ресурсов, патчи, масштабирование или резервные копии.
## Amazon RDS
**Amazon RDS (Relational Database Service)** — управляемый сервис, чтобы развернуть, эксплуатировать и масштабировать **реляционную базу данных**: таблицы, SQL, joins и транзакции.
- Основной элемент — **DB instance**: изолированная среда базы данных с **классом инстанса (instance class)** — CPU и память, например db.t3.micro, — и **хранилищем на EBS** (General Purpose SSD или Provisioned IOPS SSD).
- **Движки (engines)**: **Amazon Aurora** (совместим с MySQL и PostgreSQL), **MySQL**, **PostgreSQL**, **MariaDB**, **Oracle** и **Microsoft SQL Server**; в 2023 году добавился IBM Db2.
- **Не движки RDS**: **Amazon Redshift** (хранилище данных, data warehouse), **DynamoDB** (NoSQL), документные базы в духе MongoDB и графовые базы.
- DB instance работает **внутри вашего VPC**, обычно в **частных подсетях**, за **security group**. **DB subnet group** перечисляет подсети — минимум в **двух AZ**, — где RDS может разместить базу.
- **Автоматические резервные копии**: ежедневный snapshot плюс журналы транзакций, хранятся **от 1 до 35 дней** и позволяют сделать **point-in-time restore** на любую секунду этого окна — в виде нового DB instance. **Ручные snapshots** хранятся, пока их не удалят.
- **Патчи движка** ставятся в еженедельное **окно обслуживания (maintenance window)**, которое выбирает клиент.
## Multi-AZ и read replicas
@diagram cc9-rds-multiaz
| | Multi-AZ deployment | Read replica |
|---|---|---|
| Цель | **высокая доступность**: автоматический failover | **масштабирование чтения**: приложения с большим числом чтений, отчёты |
| Репликация | **синхронная**, в standby в другой AZ | **асинхронная**, с primary |
| Обслуживает запросы? | нет, standby только ждёт (классический Multi-AZ instance) | да, запросы только на чтение |
| Если primary отказал | **автоматический failover**: тот же endpoint теперь указывает на standby | автоматического failover нет; реплику можно вручную **повысить (promote)** до самостоятельной БД |
| Где | другая AZ того же региона | та же AZ, другая AZ или другой регион |
- При failover RDS перенаправляет **DNS endpoint** на standby, который становится новым primary, — приложение переподключается к тому же имени, обычно за одну-две минуты.
- Multi-AZ поддерживает принцип (pillar) **Reliability** в Well-Architected Framework. У более нового варианта, Multi-AZ DB cluster, два standby, которые могут обслуживать чтение.
> Ловушка экзамена: «автоматический failover в другую AZ» → **Multi-AZ deployment**, а не read replica. «Primary перегружен чтением» → **read replicas**. Provisioned IOPS ускоряет хранилище, но failover не даёт.
## Цены RDS и когда его выбирать
- Платят **за каждый час** работы DB instance (зависит от движка и класса, **On-Demand или Reserved**), плюс **хранилище** за GB в месяц, место под резервные копии сверх бесплатного объёма (равного размеру базы) и **исходящий трафик**. **Multi-AZ стоит примерно вдвое дороже**: работают два инстанса.
- RDS подходит приложениям, которым нужны **сложные транзакции, joins и SQL** при средней и высокой частоте запросов и записей: бэкенды сайтов и мобильных приложений, интернет-магазины, ERP и CRM.
- Хуже подходит для простого доступа по ключу в огромном масштабе (→ DynamoDB) или когда нужен полный контроль над ОС и движком (→ база на EC2).
## Amazon Aurora
**Amazon Aurora** — собственный реляционный движок AWS, созданный для облака; работает через RDS и **совместим с MySQL и PostgreSQL**, поэтому существующие приложения переходят с минимальными изменениями.
- До **5 раз выше пропускная способность, чем у MySQL**, и **до 3 раз — чем у PostgreSQL** на том же оборудовании (данные AWS).
- Хранилище — общий том кластера, который **растёт автоматически** и держит **шесть копий данных в трёх AZ**, с непрерывным резервным копированием в S3.
- До **15 Aurora Replicas** используют это хранилище: они обслуживают чтение и при failover становятся primary, обычно примерно за 30 секунд. **Aurora Serverless** масштабирует мощность автоматически.
## Lab 5 — Build a database server
В лабораторной к веб-приложению, которое уже работает в Lab VPC, добавляют базу RDS MySQL.
- **1. Security group** (DB Security Group): входящее правило **MySQL/Aurora, TCP 3306**, источник — **Web Security Group**: до базы могут достучаться только веб-серверы, из интернета — никто.
- **2. DB subnet group** (DB-Subnet-Group): **частные подсети Lab VPC в двух AZ** — 10.0.1.0/24 и 10.0.3.0/24.
- **3. RDS DB instance**: движок **MySQL**, шаблон **Dev/Test**, **Multi-AZ DB instance**, идентификатор lab-db, мастер-пользователь main, небольшой burstable-класс, Lab VPC, DB Security Group, начальная база lab; автоматические резервные копии и enhanced monitoring выключают, чтобы запуск шёл быстрее. Когда статус станет *Available*, копируют **endpoint**.
- **4. Использовать**: открыть веб-сервер в браузере, выбрать RDS, ввести endpoint, базу lab, пользователя main и пароль — приложение «адресная книга» теперь хранит данные в RDS с репликацией в standby во второй AZ.
= lab-db.abc123xyz.us-east-1.rds.amazonaws.com:3306
> Почему источник правила — security group, а не IP-адреса: правило автоматически охватывает любой веб-сервер этой группы, даже новый, с новым IP.
?? База RDS MySQL должна пережить потерю AZ без ручной работы. Что включают и к чему подключается приложение?
?= Multi-AZ deployment. Приложение продолжает использовать тот же DB endpoint, который RDS при failover перенаправляет на standby.
?? Зачем в DB subnet group из Lab 5 подсети в двух AZ?
?= RDS нужны подсети минимум в двух AZ, чтобы разместить primary и Multi-AZ standby в разных зонах.
?? Тяжёлые отчёты с SELECT замедляют primary. Какая функция RDS поможет?
?= Read replicas: отчёты выполняются на асинхронных копиях только для чтения, а primary продолжает обслуживать запись.`,
  },
  [
    qx("Which of the following is NOT a database engine that you can choose in Amazon RDS?", "Amazon Redshift", [
      ["MariaDB", "MariaDB is one of the RDS engines.", "MariaDB — один из движков RDS."],
      ["PostgreSQL", "PostgreSQL is an RDS engine (and Aurora is PostgreSQL-compatible too).", "PostgreSQL — движок RDS (и Aurora тоже совместима с PostgreSQL)."],
      ["Microsoft SQL Server", "SQL Server is an RDS engine, in several editions.", "SQL Server — движок RDS, в нескольких редакциях."],
    ], "Redshift is a separate data warehouse service. RDS engines are Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server and Db2.", "Redshift — отдельный сервис хранилища данных. Движки RDS: Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server и Db2."),
    qx("A company moves its database to a fully managed AWS database service. Which responsibilities stay with the customer?", "Designing data structures and managing access controls", [
      ["Provisioning, scaling, patching and taking backups", "These are exactly what a managed service takes over.", "Именно это и берёт на себя управляемый сервис."],
      ["Installing antivirus software on the database servers", "Customers have no access to the OS of managed database hosts.", "У клиента нет доступа к ОС хостов управляемой БД."],
      ["Replacing failed disks and maintaining server hardware", "Hardware is always AWS's job, even for unmanaged databases.", "Оборудование — всегда забота AWS, даже для неуправляемых баз."],
    ], "AWS runs the infrastructure, OS, engine, backups and scaling; the customer still owns the schema, the data and who may access it.", "AWS отвечает за инфраструктуру, ОС, движок, резервные копии и масштабирование; на клиенте остаются схема, данные и то, кому разрешён доступ."),
    qx("An e-commerce site runs on Amazon RDS for MySQL. The CTO wants automatic failover to another AZ if the primary database fails. What meets this?", "An RDS Multi-AZ deployment", [
      ["An RDS read replica in another AZ", "A read replica is asynchronous and has no automatic failover; it can only be promoted by hand.", "Read replica асинхронна и не даёт автоматического failover; её можно только вручную повысить."],
      ["RDS Provisioned IOPS storage", "Provisioned IOPS speeds up storage but adds no standby.", "Provisioned IOPS ускоряет хранилище, но standby не добавляет."],
      ["A DynamoDB global table", "That is a different, NoSQL database, not a failover for RDS MySQL.", "Это другая, NoSQL-база, а не failover для RDS MySQL."],
    ], "Multi-AZ keeps a synchronous standby in another AZ and fails over to it automatically, behind the same endpoint.", "Multi-AZ держит синхронный standby в другой AZ и автоматически переключается на него за тем же endpoint."),
    qx("A news site on RDS for PostgreSQL gets 20 times more reads than writes, and SELECT queries overload the primary. What helps most?", "Add read replicas and send read traffic to them", [
      ["Enable Multi-AZ so that the standby answers reads", "In a classic Multi-AZ instance the standby serves no traffic.", "В классическом Multi-AZ instance standby не обслуживает запросы."],
      ["Take manual DB snapshots every hour to offload reads", "Snapshots are backups; they do not answer queries.", "Snapshots — резервные копии, на запросы они не отвечают."],
      ["Move the tables into Amazon S3 Glacier", "Glacier is an archive with slow retrieval, not a database.", "Glacier — архив с медленным извлечением, а не база данных."],
    ], "Read replicas are asynchronous read-only copies; spreading SELECT traffic over them scales reads and frees the primary.", "Read replicas — асинхронные копии только для чтения; если распределить по ним SELECT-запросы, чтение масштабируется, а primary разгружается."),
    qx("How does data reach a Multi-AZ standby compared with a read replica?", "Standby: synchronously; read replica: asynchronously", [
      ["Standby: asynchronously; read replica: synchronously", "It is the other way round.", "Всё ровно наоборот."],
      ["Both get their data from nightly snapshot restores", "Both are fed continuously, not by restoring snapshots.", "Обе копии получают данные непрерывно, а не через восстановление snapshots."],
      ["Both are synchronous and live in the primary's AZ", "The standby must be in another AZ; replicas are asynchronous.", "Standby обязан быть в другой AZ; реплики асинхронны."],
    ], "Synchronous replication makes the standby an exact copy for failover; asynchronous replication lets replicas lag slightly but scale reads.", "Синхронная репликация делает standby точной копией для failover; асинхронная допускает небольшое отставание реплик, но масштабирует чтение."),
    qx("After an RDS Multi-AZ failover, what must the application change to reach the database?", "Nothing; the same endpoint now points to the new primary", [
      ["Its connection string, to the standby's own IP address", "RDS repoints the DNS endpoint; apps should never use the IP.", "RDS перенаправляет DNS endpoint; приложения не должны использовать IP."],
      ["Its Region setting, because failover moves the DB to another Region", "Multi-AZ fails over inside the same Region.", "Multi-AZ переключается внутри того же региона."],
      ["Its port, from 3306 to the standby's port 3307", "The port does not change in a failover.", "Порт при failover не меняется."],
    ], "Failover flips the DNS record of the DB endpoint to the standby, so applications just reconnect to the same name.", "При failover DNS-запись endpoint переключается на standby, и приложения просто заново подключаются к тому же имени."),
    qx("A team deploys its Amazon RDS DB instance across multiple Availability Zones. Which Well-Architected pillar does this mainly support?", "Reliability", [
      ["Cost Optimization", "Multi-AZ roughly doubles the cost; it is not a saving.", "Multi-AZ примерно удваивает стоимость — это не экономия."],
      ["Security", "Spreading across AZs protects against failures, not attackers.", "Размещение в нескольких AZ защищает от сбоев, а не от злоумышленников."],
      ["Performance Efficiency", "The standby does not add read or write capacity.", "Standby не добавляет мощности ни на чтение, ни на запись."],
    ], "Surviving an AZ failure with automatic failover is about the workload recovering from failures — the Reliability pillar.", "Пережить отказ AZ с автоматическим failover — это способность нагрузки восстанавливаться после сбоев, то есть pillar Reliability."),
    qx("Rows were deleted by mistake at 14:05. Automated backups are on with a 7-day retention. What can bring the data back?", "A point-in-time restore to 14:04, as a new DB instance", [
      ["Promoting the Multi-AZ standby, which still has the rows", "Replication is synchronous: the standby deleted the rows at the same moment.", "Репликация синхронная: в standby строки удалились в тот же момент."],
      ["Copying the rows from a read replica, which keeps old data", "A replica lags by seconds at most; the delete reaches it too.", "Реплика отстаёт максимум на секунды — удаление дойдёт и до неё."],
      ["Asking AWS Support to undo the transaction log", "Support does not undo customer changes; the backups are yours to use.", "Поддержка не отменяет изменения клиента; резервными копиями пользуется сам клиент."],
    ], "Automated backups (daily snapshot + transaction logs) allow restoring to any second in the retention period; RDS creates a new DB instance.", "Автоматические резервные копии (ежедневный snapshot + журналы транзакций) позволяют восстановиться на любую секунду срока хранения; RDS создаёт новый DB instance."),
    qx("A team needs a database engine with custom OS-level plug-ins that RDS does not offer. Which option fits?", "Run the database on EC2 and manage it themselves", [
      ["Use Amazon Aurora, which accepts any custom plug-in", "Aurora is managed: there is no OS access for custom plug-ins.", "Aurora управляемая: доступа к ОС для своих плагинов нет."],
      ["Use Amazon Redshift for OS-level customization", "Redshift is a managed data warehouse, not a customizable host.", "Redshift — управляемое хранилище данных, а не настраиваемый хост."],
      ["Ask RDS to install the plug-ins during maintenance", "RDS patches its supported engines; it does not install your software.", "RDS ставит патчи на свои движки, а ваше ПО не устанавливает."],
    ], "Full control of the OS and engine means an unmanaged database on EC2 — with all the patching, backups and HA work that comes with it.", "Полный контроль над ОС и движком — это неуправляемая база на EC2, со всеми патчами, резервными копиями и высокой доступностью на клиенте."),
    qx("Why does an RDS DB subnet group need subnets in at least two Availability Zones?", "So RDS can put a standby or new instance in another AZ", [
      ["So the database gets a public IP address in each AZ", "Subnet groups say nothing about public IPs; lab databases stay private.", "Subnet group ничего не говорит о публичных IP; база в лабораторной остаётся частной."],
      ["So read replicas can be created in another Region", "Cross-Region replicas use a subnet group in that other Region.", "Реплики в другом регионе используют subnet group того региона."],
      ["So the security group can open port 3306 to the internet", "Security groups are separate from subnet groups; nothing is opened to the internet.", "Security groups — отдельная вещь от subnet groups; ничего в интернет не открывается."],
    ], "RDS chooses subnets from the group; two AZs let it place the Multi-AZ standby, or a replacement instance, in a different zone.", "RDS выбирает подсети из группы; две AZ позволяют разместить Multi-AZ standby или замену инстанса в другой зоне."),
    qx("In Lab 5, which inbound rule is added to the DB Security Group?", "MySQL/Aurora TCP 3306 from the Web Security Group", [
      ["MySQL/Aurora TCP 3306 from anywhere, 0.0.0.0/0", "That would open the database to the whole internet.", "Так база открылась бы всему интернету."],
      ["HTTP TCP 80 from the Web Security Group only", "The database listens on 3306, not on HTTP.", "База слушает порт 3306, а не HTTP."],
      ["All traffic from the internet gateway of the Lab VPC", "An internet gateway is not a source for rules and would expose the DB.", "Internet gateway не бывает источником правила, и так база оказалась бы открыта."],
    ], "Only instances in the Web Security Group may connect to MySQL on port 3306 — the web tier talks to the DB, nobody else does.", "Подключаться к MySQL на порт 3306 могут только инстансы из Web Security Group: с базой говорит веб-уровень и больше никто."),
    qx("Why does Lab 5 use the Web Security Group as the rule's source instead of the web servers' IP addresses?", "The rule covers any server in that group, even new ones", [
      ["Security group rules cannot use IP addresses as a source", "They can use CIDR ranges; a group reference is simply better here.", "CIDR-диапазоны использовать можно; ссылка на группу здесь просто удобнее."],
      ["It makes the database reachable from the internet too", "It does the opposite: only members of the web group get in.", "Наоборот: пускают только участников веб-группы."],
      ["RDS requires the source to be its own security group", "There is no such requirement; the source here is a different group.", "Такого требования нет; источник здесь — другая группа."],
    ], "Referencing a security group follows the instances, so new or replaced web servers with new IPs are allowed automatically.", "Ссылка на security group следует за инстансами, поэтому новые или заменённые веб-серверы с новыми IP допускаются автоматически."),
    qx("Which subnets are put into DB-Subnet-Group in Lab 5?", "The private subnets in two different AZs", [
      ["The public subnets, so the app can reach the DB", "The app reaches the DB inside the VPC; the DB belongs in private subnets.", "Приложение обращается к базе внутри VPC; базе место в частных подсетях."],
      ["One private subnet, because Multi-AZ is optional", "A DB subnet group needs subnets in at least two AZs.", "DB subnet group требует подсетей минимум в двух AZ."],
      ["Every subnet in the Region, across all VPCs", "A subnet group belongs to one VPC.", "Subnet group принадлежит одному VPC."],
    ], "The lab uses the private subnets 10.0.1.0/24 and 10.0.3.0/24, in two AZs, so the database is not exposed and Multi-AZ is possible.", "В лабораторной берут частные подсети 10.0.1.0/24 и 10.0.3.0/24 в двух AZ: база не открыта наружу, и Multi-AZ возможен."),
    qx("In Lab 5, what does the web application need in order to connect to the new RDS database?", "The DB endpoint, database name, user and password", [
      ["The private IP of the primary host, plus its SSH key", "There is no SSH to RDS hosts, and IPs change on failover.", "SSH к хостам RDS нет, а IP при failover меняются."],
      ["The DB instance ID and the AWS account root password", "Root credentials are never used by applications.", "Приложения никогда не используют учётные данные root."],
      ["The ARN of the DB subnet group and an IAM access key", "The subnet group ARN is not a connection target.", "ARN subnet group — не адрес для подключения."],
    ], "Apps connect to the DNS endpoint (port 3306) with the database name lab and the master user's credentials.", "Приложение подключается к DNS endpoint (порт 3306) с именем базы lab и учётными данными мастер-пользователя."),
    qx("Which statement describes Amazon Aurora?", "MySQL/PostgreSQL-compatible, with six copies across 3 AZs", [
      ["A NoSQL key-value store with single-digit millisecond latency", "That describes DynamoDB.", "Это описание DynamoDB."],
      ["A columnar data warehouse for petabyte-scale analytics", "That describes Redshift.", "Это описание Redshift."],
      ["An in-memory Redis cache placed in front of RDS queries", "That describes ElastiCache.", "Это описание ElastiCache."],
    ], "Aurora is AWS's relational engine, compatible with MySQL and PostgreSQL, with self-growing storage that keeps six copies in three AZs.", "Aurora — реляционный движок AWS, совместимый с MySQL и PostgreSQL; хранилище растёт само и держит шесть копий в трёх AZ."),
    tfx("In a classic RDS Multi-AZ DB instance deployment, the standby can serve read-only queries to take load off the primary.", false,
      "The standby only receives synchronous updates and waits for a failover; for read scaling you add read replicas.",
      "Standby лишь получает синхронные обновления и ждёт failover; для масштабирования чтения добавляют read replicas.",
      "'True' mixes up the standby with a read replica (or with the newer Multi-AZ DB cluster, which is a different option).",
      "Ответ «верно» путает standby с read replica (или с более новым Multi-AZ DB cluster — это другой вариант)."),
    tfx("An Amazon RDS read replica can be created in a different AWS Region from its primary database.", true,
      "Cross-Region read replicas serve local reads in another Region and can be promoted for disaster recovery.",
      "Read replicas в другом регионе обслуживают локальное чтение там и могут быть повышены для аварийного восстановления.",
      "'False' confuses read replicas with the Multi-AZ standby, which must stay in the same Region.",
      "Ответ «неверно» путает read replicas с Multi-AZ standby, который обязан оставаться в том же регионе."),
    qx("How does running an RDS DB instance as Multi-AZ change its cost compared with Single-AZ?", "It costs about twice as much: there are two instances", [
      ["It is free, because AWS provides the standby", "The standby is a real instance with storage, and it is billed.", "Standby — настоящий инстанс с хранилищем, и он оплачивается."],
      ["It costs the same, as only one instance runs at a time", "Both instances run all the time; the standby is always on.", "Оба инстанса работают постоянно: standby всегда включён."],
      ["It is cheaper, because traffic is split across AZs", "Traffic is not split; the standby serves nothing until failover.", "Трафик не делится: до failover standby ничего не обслуживает."],
    ], "Multi-AZ adds a second, always-running standby instance and its storage, so the price roughly doubles.", "Multi-AZ добавляет второй, постоянно работающий инстанс-standby с хранилищем, поэтому цена примерно удваивается."),
    qx("Which workload is the best fit for Amazon RDS rather than DynamoDB?", "Orders with joins across tables and multi-row transactions", [
      ["Session data read by key at millions of requests per second", "Simple key access at huge scale is DynamoDB's strength.", "Простой доступ по ключу в огромном масштабе — сильная сторона DynamoDB."],
      ["Shopping-cart items fetched only by user ID at huge scale", "Lookups by one key at scale fit DynamoDB better.", "Выборки по одному ключу в большом масштабе лучше подходят DynamoDB."],
      ["Game leaderboards keyed by player with single-digit ms reads", "Key-based, low-latency access is a classic DynamoDB case.", "Доступ по ключу с низкой задержкой — классический сценарий DynamoDB."],
    ], "Relational databases shine at complex queries with joins and transactions across many rows and tables.", "Реляционные базы сильны в сложных запросах с joins и транзакциях по многим строкам и таблицам."),
    qx("Who applies database engine patches to an RDS DB instance, and when?", "AWS does, during the maintenance window you choose", [
      ["You do, by connecting to the host over SSH", "RDS gives no OS or SSH access to its hosts.", "RDS не даёт доступа к ОС и SSH своих хостов."],
      ["AWS does, at random times without any notice", "Patching happens in the chosen weekly maintenance window.", "Патчи ставятся в выбранное еженедельное окно обслуживания."],
      ["AWS does, but only after you open a support case", "Patching is part of the managed service; no case is needed.", "Патчи — часть управляемого сервиса; обращение в поддержку не нужно."],
    ], "Patching is AWS's job in a managed service, scheduled in the weekly maintenance window (with Multi-AZ, the standby is patched first).", "Патчи в управляемом сервисе — забота AWS, по расписанию в еженедельное окно обслуживания (при Multi-AZ сначала патчат standby)."),
  ],
);

const p4 = part(
  "cc-l9-p4",
  { en: "DynamoDB, Redshift and choosing a database", ru: "DynamoDB, Redshift и выбор базы данных" },
  {
    en: `## Relational versus non-relational
| | Relational (SQL): RDS, Aurora | Non-relational (NoSQL): DynamoDB |
|---|---|---|
| Data model | tables with fixed columns (a schema) | items with flexible attributes; only the key is fixed |
| Access | SQL queries with joins | API calls by key: GetItem, Query, Scan |
| Scaling | mostly a bigger instance, plus read replicas | horizontal: data spreads over partitions automatically |
| Best for | complex relationships and transactions | huge scale, simple access by key, low latency |
## Amazon DynamoDB
**Amazon DynamoDB** is a fully managed, **serverless NoSQL** database for **key-value and document** data with **single-digit millisecond** latency at any scale.
- No servers to manage: data sits on SSDs, is **replicated across three AZs** of the Region automatically and is encrypted at rest by default.
- **Table** → **items** (like rows, up to 400 KB each) → **attributes** (like columns). Items of one table may have different attributes.
- The **primary key** is unique and is the only part of the schema that must be defined:
- **Partition key** only (simple key), e.g. UserId. DynamoDB hashes it to choose the partition that stores the item.
- **Partition key + sort key** (composite key), e.g. UserId + OrderDate: many items share one partition key and are kept sorted by the sort key.
| UserId (partition key) | OrderDate (sort key) | Total | Status |
|---|---|---|---|
| u-17 | 2026-09-01 | 40 | shipped |
| u-17 | 2026-10-02 | 15 | new |
| u-42 | 2026-10-03 | 99 | new |
## Reading data: GetItem, Query, Scan
| Operation | What it reads | Cost |
|---|---|---|
| **GetItem** | **one item** by its **full primary key** (partition key, plus sort key if the table has one) | cheapest |
| **Query** | items with **one partition key value**, optionally with a sort key condition (e.g. dates in October); works on a table or an index | efficient |
| **Scan** | **every item** in the table or index; a filter is applied after reading | slowest, uses the most capacity |
| **PutItem, UpdateItem, DeleteItem** | write, change or delete one item by its key | per item |
= aws dynamodb get-item --table-name Orders --key '{"UserId":{"S":"u-17"},"OrderDate":{"S":"2026-09-01"}}'
= aws dynamodb query --table-name Orders --key-condition-expression "UserId = :u" --expression-attribute-values '{":u":{"S":"u-17"}}'
- To find items by an attribute that is **not part of the key** (Status = new), the table has to be read with a **Scan** plus a filter. If that search is frequent, add a **secondary index** on the attribute and **Query** the index.
- **Global secondary index (GSI)**: a different partition key (and optional sort key); it can be added at any time. **Local secondary index (LSI)**: the same partition key with a different sort key; it must be defined when the table is created.
> Exam trap: "find an item by an attribute other than the primary key" → **Scan**. Query needs the partition key value, and GetItem needs the full key.
## Capacity, consistency, global tables, access
- **Capacity modes**: **on-demand** — pay per request, no planning, for unpredictable traffic; **provisioned** — set read and write capacity units, optionally with auto scaling, cheaper for steady traffic.
- Reads are **eventually consistent** by default; a **strongly consistent** read can be requested (on the table or an LSI, not on a GSI).
- **Global tables**: multi-Region, **multi-active** replication — users in each Region read and write locally.
- **Point-in-time recovery** (up to 35 days) and on-demand backups; **TTL** deletes expired items automatically; **DAX** (DynamoDB Accelerator) is an in-memory cache with microsecond reads.
- **Access** goes through IAM: an app on EC2 should get an **IAM role** attached to the instance (temporary credentials) — never root credentials or access keys stored on the server.
## Amazon Redshift — the data warehouse
**Amazon Redshift** is a fully managed, **petabyte-scale data warehouse** for **analytics (OLAP)** with standard SQL and BI tools.
- **Columnar storage** and **massively parallel processing (MPP)**: a **leader node** plans each query, and **compute nodes** run it in parallel. **Redshift Serverless** removes cluster management.
- **Redshift Spectrum** queries data directly in S3 without loading it.
- Redshift is **not an RDS engine** and not for OLTP: it serves reports over large historical data, not the order form of an online shop.
| | OLTP | OLAP |
|---|---|---|
| Work | many short transactions: save an order, update an address | few heavy queries over huge data: sales per region per year |
| AWS | RDS, Aurora, DynamoDB | Redshift |
## Other purpose-built databases and migration
- **Amazon ElastiCache** — an in-memory cache (Valkey, Redis OSS, Memcached) in front of a database for hot data.
- **Amazon Neptune** — a graph database: social networks, recommendations, fraud detection.
- **Amazon DocumentDB** — a MongoDB-compatible document database.
- **AWS DMS (Database Migration Service)** moves databases to AWS with **minimal downtime**: the source keeps working while changes are replicated continuously. Migrations are **homogeneous** (Oracle → Oracle on RDS) or **heterogeneous** (Oracle → Aurora PostgreSQL); for heterogeneous ones, the schema is converted first (AWS Schema Conversion Tool or DMS Schema Conversion).
| Need | Service |
|---|---|
| relational app: SQL, joins, transactions | Amazon RDS |
| relational, more speed and availability, MySQL or PostgreSQL | Amazon Aurora |
| key-value access at any scale, millisecond latency, no servers | Amazon DynamoDB |
| analytics over terabytes to petabytes, BI reports | Amazon Redshift |
| hot data cached in memory | Amazon ElastiCache |
| full control of the engine and the OS | a database on EC2 |
| move an existing database to AWS | AWS DMS |
?? A table has partition key UserId. All items with City = Almaty are needed. Which operation works on the table as it is, and what would make the search efficient?
?= A Scan with a filter on City. For frequent searches, add a global secondary index on City and Query it.
?? Five years of sales data from several systems must feed yearly reports. RDS, DynamoDB or Redshift?
?= Redshift: a columnar data warehouse built for OLAP queries over large historical data.
?? Why should an app on EC2 use an IAM role, not access keys, to reach DynamoDB?
?= The role gives temporary credentials that rotate automatically; keys stored on the instance can leak and do not expire by themselves.`,
    ru: `## Реляционные и нереляционные базы
| | Реляционные (SQL): RDS, Aurora | Нереляционные (NoSQL): DynamoDB |
|---|---|---|
| Модель данных | таблицы с фиксированными столбцами (схема) | items с гибкими атрибутами; фиксирован только ключ |
| Доступ | SQL-запросы с joins | вызовы API по ключу: GetItem, Query, Scan |
| Масштабирование | в основном инстанс побольше плюс read replicas | горизонтальное: данные автоматически распределяются по партициям |
| Лучше всего для | сложных связей и транзакций | огромного масштаба, простого доступа по ключу, низкой задержки |
## Amazon DynamoDB
**Amazon DynamoDB** — полностью управляемая **бессерверная (serverless) NoSQL**-база для данных вида **ключ-значение и документов** с задержкой **в единицы миллисекунд** при любом масштабе.
- Серверами управлять не нужно: данные лежат на SSD, **автоматически реплицируются в три AZ** региона и по умолчанию шифруются в покое.
- **Таблица (table)** → **items** (как строки, до 400 KB каждый) → **атрибуты (attributes)** (как столбцы). У items одной таблицы могут быть разные атрибуты.
- **Первичный ключ (primary key)** уникален, и это единственная часть схемы, которую обязательно задают:
- Только **partition key** (простой ключ), например UserId. DynamoDB хеширует его и по нему выбирает партицию, где хранится item.
- **Partition key + sort key** (составной ключ), например UserId + OrderDate: много items с одним partition key хранятся отсортированными по sort key.
| UserId (partition key) | OrderDate (sort key) | Total | Status |
|---|---|---|---|
| u-17 | 2026-09-01 | 40 | shipped |
| u-17 | 2026-10-02 | 15 | new |
| u-42 | 2026-10-03 | 99 | new |
## Чтение данных: GetItem, Query, Scan
| Операция | Что читает | Цена |
|---|---|---|
| **GetItem** | **один item** по **полному первичному ключу** (partition key и sort key, если он есть в таблице) | самая дешёвая |
| **Query** | items с **одним значением partition key**, при желании с условием на sort key (например, даты в октябре); работает с таблицей или индексом | эффективная |
| **Scan** | **все items** таблицы или индекса; фильтр применяется уже после чтения | самая медленная, тратит больше всего capacity |
| **PutItem, UpdateItem, DeleteItem** | записать, изменить или удалить один item по ключу | за item |
= aws dynamodb get-item --table-name Orders --key '{"UserId":{"S":"u-17"},"OrderDate":{"S":"2026-09-01"}}'
= aws dynamodb query --table-name Orders --key-condition-expression "UserId = :u" --expression-attribute-values '{":u":{"S":"u-17"}}'
- Чтобы найти items по атрибуту, который **не входит в ключ** (Status = new), таблицу приходится читать через **Scan** с фильтром. Если такой поиск частый, добавляют **вторичный индекс (secondary index)** по этому атрибуту и делают **Query** по индексу.
- **Global secondary index (GSI)**: другой partition key (и при желании sort key); его можно добавить в любой момент. **Local secondary index (LSI)**: тот же partition key с другим sort key; задаётся только при создании таблицы.
> Ловушка экзамена: «найти item по атрибуту, который не является первичным ключом» → **Scan**. Query нужно значение partition key, а GetItem — полный ключ.
## Capacity, согласованность, global tables, доступ
- **Режимы ёмкости (capacity modes)**: **on-demand** — оплата за каждый запрос, без планирования, для непредсказуемого трафика; **provisioned** — задают единицы ёмкости на чтение и запись, при желании с auto scaling, дешевле при ровном трафике.
- Чтение по умолчанию **eventually consistent (согласованное в итоге)**; можно запросить **strongly consistent (строго согласованное)** чтение — на таблице или LSI, но не на GSI.
- **Global tables**: репликация между регионами в режиме **multi-active** — пользователи в каждом регионе читают и пишут локально.
- **Point-in-time recovery** (до 35 дней) и резервные копии по запросу; **TTL** автоматически удаляет устаревшие items; **DAX** (DynamoDB Accelerator) — кэш в памяти с чтением за микросекунды.
- **Доступ** идёт через IAM: приложению на EC2 выдают **IAM role**, подключённую к инстансу (временные учётные данные), — и никогда не учётные данные root или ключи доступа, сохранённые на сервере.
## Amazon Redshift — хранилище данных
**Amazon Redshift** — полностью управляемое **хранилище данных (data warehouse) петабайтного масштаба** для **аналитики (OLAP)** на стандартном SQL и с BI-инструментами.
- **Колоночное хранение (columnar storage)** и **массово-параллельная обработка (MPP)**: **leader node** планирует каждый запрос, а **compute nodes** выполняют его параллельно. **Redshift Serverless** избавляет от управления кластером.
- **Redshift Spectrum** выполняет запросы прямо к данным в S3, без их загрузки.
- Redshift — **не движок RDS** и не для OLTP: он нужен для отчётов по большим историческим данным, а не для формы заказа интернет-магазина.
| | OLTP | OLAP |
|---|---|---|
| Работа | много коротких транзакций: сохранить заказ, обновить адрес | немного тяжёлых запросов по огромным данным: продажи по регионам за год |
| AWS | RDS, Aurora, DynamoDB | Redshift |
## Другие специализированные базы и миграция
- **Amazon ElastiCache** — кэш в памяти (Valkey, Redis OSS, Memcached) перед базой данных для горячих данных.
- **Amazon Neptune** — графовая база: социальные сети, рекомендации, выявление мошенничества.
- **Amazon DocumentDB** — документная база, совместимая с MongoDB.
- **AWS DMS (Database Migration Service)** переносит базы в AWS с **минимальным простоем**: исходная база продолжает работать, а изменения непрерывно реплицируются. Миграции бывают **однородные (homogeneous)** — Oracle → Oracle в RDS — и **разнородные (heterogeneous)** — Oracle → Aurora PostgreSQL; для разнородных сначала конвертируют схему (AWS Schema Conversion Tool или DMS Schema Conversion).
| Задача | Сервис |
|---|---|
| реляционное приложение: SQL, joins, транзакции | Amazon RDS |
| реляционная база, больше скорости и доступности, MySQL или PostgreSQL | Amazon Aurora |
| доступ по ключу в любом масштабе, миллисекунды, без серверов | Amazon DynamoDB |
| аналитика по терабайтам и петабайтам, BI-отчёты | Amazon Redshift |
| горячие данные в кэше в памяти | Amazon ElastiCache |
| полный контроль над движком и ОС | база данных на EC2 |
| перенести существующую базу в AWS | AWS DMS |
?? У таблицы partition key — UserId. Нужны все items с City = Almaty. Какая операция сработает на таблице как есть и что сделает поиск эффективным?
?= Scan с фильтром по City. Для частых поисков добавляют global secondary index по City и делают Query по нему.
?? Данные о продажах за пять лет из нескольких систем должны питать годовые отчёты. RDS, DynamoDB или Redshift?
?= Redshift: колоночное хранилище данных, созданное для OLAP-запросов по большим историческим данным.
?? Почему приложению на EC2 для доступа к DynamoDB нужна IAM role, а не ключи доступа?
?= Роль даёт временные учётные данные, которые меняются автоматически; ключи, сохранённые на инстансе, могут утечь и сами не истекают.`,
  },
  [
    qx("In Amazon DynamoDB, which operation would you typically use to find items by an attribute that is not part of the primary key?", "Scan", [
      ["GetItem", "GetItem needs the full primary key and returns exactly one item.", "GetItem требует полного первичного ключа и возвращает ровно один item."],
      ["Query", "Query needs a partition key value (of the table or of an index); without an index on that attribute it cannot be used.", "Query нужно значение partition key (таблицы или индекса); без индекса по этому атрибуту он не подходит."],
      ["PutItem", "PutItem writes an item; it does not search.", "PutItem записывает item, а не ищет."],
    ], "Scan reads every item in the table and applies a filter, so it can match on any attribute — at the cost of reading the whole table.", "Scan читает все items таблицы и применяет фильтр, поэтому находит по любому атрибуту — ценой чтения всей таблицы."),
    qx("An app knows both the partition key and the sort key of one DynamoDB item. Which call reads that item most efficiently?", "GetItem with the full primary key", [
      ["Scan with a filter on both keys", "Scan would read the whole table to return one item.", "Scan прочитал бы всю таблицу ради одного item."],
      ["Query on a global secondary index", "No index is needed: the full table key is already known.", "Индекс не нужен: полный ключ таблицы уже известен."],
      ["PutItem with a condition expression", "PutItem writes data; it does not read an item back.", "PutItem записывает данные, а не читает item."],
    ], "GetItem fetches exactly one item by its full primary key — the cheapest and fastest read.", "GetItem получает ровно один item по полному первичному ключу — самое дешёвое и быстрое чтение."),
    qx("A table has partition key CustomerId and sort key OrderDate. All orders of customer c-9 placed in October are needed. Which operation fits?", "Query on CustomerId = c-9 with an OrderDate range", [
      ["GetItem on CustomerId = c-9, which returns all of them", "GetItem needs the full key, including OrderDate, and returns one item.", "GetItem требует полного ключа, включая OrderDate, и возвращает один item."],
      ["Scan the whole table, filtering on both attributes", "It works, but reads every customer's orders — slow and costly.", "Сработает, но прочитает заказы всех клиентов — медленно и дорого."],
      ["BatchGetItem with every possible date in October", "It needs exact keys; order dates are not known in advance.", "Ему нужны точные ключи, а даты заказов заранее неизвестны."],
    ], "Query reads one partition key value and can narrow the sort key with a condition such as BETWEEN two dates.", "Query читает одно значение partition key и может сузить sort key условием, например BETWEEN двух дат."),
    qx("What makes up a composite primary key in DynamoDB?", "A partition key and a sort key, unique as a pair", [
      ["A partition key together with a global secondary index", "An index is a separate structure, not part of the table's primary key.", "Индекс — отдельная структура, а не часть первичного ключа таблицы."],
      ["Two partition keys that are hashed together", "A table has exactly one partition key.", "У таблицы ровно один partition key."],
      ["A sort key together with a timestamp attribute", "A primary key always starts with a partition key.", "Первичный ключ всегда начинается с partition key."],
    ], "A composite key is partition key + sort key: many items may share a partition key, but the pair must be unique.", "Составной ключ — это partition key + sort key: у многих items может быть общий partition key, но пара должна быть уникальной."),
    qx("Two items in the same DynamoDB table have different sets of attributes. What does this show?", "Only the primary key is fixed; other attributes are flexible", [
      ["The table is corrupted and must be restored from a backup", "Different attributes per item are normal in DynamoDB.", "Разные атрибуты у разных items — норма для DynamoDB."],
      ["One of the items was written through a global secondary index", "Writes go to the table; indexes are updated from it.", "Запись идёт в таблицу; индексы обновляются из неё."],
      ["A schema change is still running and will add the columns", "DynamoDB has no column schema to migrate.", "В DynamoDB нет схемы столбцов, которую нужно мигрировать."],
    ], "DynamoDB is schemaless apart from the primary key; each item can carry its own attributes.", "DynamoDB не имеет схемы, кроме первичного ключа; у каждого item могут быть свои атрибуты."),
    qx("An existing DynamoDB table needs an index whose partition key is Email. What can be created?", "A global secondary index", [
      ["A local secondary index", "An LSI keeps the table's partition key and must be defined at table creation.", "LSI сохраняет partition key таблицы и задаётся только при создании таблицы."],
      ["A read replica keyed by Email", "DynamoDB has no read replicas with a different key.", "В DynamoDB нет read replicas с другим ключом."],
      ["A second primary key on Email", "A table has only one primary key, and it cannot be changed.", "У таблицы только один первичный ключ, и изменить его нельзя."],
    ], "A GSI can use any attribute as its partition key and can be added to an existing table at any time.", "GSI может использовать любой атрибут как partition key и добавляется к существующей таблице в любой момент."),
    qx("A new app's DynamoDB traffic is unpredictable, with sudden spikes, and the team does not want to plan capacity. Which mode fits?", "On-demand mode, billed per request", [
      ["Provisioned mode with fixed units", "Fixed units would throttle spikes or waste money in quiet times.", "Фиксированные единицы будут ограничивать пики или впустую тратить деньги в тихие часы."],
      ["Reserved capacity bought for a year", "Reserved capacity suits steady, known traffic.", "Reserved capacity подходит для ровного, известного трафика."],
      ["Provisioned mode, auto scaling off", "Without auto scaling, capacity never follows the spikes.", "Без auto scaling ёмкость не будет следовать за пиками."],
    ], "On-demand mode needs no capacity planning: it absorbs spikes and bills per read and write request.", "On-demand не требует планирования ёмкости: выдерживает пики и берёт оплату за каждый запрос на чтение и запись."),
    qx("Users in Europe and Asia must read and write the same DynamoDB data with low latency in their own Regions. What fits?", "DynamoDB global tables, multi-active", [
      ["RDS Multi-AZ with the standby placed in Asia", "A Multi-AZ standby stays in the same Region and serves no traffic.", "Multi-AZ standby остаётся в том же регионе и трафик не обслуживает."],
      ["A cross-Region RDS read replica", "A replica is read-only and belongs to RDS, not DynamoDB.", "Реплика только для чтения и относится к RDS, а не к DynamoDB."],
      ["DynamoDB Accelerator (DAX) caches", "DAX caches reads in one Region; it does not replicate writes.", "DAX кэширует чтение в одном регионе и не реплицирует запись."],
    ], "Global tables replicate a table across Regions, and every replica accepts reads and writes locally.", "Global tables реплицируют таблицу между регионами, и каждая копия принимает чтение и запись локально."),
    qx("An application on EC2 needs to read a DynamoDB table. What is the MOST secure way to give it credentials?", "Attach an IAM role with DynamoDB access to the instance", [
      ["Store an IAM user's access keys in a config file on the instance", "Long-term keys on a server can leak and must be rotated by hand.", "Долгосрочные ключи на сервере могут утечь, и менять их приходится вручную."],
      ["Use the root account's keys, limited by a bucket policy", "Root credentials must never be used by apps; bucket policies are for S3.", "Учётные данные root нельзя давать приложениям; bucket policies — это про S3."],
      ["Rotate access keys on the instance with a Lambda job", "It still stores long-term keys on the instance; a role avoids keys entirely.", "Это всё равно хранит долгосрочные ключи на инстансе; роль обходится вообще без ключей."],
    ], "An IAM role delivers temporary, automatically rotated credentials to the instance, scoped to the DynamoDB permissions it needs.", "IAM role выдаёт инстансу временные, автоматически обновляемые учётные данные с нужными правами на DynamoDB."),
    qx("A retailer wants SQL reports over five years of sales data (many terabytes) collected from several systems. Which service fits?", "Amazon Redshift", [
      ["Amazon DynamoDB", "DynamoDB is built for key-based OLTP access, not analytic SQL over history.", "DynamoDB создан для OLTP-доступа по ключу, а не для аналитического SQL по истории."],
      ["Amazon RDS for MySQL", "A row-based OLTP database struggles with large analytic scans.", "Строчная OLTP-база плохо справляется с большими аналитическими выборками."],
      ["Amazon ElastiCache", "A cache keeps hot data in memory; it is not a warehouse.", "Кэш держит горячие данные в памяти; это не хранилище данных."],
    ], "Redshift is the data warehouse: columnar, massively parallel, SQL and BI tools over terabytes to petabytes.", "Redshift — хранилище данных: колоночное, массово-параллельное, SQL и BI-инструменты на терабайтах и петабайтах."),
    qx("Which of these workloads is OLAP rather than OLTP?", "Yearly sales per region over all past orders", [
      ["Saving a new order at the moment a customer pays", "A short write transaction — classic OLTP.", "Короткая транзакция записи — классический OLTP."],
      ["Updating one user's shipping address", "A single-row update is OLTP.", "Изменение одной строки — это OLTP."],
      ["Reserving a seat for a single flight booking", "A small transactional change is OLTP.", "Небольшое транзакционное изменение — OLTP."],
    ], "OLAP means a few heavy analytic queries over large historical data, the job of a data warehouse such as Redshift.", "OLAP — немного тяжёлых аналитических запросов по большим историческим данным; это работа хранилища данных вроде Redshift."),
    qx("What lets Amazon Redshift run analytic queries fast over huge amounts of data?", "Columnar storage and massively parallel processing", [
      ["Key-value lookups by partition key on SSD partitions", "That is how DynamoDB reaches single items quickly.", "Так DynamoDB быстро находит отдельные items."],
      ["Synchronous standby copies in three AZs", "Standby copies are about availability, not query speed.", "Копии standby — про доступность, а не про скорость запросов."],
      ["Caching every table in memory on one node", "Redshift spreads work across many compute nodes, not one.", "Redshift распределяет работу по многим compute nodes, а не по одному."],
    ], "Columns are stored together and compressed, and the leader node splits each query across compute nodes running in parallel.", "Столбцы хранятся вместе и сжимаются, а leader node делит каждый запрос между параллельно работающими compute nodes."),
    tfx("Amazon Redshift Spectrum can run SQL queries on data stored in Amazon S3 without loading it into the cluster.", true,
      "Spectrum queries files in S3 in place, so rarely used data can stay cheap in S3 and still be joined with cluster tables.",
      "Spectrum выполняет запросы к файлам в S3 на месте, поэтому редко нужные данные могут дёшево лежать в S3 и всё равно соединяться с таблицами кластера.",
      "'False' assumes Redshift can only query data loaded into its own nodes; Spectrum exists exactly to avoid that.",
      "Ответ «неверно» предполагает, что Redshift видит только загруженные в его узлы данные; Spectrum создан как раз чтобы этого избежать."),
    qx("An on-premises Oracle database must move to Amazon Aurora PostgreSQL while the source keeps running. What does the migration?", "AWS DMS, with the schema converted first", [
      ["AWS Storage Gateway in Volume Gateway mode", "Storage Gateway moves storage blocks, not database tables between engines.", "Storage Gateway переносит блоки хранилища, а не таблицы между движками."],
      ["A Snowball Edge device with a DB export", "An offline export stops changes and does not convert Oracle to PostgreSQL.", "Офлайн-выгрузка не переносит текущие изменения и не превращает Oracle в PostgreSQL."],
      ["An Aurora read replica of the Oracle source", "Aurora cannot replicate from an Oracle database.", "Aurora не умеет реплицировать из базы Oracle."],
    ], "DMS migrates with minimal downtime by replicating changes continuously; for Oracle → PostgreSQL the schema is converted first (SCT or DMS Schema Conversion).", "DMS переносит с минимальным простоем, непрерывно реплицируя изменения; для Oracle → PostgreSQL сначала конвертируют схему (SCT или DMS Schema Conversion)."),
    qx("Which of these database migrations is heterogeneous?", "Oracle on-premises to Amazon Aurora PostgreSQL", [
      ["MySQL on-premises to Amazon RDS for MySQL", "Same engine on both sides — homogeneous.", "Один и тот же движок с обеих сторон — однородная миграция."],
      ["SQL Server to Amazon RDS for SQL Server", "Same engine — homogeneous.", "Тот же движок — однородная."],
      ["PostgreSQL on EC2 to Amazon RDS for PostgreSQL", "Same engine, just a different host — homogeneous.", "Тот же движок, просто другой хост — однородная."],
    ], "Heterogeneous means the source and target engines differ, so schema and code must be converted before DMS moves the data.", "Разнородная — значит, движки источника и цели разные, и схему с кодом нужно сконвертировать до того, как DMS перенесёт данные."),
    qx("A social network wants to query friend-of-a-friend relationships efficiently. Which AWS database is purpose-built for this?", "Amazon Neptune", [
      ["Amazon Redshift", "Redshift is for analytic SQL, not graph traversals.", "Redshift — для аналитического SQL, а не для обхода графов."],
      ["Amazon ElastiCache", "A cache speeds up reads but has no graph model.", "Кэш ускоряет чтение, но графовой модели у него нет."],
      ["Amazon DynamoDB", "DynamoDB is key-value; multi-hop relationships are awkward there.", "DynamoDB — ключ-значение; связи через несколько шагов там неудобны."],
    ], "Neptune is AWS's graph database, built for highly connected data such as social networks and recommendations.", "Neptune — графовая база AWS для сильно связанных данных вроде социальных сетей и рекомендаций."),
    qx("An RDS database gets the same product-page queries thousands of times per second. What reduces its load with very fast reads?", "Put Amazon ElastiCache in front of the database", [
      ["Move the product table to Amazon Redshift", "Redshift is for analytics; it is not a low-latency cache for web pages.", "Redshift — для аналитики, а не кэш с низкой задержкой для веб-страниц."],
      ["Turn on Multi-AZ so the standby can answer the queries", "A classic Multi-AZ standby serves no queries.", "Классический Multi-AZ standby запросы не обслуживает."],
      ["Take more frequent manual snapshots", "Snapshots are backups and add no read capacity.", "Snapshots — резервные копии, мощности чтения они не добавляют."],
    ], "ElastiCache keeps hot query results in memory, answering repeated reads in microseconds to milliseconds and sparing the database.", "ElastiCache держит горячие результаты в памяти и отвечает на повторные чтения за микро- и миллисекунды, разгружая базу."),
    tfx("A DynamoDB Query can return items without knowing any partition key value, as long as a filter expression is given.", false,
      "Query always needs one partition key value (of the table or an index). Searching without it is a Scan.",
      "Query всегда требует одно значение partition key (таблицы или индекса). Поиск без него — это Scan.",
      "'True' confuses Query with Scan: a filter alone works only in a Scan, which reads everything first.",
      "Ответ «верно» путает Query со Scan: один лишь фильтр работает только в Scan, который сначала читает всё."),
    qx("Why should frequent lookups by a non-key attribute avoid Scan on a large table?", "Scan reads every item, using a lot of time and capacity", [
      ["Scan returns only the first matching item and stops there", "Scan returns all matches, page by page.", "Scan возвращает все совпадения, страница за страницей."],
      ["Scan works only on tables that have a sort key", "Scan works on any table or index.", "Scan работает с любой таблицей или индексом."],
      ["Scan locks the table so no one can write meanwhile", "Scan does not lock the table.", "Scan таблицу не блокирует."],
    ], "Scan reads the whole table before filtering, so cost and time grow with table size; a GSI plus Query reads only the matching items.", "Scan читает всю таблицу до фильтрации, и цена со временем растут вместе с таблицей; GSI плюс Query читает только подходящие items."),
    qx("By default, what kind of read does DynamoDB perform?", "Eventually consistent reads", [
      ["Strongly consistent reads", "Strong consistency is optional and must be requested.", "Строгая согласованность необязательна, её нужно запросить."],
      ["Transactional reads that lock", "Transactions exist but are separate API calls, not the default.", "Транзакции есть, но это отдельные вызовы API, а не поведение по умолчанию."],
      ["Reads served only from DAX", "DAX is an optional cache you add yourself.", "DAX — необязательный кэш, который добавляют отдельно."],
    ], "By default a read may briefly miss a just-written change; a strongly consistent read can be requested on the table or an LSI.", "По умолчанию чтение может ненадолго не увидеть только что записанное изменение; строго согласованное чтение можно запросить на таблице или LSI."),
  ],
);

export const lecture9: Lecture = {
  id: "cc-l9",
  title: { en: "Lecture 9 — AWS Storage and Databases", ru: "Лекция 9 — Хранилища и базы данных AWS" },
  parts: [p1, p2, p3, p4],
};

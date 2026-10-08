import { part, qx, tfx, type Lecture } from "../types";

/**
 * Лекция 8 — Amazon EC2 и варианты вычислений в AWS (AWS Academy Cloud
 * Foundations, модуль 6 + Lab 3 «Introduction to Amazon EC2»). Дополняет
 * лекцию 3 (общий уровень) спецификой AWS: решения при запуске, семейства,
 * жизненный цикл, варианты покупки, Lambda / контейнеры / Beanstalk / Lightsail.
 */
export const lecture8: Lecture = {
  id: "cc-l8",
  title: { en: "Lecture 8 — Amazon EC2 and AWS compute options", ru: "Лекция 8 — Amazon EC2 и варианты вычислений в AWS" },
  parts: [
    part(
      "cc-l8-p1",
      { en: "Launching an instance: the nine decisions", ru: "Запуск инстанса: девять решений" },
      {
        en: `## EC2 in one paragraph
**Amazon EC2 (Elastic Compute Cloud)** rents you virtual servers — **instances** — in the AWS Cloud. It is **IaaS**: AWS runs the data center, the hardware and the hypervisor; you choose and manage the **guest OS**, its patches, the software and the firewall rules.
- Launch from the **console** (Launch Instance Wizard), the **AWS CLI** (aws ec2 run-instances), an **SDK**, a **launch template** or **AWS CloudFormation**.
## The nine launch decisions
| # | Decision | What you choose | Key fact |
|---|---|---|---|
| 1 | AMI | the OS and preinstalled software | an AMI lives in one Region |
| 2 | Instance type | vCPU, memory, storage, network performance | name = family + generation + size, e.g. t3.micro |
| 3 | Network settings | VPC, subnet, auto-assign public IP | the subnet decides the Availability Zone |
| 4 | IAM role | what software on the instance may call in AWS | delivered through an instance profile, no keys on disk |
| 5 | User data | a script for the first boot | installs and starts software automatically |
| 6 | Storage | root volume and extra volumes | EBS persists, instance store is ephemeral |
| 7 | Tags | key–value labels, e.g. Name = Web Server | filtering, cost allocation, automation |
| 8 | Security group | instance-level firewall rules | stateful, allow rules only |
| 9 | Key pair | public key on the instance, private key with you | SSH to Linux, decrypt the Windows password |
= AMI → instance type → network → IAM role → user data → storage → tags → security group → key pair
Mnemonic for the order: **A**ll **T**eams **N**eed **I**dentity, **U**ser data, **S**torage, **T**ags, **S**ecurity and **K**eys.
## 1–2. AMI and instance type — beyond Lecture 3
- An AMI is **Region-specific**: to launch the same image in another Region, **copy** the AMI to that Region first.
- You can **create your own AMI** from a configured instance (a "golden image"): new servers start ready instead of being set up again.
## 3. Network settings
- Choose the **VPC** and the **subnet**. A subnet sits in **exactly one Availability Zone**, so choosing the subnet chooses the AZ.
- Every instance gets a **private IPv4 address** from the subnet's range; instances in a VPC talk to each other with these addresses.
- To be **reachable from the internet**, an instance in a **public subnet** also needs a **public IPv4 address** (auto-assign) or an **Elastic IP**. The route 0.0.0.0/0 → internet gateway is necessary but not enough: private addresses are not routable on the internet.
> Exam trap: "Why does an EC2 instance in a public subnet need a public IP?" — **to be accessible from the internet**. Not to reach private subnets (private IPs do that) and not to use a NAT gateway (NAT serves private subnets).
## 4. IAM role
When an application on the instance must call AWS services — read from S3, write to DynamoDB — attach an **IAM role**. EC2 passes the role's **temporary credentials** to the instance through an **instance profile**, and the SDK picks them up automatically. No long-term **access keys** are stored on the server.
## 5. User data
**User data** is a script passed at launch. By default it runs **once, at the first boot**, with **root** privileges (on Linux through cloud-init). It automates setup: install packages, fetch code, start services. Limit: **16 KB**. Lab 3 uses this script to build a web server:
= #!/bin/bash
= yum -y install httpd
= systemctl enable httpd
= systemctl start httpd
= echo '<html><h1>Hello From Your Web Server!</h1></html>' > /var/www/html/index.html
- User data is **not encrypted** and can be read from the instance — no passwords in it.
- A strategic use: one generic AMI plus different user data scripts instead of many custom AMIs.
## Instance metadata
**Instance metadata** is data **about** the running instance that software reads **from inside** it at a link-local address:
= http://169.254.169.254/latest/meta-data/
- Examples: instance-id, ami-id, instance-type, local-ipv4, public-ipv4, placement/availability-zone, and the temporary credentials of the IAM role.
- The user data script is served by the same service at /latest/user-data.
- Scripts use it to configure themselves instead of hard-coding values; **IMDSv2** (the more secure mode) requires a session token first.
## 6. Storage
- The **root volume** holds the OS; for most AMIs it is an **Amazon EBS** volume (8 GiB by default for Amazon Linux).
- **Amazon EBS** — network-attached block storage that **persists** independently of the instance's running state.
- **Instance store** — disks **physically attached to the host**: very fast but **ephemeral**. Data survives a reboot, but is **lost when the instance stops, hibernates or terminates**, or when the disk fails.
- Also usable, though not as root: **Amazon EFS** (a shared file system) and **Amazon S3** (objects via the API).
- **Delete on termination** is on by default for the root EBS volume and off by default for volumes attached later.
| | Amazon EBS | Instance store |
|---|---|---|
| Reboot | data kept | data kept |
| Stop or hibernate | data kept | data lost |
| Good for | root volume, databases, anything to keep | caches, buffers, scratch data, data replicated elsewhere |
## 7. Tags
A **tag** is a **key–value label**, e.g. Name = Web Server or Env = prod. Keys are case-sensitive; a resource can have up to **50** tags. Tags drive console filtering, **cost allocation** reports, and automation (stop every instance tagged Env = dev at night).
## 8. Security group
A **security group** is a **virtual firewall at the instance level** (attached to its network interface):
- **allow rules only** — there are no deny rules; anything not allowed is dropped;
- **stateful** — the reply to allowed inbound traffic is let out automatically;
- a new security group has **no inbound rules** and **allows all outbound** traffic;
- rule changes apply **immediately**, with no restart; a rule's source can be a CIDR or **another security group**.
= Type HTTP | Protocol TCP | Port 80 | Source 0.0.0.0/0
Common ports: SSH 22, HTTP 80, HTTPS 443, RDP 3389, MySQL 3306.
## 9. Key pair
A **key pair** is a public key plus a private key. AWS places the **public key** on the instance; you keep the **private key** file (.pem). On Linux you connect with **SSH** and the private key; on Windows the private key **decrypts the Administrator password** for RDP. AWS does not keep the private key: lose the file and it cannot be downloaded again.
= ssh -i my-key.pem ec2-user@203.0.113.25
?? A script on the instance must find out the instance's Availability Zone. Where does it look?
?= In instance metadata: http://169.254.169.254/latest/meta-data/placement/availability-zone — nothing is hard-coded.
?? An application on EC2 must read objects from S3. What is the secure way to give it access?
?= Attach an IAM role with S3 read permissions; the instance receives temporary credentials through the instance profile, so no access keys are stored.`,
        ru: `## EC2 в одном абзаце
**Amazon EC2 (Elastic Compute Cloud)** сдаёт в аренду виртуальные серверы — **instances (инстансы)** — в AWS Cloud. Это **IaaS**: AWS отвечает за дата-центр, оборудование и гипервизор, а **гостевая ОС (guest OS)**, её обновления, программы и правила firewall — на стороне клиента.
- Запуск — из **консоли** (Launch Instance Wizard), через **AWS CLI** (aws ec2 run-instances), **SDK**, **launch template** или **AWS CloudFormation**.
## Девять решений при запуске
| № | Решение | Что выбирается | Главный факт |
|---|---|---|---|
| 1 | AMI | ОС и предустановленные программы | AMI живёт в одном Region |
| 2 | Instance type | vCPU, память, хранилище, сетевая производительность | имя = семейство + поколение + размер, например t3.micro |
| 3 | Network settings | VPC, подсеть, автоматический public IP | подсеть определяет Availability Zone |
| 4 | IAM role | к чему в AWS может обращаться софт на инстансе | выдаётся через instance profile, ключей на диске нет |
| 5 | User data | скрипт для первой загрузки | сам ставит и запускает программы |
| 6 | Storage | root volume и дополнительные тома | EBS сохраняется, instance store временный |
| 7 | Tags | метки ключ–значение, например Name = Web Server | фильтры, учёт затрат, автоматизация |
| 8 | Security group | правила firewall на уровне инстанса | stateful, только разрешающие правила |
| 9 | Key pair | публичный ключ на инстансе, приватный — у владельца | SSH в Linux, расшифровка пароля Windows |
= AMI → instance type → network → IAM role → user data → storage → tags → security group → key pair
Мнемоника порядка (по первым буквам английских терминов): **A**ll **T**eams **N**eed **I**dentity, **U**ser data, **S**torage, **T**ags, **S**ecurity and **K**eys.
## 1–2. AMI и тип инстанса — сверх лекции 3
- AMI **привязан к Region**: чтобы запустить тот же образ в другом Region, AMI сначала **копируют** туда.
- Можно **создать свой AMI** из настроенного инстанса («golden image»): новые серверы стартуют готовыми, а не настраиваются заново.
## 3. Сетевые настройки
- Выбираются **VPC** и **подсеть (subnet)**. Подсеть находится **ровно в одной Availability Zone**, поэтому выбор подсети — это и выбор AZ.
- Каждый инстанс получает **private IPv4 address (частный адрес)** из диапазона подсети; инстансы внутри VPC общаются по этим адресам.
- Чтобы инстанс в **публичной подсети** был **доступен из интернета**, ему нужен ещё **public IPv4 address** (auto-assign) или **Elastic IP**. Маршрут 0.0.0.0/0 → internet gateway необходим, но недостаточен: частные адреса в интернете не маршрутизируются.
> Ловушка экзамена: «Зачем инстансу EC2 в публичной подсети public IP?» — **чтобы он был доступен из интернета**. Не для связи с частными подсетями (для этого хватает частных IP) и не для NAT gateway (NAT обслуживает частные подсети).
## 4. IAM role
Когда приложению на инстансе нужно обращаться к сервисам AWS — читать из S3, писать в DynamoDB, — к инстансу прикрепляют **IAM role (роль)**. EC2 передаёт инстансу **временные учётные данные (temporary credentials)** роли через **instance profile**, и SDK подхватывает их сам. Долгоживущие **access keys** на сервере не хранятся.
## 5. User data
**User data** — скрипт, который передают при запуске. По умолчанию он выполняется **один раз, при первой загрузке**, с правами **root** (в Linux — через cloud-init). Он автоматизирует настройку: установить пакеты, скачать код, запустить сервисы. Лимит — **16 КБ**. В Lab 3 этот скрипт делает из инстанса веб-сервер:
= #!/bin/bash
= yum -y install httpd
= systemctl enable httpd
= systemctl start httpd
= echo '<html><h1>Hello From Your Web Server!</h1></html>' > /var/www/html/index.html
- User data **не шифруется** и читается с инстанса — паролям там не место.
- Стратегический приём: один общий AMI плюс разные скрипты user data вместо множества собственных AMI.
## Метаданные инстанса
**Instance metadata (метаданные инстанса)** — данные **о самом** работающем инстансе, которые программы читают **изнутри** него по link-local адресу:
= http://169.254.169.254/latest/meta-data/
- Примеры: instance-id, ami-id, instance-type, local-ipv4, public-ipv4, placement/availability-zone и временные учётные данные IAM role.
- Скрипт user data отдаёт тот же сервис по пути /latest/user-data.
- Скрипты настраивают себя по метаданным, а не по жёстко прописанным значениям; **IMDSv2** (более безопасный режим) сначала требует токен сессии.
## 6. Хранилище
- **Root volume (корневой том)** хранит ОС; у большинства AMI это том **Amazon EBS** (у Amazon Linux по умолчанию 8 GiB).
- **Amazon EBS** — блочное хранилище, подключённое по сети, которое **сохраняется** независимо от того, работает ли инстанс.
- **Instance store** — диски, **физически подключённые к хосту**: очень быстрые, но **временные (ephemeral)**. Данные переживают перезагрузку, но **теряются при stop, hibernate или terminate**, а также при отказе диска.
- Также доступны, но не как root: **Amazon EFS** (общая файловая система) и **Amazon S3** (объекты через API).
- **Delete on termination** по умолчанию включён у корневого тома EBS и выключен у томов, подключённых позже.
| | Amazon EBS | Instance store |
|---|---|---|
| Reboot | данные сохраняются | данные сохраняются |
| Stop или hibernate | данные сохраняются | данные теряются |
| Подходит для | root volume, базы данных, всё, что нужно сохранить | кэш, буферы, временные данные, данные с копией в другом месте |
## 7. Теги
**Tag (тег)** — **метка ключ–значение**, например Name = Web Server или Env = prod. Ключи чувствительны к регистру; у ресурса может быть до **50** тегов. По тегам фильтруют ресурсы в консоли, строят отчёты **cost allocation (распределения затрат)**, и автоматизируют (ночью останавливать все инстансы с Env = dev).
## 8. Security group
**Security group** — **виртуальный firewall на уровне инстанса** (привязан к его сетевому интерфейсу):
- **только разрешающие правила (allow)** — запрещающих нет; всё, что не разрешено, отбрасывается;
- **stateful** — ответ на разрешённый входящий трафик выпускается автоматически;
- у новой security group **нет входящих правил**, а **весь исходящий** трафик разрешён;
- изменения правил действуют **сразу**, без перезапуска; источником в правиле может быть CIDR или **другая security group**.
= Type HTTP | Protocol TCP | Port 80 | Source 0.0.0.0/0
Частые порты: SSH 22, HTTP 80, HTTPS 443, RDP 3389, MySQL 3306.
## 9. Key pair
**Key pair (пара ключей)** — публичный ключ плюс приватный. AWS кладёт **публичный ключ** на инстанс, а **приватный** (файл .pem) остаётся у владельца. В Linux подключаются по **SSH** с приватным ключом; в Windows приватный ключ **расшифровывает пароль Administrator** для RDP. AWS приватный ключ не хранит: если файл потерян, скачать его снова нельзя.
= ssh -i my-key.pem ec2-user@203.0.113.25
?? Скрипту на инстансе нужно узнать Availability Zone инстанса. Где искать?
?= В метаданных инстанса: http://169.254.169.254/latest/meta-data/placement/availability-zone — ничего не прописывается вручную.
?? Приложению на EC2 нужно читать объекты из S3. Как безопасно дать доступ?
?= Прикрепить IAM role с правами на чтение S3; инстанс получает временные учётные данные через instance profile, access keys не хранятся.`,
      },
      [
        qx("Which of these is NOT one of the choices you make when launching an EC2 instance?", "The hypervisor of the physical host", [
          ["The key pair used to log in", "The key pair is the ninth decision of the launch wizard.", "Key pair — девятое решение мастера запуска."],
          ["The user data script run at first boot", "User data is one of the nine launch decisions (advanced details).", "User data — одно из девяти решений при запуске (раздел Advanced details)."],
          ["The IAM role for software on the instance", "Choosing an IAM role (instance profile) is part of the launch.", "Выбор IAM role (instance profile) — часть запуска."],
        ], "AWS chooses and runs the hypervisor; the customer picks the AMI, type, network, IAM role, user data, storage, tags, security group and key pair.", "Гипервизор выбирает и обслуживает AWS; клиент выбирает AMI, тип, сеть, IAM role, user data, хранилище, теги, security group и key pair."),
        qx("A team built a custom AMI in eu-west-1 and now wants identical servers in us-east-1. What must they do?", "Copy the AMI to us-east-1, then launch from it", [
          ["Nothing — an AMI can be launched in any Region", "AMIs are Regional resources; another Region does not see them until they are copied.", "AMI — региональный ресурс; другой Region его не видит, пока образ не скопирован."],
          ["Publish it as a Community AMI so all Regions see it", "Community AMIs are still Regional, and publishing exposes the image to everyone.", "Community AMI тоже региональны, а публикация открывает образ всем подряд."],
          ["Attach the AMI to a VPC that spans both Regions", "A VPC lives in one Region and cannot span two; AMIs are not attached to VPCs.", "VPC живёт в одном Region и не охватывает два; AMI к VPC не прикрепляют."],
        ], "An AMI is Region-specific; copying it to the target Region creates a new AMI ID there.", "AMI привязан к Region; копия в целевом Region получает там новый AMI ID."),
        qx("You launch an instance into a subnet that lives in us-east-1b. Where does the instance run?", "In us-east-1b, the AZ of that subnet", [
          ["In an AZ that AWS picks at random", "The subnet is pinned to one AZ, so nothing about the placement is random.", "Подсеть закреплена за одной AZ, поэтому случайного выбора нет."],
          ["In every AZ of the Region at once", "One instance runs on one host in one AZ; high availability needs several instances.", "Один инстанс работает на одном хосте в одной AZ; для отказоустойчивости нужны несколько инстансов."],
          ["In us-east-1a, the Region's first AZ", "The AZ comes from the subnet, not from alphabetical order.", "AZ определяется подсетью, а не алфавитным порядком."],
        ], "A subnet belongs to exactly one Availability Zone, so the subnet you pick decides the AZ.", "Подсеть принадлежит ровно одной Availability Zone, поэтому выбор подсети определяет AZ."),
        qx("An instance sits in a public subnet whose route table sends 0.0.0.0/0 to an internet gateway, but it has only a private IPv4 address. Why can't users reach it?", "Without a public or Elastic IP it is not reachable", [
          ["Public subnets also need a NAT gateway for inbound traffic", "A NAT gateway lets private instances go out; it never accepts inbound connections from the internet.", "NAT gateway выпускает частные инстансы наружу и не принимает входящие соединения из интернета."],
          ["Private IPv4 addresses only work over IPv6 routes", "Private IPv4 addresses work fine inside the VPC; they are simply not routable on the internet.", "Частные IPv4 прекрасно работают внутри VPC; они просто не маршрутизируются в интернете."],
          ["The route table must point 0.0.0.0/0 to the subnet", "Pointing the default route at the subnet makes no sense; the internet gateway route is already correct.", "Направлять маршрут по умолчанию на подсеть бессмысленно; маршрут на internet gateway уже верный."],
        ], "The internet gateway maps a public IP to the instance's private IP; with no public or Elastic IP there is nothing to map, so the instance cannot be reached from the internet.", "Internet gateway сопоставляет public IP с частным IP инстанса; без public или Elastic IP сопоставлять нечего, и из интернета инстанс недоступен."),
        qx("Two instances in the same VPC exchange traffic. Which addresses do they normally use?", "Their private IPv4 addresses", [
          ["Their Elastic IP addresses", "Elastic IPs are public addresses for internet access; inside the VPC they are not needed.", "Elastic IP — публичные адреса для доступа из интернета; внутри VPC они не нужны."],
          ["Their auto-assigned public IPs", "Public IPs exist for the internet; many instances have none and still talk inside the VPC.", "Public IP нужны для интернета; у многих инстансов их нет, а внутри VPC они всё равно общаются."],
          ["The internet gateway's address", "The internet gateway connects the VPC to the internet and plays no role in traffic inside it.", "Internet gateway связывает VPC с интернетом и не участвует в трафике внутри VPC."],
        ], "Inside a VPC, instances reach each other by the private IPs from their subnets — the local route covers the whole VPC CIDR.", "Внутри VPC инстансы обращаются друг к другу по частным IP из своих подсетей — маршрут local покрывает весь CIDR VPC."),
        qx("An application on EC2 must upload reports to an S3 bucket. What is the recommended way to grant access?", "Attach an IAM role that allows writing to S3", [
          ["Put an IAM user's access keys into the user data", "User data is not encrypted and is readable from the instance; long-term keys there are a leak waiting to happen.", "User data не шифруется и читается с инстанса; долгоживущие ключи там — готовая утечка."],
          ["Open TCP 443 to S3 in the security group", "Outbound HTTPS is already allowed by default, and network access is not permission — S3 still needs credentials.", "Исходящий HTTPS и так разрешён по умолчанию, а сетевой доступ — не права: S3 всё равно нужны учётные данные."],
          ["Launch the instance in the bucket's subnet", "S3 buckets do not live in subnets, and placement grants no permissions.", "Бакеты S3 не живут в подсетях, а размещение не даёт никаких прав."],
        ], "An IAM role gives the instance temporary, automatically rotated credentials through the instance profile — no keys are stored on the server.", "IAM role даёт инстансу временные, автоматически обновляемые учётные данные через instance profile — ключи на сервере не хранятся."),
        qx("How does software on an instance actually receive the permissions of an attached IAM role?", "Short-lived credentials via the instance profile", [
          ["Long-term access keys baked into the AMI image", "Roles exist precisely to avoid long-term keys on servers and in images.", "Роли и придуманы, чтобы не держать долгоживущие ключи на серверах и в образах."],
          ["The private key of the key pair chosen at launch", "The key pair only lets you log in to the OS; it carries no AWS API permissions.", "Key pair нужен только для входа в ОС и не даёт прав на API AWS."],
          ["A password e-mailed to the root user of the account", "Nothing is e-mailed, and root credentials should never be used by applications.", "Ничего по почте не приходит, а учётные данные root приложениям использовать нельзя."],
        ], "The role is wrapped in an instance profile; EC2 serves short-lived credentials through instance metadata, and the AWS SDK uses them automatically.", "Роль упакована в instance profile; EC2 отдаёт краткосрочные учётные данные через метаданные инстанса, и AWS SDK использует их автоматически."),
        qx("By default, when does a user data shell script run on a Linux instance?", "Once, during the instance's first boot", [
          ["On every reboot of the instance", "By default cloud-init runs user data scripts once per instance; rerunning needs extra configuration.", "По умолчанию cloud-init выполняет скрипт user data один раз на инстанс; повтор требует отдельной настройки."],
          ["Each time someone connects over SSH", "SSH logins do not trigger user data; it is a boot-time mechanism.", "Вход по SSH не запускает user data — это механизм загрузки."],
          ["Every hour, like a job scheduled with cron", "User data is not a scheduler; recurring jobs need cron or Amazon EventBridge.", "User data — не планировщик; для регулярных задач нужен cron или Amazon EventBridge."],
        ], "User data scripts run once, at the first boot, as root — ideal for installing and starting software.", "Скрипт user data выполняется один раз, при первой загрузке, от root — удобно для установки и запуска программ."),
        qx("A script running on an instance needs the instance's own ID and public IPv4 address. What should it query?", "The metadata service at 169.254.169.254", [
          ["The user data script passed at launch", "User data holds only what you passed in; it does not know the ID or IP assigned later.", "В user data только то, что передали при запуске; ID и IP, выданных позже, там нет."],
          ["The block device mapping of the AMI", "The block device mapping lists volumes to attach, not facts about the running instance.", "Block device mapping перечисляет тома для подключения, а не сведения о работающем инстансе."],
          ["The inbound rules of its security group", "Security group rules describe allowed traffic, not the instance's identity.", "Правила security group описывают разрешённый трафик, а не сам инстанс."],
        ], "Instance metadata at http://169.254.169.254/latest/meta-data/ returns instance-id, public-ipv4, local-ipv4, the AZ and more.", "Метаданные по адресу http://169.254.169.254/latest/meta-data/ отдают instance-id, public-ipv4, local-ipv4, AZ и многое другое."),
        qx("Which statement about EC2 user data is true?", "It is unencrypted, so no secrets belong in it", [
          ["It can be edited while the instance is running", "User data can be changed only while the instance is stopped.", "User data можно изменить только у остановленного инстанса."],
          ["It must be written in Python 3 for Linux AMIs", "Linux user data is usually a shell script starting with #!/bin/bash; cloud-init directives also work.", "В Linux user data — обычно shell-скрипт, начинающийся с #!/bin/bash; подходят и директивы cloud-init."],
          ["It can hold up to 16 GB of scripts and files", "The limit is 16 KB, not 16 GB; large files should be downloaded by the script, e.g. from S3.", "Лимит — 16 КБ, а не 16 ГБ; большие файлы скрипт должен скачивать, например, из S3."],
        ], "User data is plain data readable from inside the instance (and by anyone allowed to view attributes) — passwords and keys must not go there.", "User data — открытые данные, их можно прочитать изнутри инстанса (и всем, кому разрешено смотреть атрибуты), — паролям и ключам там не место."),
        qx("A database keeps its files on an instance store volume. The instance is stopped and then started. What happens to the files?", "They are lost — instance store is ephemeral", [
          ["They are kept, because stop is not terminate", "A stop already wipes instance store; only EBS volumes survive it.", "Остановка уже стирает instance store; переживают её только тома EBS."],
          ["They are copied to S3 automatically on stop", "AWS does not back up instance store; copying is the owner's job.", "AWS не делает резервных копий instance store — это задача владельца."],
          ["They are moved to the EBS root volume", "Nothing is moved; after a start the instance usually lands on another host with empty instance store disks.", "Ничего не переносится; после запуска инстанс обычно оказывается на другом хосте с пустыми дисками instance store."],
        ], "Instance store disks belong to the physical host; on stop, hibernate or terminate their data is lost.", "Диски instance store принадлежат физическому хосту; при stop, hibernate или terminate их данные теряются."),
        qx("Which use fits instance store best?", "A temporary cache that can be rebuilt", [
          ["The only copy of customer orders", "Losing the only copy on a stop or disk failure is unacceptable; use EBS with snapshots or a database service.", "Потерять единственную копию при остановке или отказе диска нельзя; нужен EBS со snapshots или сервис баз данных."],
          ["A root volume that must survive a stop", "Instance store loses its data on stop; a root that must persist is an EBS volume.", "Instance store теряет данные при остановке; корневой том, который должен сохраняться, — это EBS."],
          ["Files shared by ten instances at once", "Instance store belongs to one host; shared files need Amazon EFS.", "Instance store принадлежит одному хосту; для общих файлов нужен Amazon EFS."],
        ], "Instance store is fast but ephemeral — right for caches, buffers and scratch data that can be recreated.", "Instance store быстрый, но временный — подходит для кэша, буферов и рабочих данных, которые можно восстановить."),
        tfx("By default, the root EBS volume of an instance is deleted when the instance is terminated.", true,
          "Delete on termination is on by default for the root volume, so terminating the instance deletes it — snapshot it or turn the flag off if the data matters.",
          "У корневого тома по умолчанию включён Delete on termination, поэтому terminate удаляет и его — если данные важны, стоит сделать snapshot или выключить флаг.",
          "'False' confuses the root volume with volumes attached later, which are kept by default.",
          "Ответ «неверно» путает корневой том с томами, подключёнными позже: они по умолчанию сохраняются."),
        qx("Finance wants the monthly EC2 bill split by project. Which launch setting helps most?", "Tags such as Project = Apollo on each instance", [
          ["A separate key pair created for every project", "Key pairs control logins; billing reports cannot group costs by them.", "Key pair отвечает за вход; отчёты о расходах не умеют группировать по нему."],
          ["User data that prints the project name at boot", "The output of a boot script never reaches the billing system.", "Вывод загрузочного скрипта в биллинг не попадает."],
          ["A different instance family for each project", "Families describe hardware, not ownership; two projects may need the same family.", "Семейства описывают железо, а не владельца; двум проектам может подойти одно семейство."],
        ], "Tags are key–value labels; activated as cost allocation tags, they split the bill by project, team or environment.", "Теги — метки ключ–значение; включённые как cost allocation tags, они делят счёт по проектам, командам или окружениям."),
        qx("A custom security group was just created and has no rules added yet. What traffic does it allow?", "No inbound traffic and all outbound traffic", [
          ["All inbound traffic and all outbound traffic", "Inbound starts empty; nothing gets in until you add an allow rule.", "Входящих правил сначала нет; ничего не войдёт, пока не добавлено разрешающее правило."],
          ["Inbound SSH only and no outbound traffic", "A blank custom group has no SSH rule, and outbound is open by default.", "В пустой группе нет правила SSH, а исходящий трафик по умолчанию открыт."],
          ["No traffic at all, in either direction", "Outbound is allowed by default; only the inbound side starts empty.", "Исходящий трафик по умолчанию разрешён; пустой бывает только входящая сторона."],
        ], "A new security group has no inbound rules (everything in is blocked) and one outbound rule allowing all traffic.", "У новой security group нет входящих правил (всё входящее блокируется) и есть одно исходящее правило «разрешить всё»."),
        tfx("Security groups are stateful, so after you allow inbound HTTP you must also add an outbound rule for the replies.", false,
          "Stateful means the reply to allowed inbound traffic is allowed out automatically; no extra outbound rule is needed.",
          "Stateful означает, что ответ на разрешённый входящий трафик выпускается автоматически; отдельное исходящее правило не нужно.",
          "'True' describes a stateless filter such as a network ACL, where return traffic needs its own rule.",
          "Ответ «верно» описывает stateless-фильтр вроде network ACL, где для обратного трафика нужно своё правило."),
        qx("Which rule can you NOT add to a security group?", "Deny all traffic from 198.51.100.7/32", [
          ["Allow TCP 22 from 203.0.113.5/32", "Allowing SSH from one admin address is a normal, recommended rule.", "Разрешить SSH с одного адреса администратора — обычное и рекомендуемое правило."],
          ["Allow TCP 443 from 0.0.0.0/0", "Allowing HTTPS from anywhere is typical for a public web server.", "Разрешить HTTPS отовсюду — типично для публичного веб-сервера."],
          ["Allow TCP 3306 from the web tier's SG", "Using another security group as the source is allowed and common in multi-tier apps.", "Указать другую security group как источник можно, это частый приём в многоуровневых приложениях."],
        ], "Security groups support allow rules only; to block a specific address you need a network ACL, which has deny rules.", "Security groups поддерживают только разрешающие правила; чтобы заблокировать конкретный адрес, нужен network ACL с запрещающими правилами."),
        qx("A Windows instance was launched with the key pair dev-key. What is the private key used for?", "Decrypting the Administrator password for RDP", [
          ["Encrypting the EBS root volume of the instance", "EBS encryption uses AWS KMS keys, not your key pair.", "Шифрование EBS использует ключи AWS KMS, а не key pair."],
          ["Signing the AWS API calls of the instance", "API calls are signed with IAM credentials, e.g. from a role, not with the key pair.", "Вызовы API подписываются учётными данными IAM, например роли, а не key pair."],
          ["Opening port 3389 in the security group", "Ports are opened by security group rules; the key pair plays no part.", "Порты открывают правилами security group; key pair тут ни при чём."],
        ], "For Windows, EC2 encrypts the generated Administrator password with your public key; only your private key can decrypt it for RDP.", "Для Windows EC2 шифрует сгенерированный пароль Administrator публичным ключом; расшифровать его для RDP может только приватный ключ."),
        qx("A developer lost the .pem file of the key pair used by a running Linux instance. Which statement is true?", "AWS cannot provide that private key again", [
          ["It can be re-downloaded from the EC2 console", "The private key is offered once, at creation; the console cannot give it again.", "Приватный ключ отдаётся один раз, при создании; повторно консоль его не выдаст."],
          ["AWS Support can e-mail a copy of the file", "AWS does not store the private key at all, so there is nothing to send.", "AWS вообще не хранит приватный ключ, отправлять нечего."],
          ["The public key can be used to log in instead", "SSH needs the private key; the public key on the server only checks it.", "Для SSH нужен приватный ключ; публичный на сервере только проверяет его."],
        ], "AWS keeps only the public key. A lost private key means regaining access another way (e.g. EC2 Instance Connect, Session Manager or replacing the key on the volume).", "AWS хранит только публичный ключ. Потерянный приватный ключ означает, что доступ придётся вернуть иначе (EC2 Instance Connect, Session Manager или замена ключа на томе)."),
        qx("A company wants one generic Amazon Linux AMI but different software on web and worker servers, without maintaining many custom AMIs. What should it use?", "A different user data script for each role", [
          ["A different key pair for each server role", "Key pairs control who logs in; they install nothing.", "Key pair определяет, кто входит, и ничего не устанавливает."],
          ["A separate VPC for each kind of server role", "Network isolation does not install software on the servers.", "Сетевая изоляция не устанавливает программ на серверы."],
          ["Community AMIs prepared by other users", "Community AMIs are not checked by AWS and still multiply the images to trust and patch.", "Community AMI не проверяются AWS и всё равно умножают число образов, которым надо доверять и которые надо обновлять."],
        ], "User data customizes a generic image at first boot, which is the course's 'strategic use' of user data: fewer custom AMIs to build and maintain.", "User data донастраивает общий образ при первой загрузке — это и есть «стратегическое использование» user data из курса: меньше собственных AMI, которые надо собирать и поддерживать."),
      ],
    ),
    part(
      "cc-l8-p2",
      { en: "Instance types, families and multi-tenancy", ru: "Типы инстансов, семейства и multi-tenancy" },
      {
        en: `## Reading an instance type name
= t3.micro = family t + generation 3 + size micro
- **Family** (the first letter or letters) — what the instance is optimized for: t and m are general purpose, c is compute, r, x and z are memory, p, g, inf and f are accelerated, i, d and h are storage optimized.
- **Generation** (the number) — higher is newer; a newer generation usually gives **better price-performance**, so prefer m5 over m4 when both fit.
- **Attribute letters** (optional, right after the number): **a** — AMD processor (m5a), **g** — AWS Graviton Arm processor (m6g), **d** — local NVMe **instance store** disks (m5d), **n** — enhanced **network** bandwidth (c5n).
- **Size** — nano, micro, small, medium, large, xlarge, 2xlarge … metal. Each step up roughly **doubles** vCPU and memory (the small t3 sizes keep 2 vCPU and double only the memory); **metal** gives you the whole physical server.
@diagram cc8-instance-name
> Exam trap: g as a **family** (g4dn) means GPU graphics; g as an **attribute after the number** (m6g) means a Graviton processor. Likewise a1 is a Graviton family, while a after the number (m5a) means AMD.
## Five categories and what they are for
| Category | Example families | Optimized for | Typical workloads |
|---|---|---|---|
| General purpose | t3, t2, m5, a1 | a **balance** of compute, memory and networking | web servers, code repositories, small databases, dev and test |
| Compute optimized | c5, c4, c5n | **high-performance processors**: a lot of CPU per GB of memory | scientific modeling, climate simulations, batch processing, media transcoding, HPC, dedicated game servers, ad serving, ML inference |
| Memory optimized | r5, x1, z1d | **large data sets processed in memory** | in-memory databases and caches, real-time big data analytics, high-performance relational databases |
| Accelerated computing | p3, g4dn, f1, inf1 | **hardware accelerators** (GPU, FPGA, custom chips) as co-processors | ML training, graphics rendering, floating-point calculations, data pattern matching |
| Storage optimized | i3, d2, h1 | **high sequential read/write and very high IOPS on local storage** | NoSQL databases, data warehousing, Elasticsearch, distributed file systems, low-latency OLTP |
Mnemonic: **C** = CPU, **R** = RAM, **M** = middle (balanced), **T** = turbo (burst), **P/G** = GPU, **I** = IOPS, **D** = dense storage.
## Picking the category from the scenario wording
- "**substantial CPU**", "complex algorithms", "simulations", "batch", "encoding" → **compute optimized**.
- "**large datasets in memory**", "**real-time analytics**", "in-memory database or cache", "fast processing of large volumes of data with quick query results" → **memory optimized**.
- "GPU", "**hardware accelerator**", "deep learning training", "3D rendering" → **accelerated computing**.
- "**high IOPS**", "sequential read/write to local storage", "data warehouse", "NoSQL on local disks" → **storage optimized**.
- "balanced", "typical web application", "unknown profile", "start small" → **general purpose**.
> Exam trap: "large datasets" alone does not mean storage optimized. Ask **where the work happens**: data held **in memory** for fast queries → memory optimized; data streamed **from local disks** with huge IOPS → storage optimized; data **crunched by the CPU** → compute optimized.
## Burstable T instances
T2 and T3 instances give a **baseline** CPU level plus **CPU credits**: an idle instance earns credits, and a busy one spends them to **burst** above the baseline. That suits workloads that are mostly quiet with short peaks — small websites, dev and test, microservices, build servers.
- A T instance that runs at 100% CPU all day spends all its credits and drops to the baseline — or, in **unlimited** mode, keeps bursting and pays for the surplus. For constant heavy load an m or c instance is the better buy.
- Micro sizes (t2.micro, or t3.micro in Regions without t2) are the classic **AWS Free Tier** instances.
## Multi-tenancy and the hypervisor
EC2 instances are **virtual machines**. Many of them, often belonging to **different customers**, run on the same physical **host**; a **hypervisor** — on current instances the **AWS Nitro System**, on older ones Xen — divides the host's CPU, memory, storage and network between them.
- **Multi-tenancy** = each VM is **isolated** from the others, but they **share the resources of one host machine**. This pooling is what makes the cloud cheap (resource pooling, economies of scale).
- Isolation is enforced by the hypervisor: one tenant cannot see another tenant's memory or disks.
- Customers who must not share hardware (compliance, licensing) choose another **tenancy**:
| Tenancy | Hardware | Typical reason |
|---|---|---|
| Shared (default) | a host shared with other AWS customers | cheapest; right for most workloads |
| Dedicated Instance | hardware dedicated to one customer's account | a rule that says "no other customers on my hardware" |
| Dedicated Host | a whole physical server that you control | compliance, per-socket or per-core licenses (BYOL), control of instance placement |
> Exam trap: multi-tenancy is **not** "only one user can use the instance", not "many servers in one data center" and not "one server runs one application". It is **many isolated VMs sharing one host**.
## Network performance
- Bandwidth grows with the size and the family: a t3 gets "up to 5 Gbps", a c5n.18xlarge up to 100 Gbps.
- The n attribute (c5n, m5n) marks network-optimized versions for network-heavy work such as HPC clusters and big data shuffles.
?? A research team runs weather simulations that keep every vCPU at 100% for hours. Which category, and why not memory optimized?
?= Compute optimized (c5): the bottleneck is CPU power, not the amount of RAM.
?? What does the d in m5d.large tell you, and what is the catch?
?= The instance has local NVMe instance store disks — very fast, but their data is lost on stop or terminate.
?? Why can a t3.micro become slow under constant heavy CPU load?
?= It is burstable: once its CPU credits are spent it falls back to the baseline (unless unlimited mode is on, which costs extra).`,
        ru: `## Как читать имя типа инстанса
= t3.micro = family t + generation 3 + size micro
- **Семейство (family)** — первая буква или буквы: под что оптимизирован инстанс. t и m — general purpose, c — compute, r, x и z — memory, p, g, inf и f — accelerated, i, d и h — storage optimized.
- **Поколение (generation)** — цифра: чем выше, тем новее; новое поколение обычно даёт **лучшее соотношение цены и производительности**, поэтому m5 предпочтительнее m4, если подходят оба.
- **Буквы-атрибуты** (необязательные, сразу после цифры): **a** — процессор AMD (m5a), **g** — процессор AWS Graviton на Arm (m6g), **d** — локальные NVMe-диски **instance store** (m5d), **n** — усиленная **сетевая** полоса (c5n).
- **Размер (size)** — nano, micro, small, medium, large, xlarge, 2xlarge … metal. Каждый шаг вверх примерно **удваивает** vCPU и память (у маленьких t3 остаётся 2 vCPU, удваивается только память); **metal** — это весь физический сервер.
@diagram cc8-instance-name
> Ловушка экзамена: g как **семейство** (g4dn) — это GPU для графики; g как **атрибут после цифры** (m6g) — процессор Graviton. Точно так же a1 — семейство на Graviton, а a после цифры (m5a) — это AMD.
## Пять категорий и их назначение
| Категория | Примеры семейств | Под что оптимизирована | Типичные задачи |
|---|---|---|---|
| General purpose | t3, t2, m5, a1 | **баланс** вычислений, памяти и сети | веб-серверы, репозитории кода, небольшие базы данных, разработка и тесты |
| Compute optimized | c5, c4, c5n | **высокопроизводительные процессоры**: много CPU на ГБ памяти | научное моделирование, климатические симуляции, пакетная обработка, перекодирование медиа, HPC, игровые серверы, показ рекламы, ML inference |
| Memory optimized | r5, x1, z1d | **обработка больших наборов данных в памяти** | in-memory базы данных и кэши, аналитика больших данных в реальном времени, высокопроизводительные реляционные БД |
| Accelerated computing | p3, g4dn, f1, inf1 | **аппаратные ускорители** (GPU, FPGA, специальные чипы) как сопроцессоры | обучение ML, рендеринг графики, вычисления с плавающей точкой, поиск шаблонов в данных |
| Storage optimized | i3, d2, h1 | **быстрое последовательное чтение/запись и очень высокий IOPS на локальных дисках** | NoSQL-базы, хранилища данных (data warehouse), Elasticsearch, распределённые файловые системы, OLTP с низкой задержкой |
Мнемоника: **C** = CPU, **R** = RAM, **M** = middle (баланс), **T** = turbo (всплески), **P/G** = GPU, **I** = IOPS, **D** = dense storage (плотное хранение).
## Как узнать категорию по формулировке сценария
- «**substantial CPU**», «сложные алгоритмы», «симуляции», «batch», «кодирование» → **compute optimized**.
- «**большие наборы данных в памяти**», «**real-time analytics**», «in-memory база или кэш», «быстрая обработка больших объёмов данных с быстрыми ответами на запросы» → **memory optimized**.
- «GPU», «**аппаратный ускоритель**», «обучение deep learning», «3D-рендеринг» → **accelerated computing**.
- «**высокий IOPS**», «последовательное чтение/запись на локальные диски», «data warehouse», «NoSQL на локальных дисках» → **storage optimized**.
- «сбалансированная», «типичное веб-приложение», «профиль неизвестен», «начать с малого» → **general purpose**.
> Ловушка экзамена: слова «large datasets» сами по себе не означают storage optimized. Нужно спросить, **где идёт работа**: данные держатся **в памяти** ради быстрых запросов → memory optimized; данные читаются потоком **с локальных дисков** с огромным IOPS → storage optimized; данные **перемалывает процессор** → compute optimized.
## Burstable-инстансы T
Инстансы T2 и T3 дают **базовый уровень (baseline)** CPU плюс **CPU credits (кредиты)**: простаивающий инстанс копит кредиты, а нагруженный тратит их, чтобы **разогнаться (burst)** выше базового уровня. Это подходит нагрузкам, которые в основном спокойны и изредка дают пики, — небольшие сайты, разработка и тесты, микросервисы, серверы сборки.
- T-инстанс, который весь день работает на 100% CPU, растрачивает кредиты и падает до базового уровня — или в режиме **unlimited** продолжает разгоняться и доплачивает за превышение. Для постоянной тяжёлой нагрузки выгоднее инстанс m или c.
- Размеры micro (t2.micro или t3.micro в Region без t2) — классические инстансы **AWS Free Tier**.
## Multi-tenancy и гипервизор
Инстансы EC2 — это **виртуальные машины**. Многие из них, часто принадлежащие **разным клиентам**, работают на одном физическом **хосте**; **гипервизор** — у современных инстансов **AWS Nitro System**, у старых Xen — делит между ними CPU, память, хранилище и сеть хоста.
- **Multi-tenancy (мультиарендность)** = каждая VM **изолирована** от остальных, но все они **делят ресурсы одной хост-машины**. Именно это объединение ресурсов делает облако дешёвым (resource pooling, economies of scale).
- Изоляцию обеспечивает гипервизор: один арендатор не видит память и диски другого.
- Клиенты, которым нельзя делить оборудование (compliance, лицензии), выбирают другую **tenancy (вариант аренды)**:
| Tenancy | Оборудование | Типичная причина |
|---|---|---|
| Shared (по умолчанию) | хост, общий с другими клиентами AWS | дешевле всего; подходит большинству задач |
| Dedicated Instance | оборудование, выделенное аккаунту одного клиента | правило «на моём железе не должно быть других клиентов» |
| Dedicated Host | целый физический сервер под контролем клиента | compliance, лицензии на сокет или ядро (BYOL), контроль размещения инстансов |
> Ловушка экзамена: multi-tenancy — это **не** «инстансом может пользоваться только один пользователь», не «много серверов в одном дата-центре» и не «один сервер — одно приложение». Это **много изолированных VM на одном общем хосте**.
## Сетевая производительность
- Полоса растёт с размером и семейством: у t3 — «up to 5 Gbps», у c5n.18xlarge — до 100 Gbps.
- Атрибут n (c5n, m5n) отмечает версии с усиленной сетью для сетевых нагрузок вроде HPC-кластеров и перетасовки больших данных.
?? Научная группа гоняет погодные симуляции, которые часами держат все vCPU на 100%. Какая категория и почему не memory optimized?
?= Compute optimized (c5): узкое место — мощность процессора, а не объём RAM.
?? Что говорит буква d в m5d.large и в чём подвох?
?= У инстанса есть локальные NVMe-диски instance store — очень быстрые, но их данные теряются при stop или terminate.
?? Почему t3.micro может тормозить под постоянной высокой нагрузкой на CPU?
?= Он burstable: когда CPU credits кончаются, он падает до базового уровня (если не включён режим unlimited, за который доплачивают).`,
      },
      [
        qx("In the instance type t3.micro, what do t, 3 and micro stand for?", "Family, generation and size", [
          ["Generation, family and size", "The order is wrong: the letter is the family and the number is the generation.", "Порядок перепутан: буква — семейство, цифра — поколение."],
          ["Tenancy, tier and memory size", "Tenancy is a separate launch setting, and micro is a size, not an amount of memory.", "Tenancy — отдельная настройка запуска, а micro — размер, а не объём памяти."],
          ["Type, version and Region code", "Instance type names contain no Region; the same name exists in many Regions.", "В имени типа нет Region; одно и то же имя есть во многих Region."],
        ], "t = family (burstable general purpose), 3 = third generation, micro = size within the family.", "t — семейство (burstable general purpose), 3 — третье поколение, micro — размер внутри семейства."),
        qx("What does the letter n in c5n.xlarge indicate?", "Enhanced network bandwidth", [
          ["Nano size within the c5 family", "The size comes after the dot (xlarge); n before the dot is an attribute.", "Размер стоит после точки (xlarge); n до точки — это атрибут."],
          ["Local NVMe instance store", "Local NVMe disks are marked with d, as in c5d or m5d.", "Локальные NVMe-диски обозначаются буквой d, как в c5d или m5d."],
          ["A newer generation than c5", "The generation is the number 5; letters after it are attributes.", "Поколение — цифра 5; буквы после неё — атрибуты."],
        ], "n marks network-optimized variants such as c5n, which reach up to 100 Gbps at the largest size.", "n отмечает версии с усиленной сетью, такие как c5n: у самого большого размера до 100 Gbps."),
        qx("Which instance type comes with local NVMe instance store disks?", "m5d.large", [
          ["m5.large", "Plain m5 is EBS-only; it has no local instance store.", "Обычный m5 работает только с EBS, локального instance store у него нет."],
          ["m5n.large", "n means enhanced networking, not local disks.", "n означает усиленную сеть, а не локальные диски."],
          ["m5a.large", "a means an AMD processor, not local disks.", "a означает процессор AMD, а не локальные диски."],
        ], "The d attribute adds local NVMe instance store volumes — fast, but ephemeral.", "Атрибут d добавляет локальные тома NVMe instance store — быстрые, но временные."),
        qx("A university team runs climate modeling simulations that need substantial CPU power for complex algorithms. Why are compute optimized instances ideal?", "They suit tasks that need significant CPU power", [
          ["They hold very large datasets in memory for speed", "That describes memory optimized instances (r5, x1, z1d).", "Это описание memory optimized (r5, x1, z1d)."],
          ["They give the highest throughput to local storage", "That describes storage optimized instances (i3, d2, h1).", "Это описание storage optimized (i3, d2, h1)."],
          ["They add hardware accelerators such as GPUs", "Hardware accelerators are the accelerated computing category (p3, g4dn, f1).", "Аппаратные ускорители — это категория accelerated computing (p3, g4dn, f1)."],
        ], "Compute optimized instances have high-performance processors and the most CPU per GB of memory — right for simulations, scientific modeling and batch work.", "У compute optimized мощные процессоры и больше всего CPU на ГБ памяти — то, что нужно для симуляций, научного моделирования и пакетной обработки."),
        qx("A financial institution runs real-time analytics that must process large volumes of data quickly and return fast query results. Which instance category is the BEST fit?", "Memory optimized", [
          ["Storage optimized", "Storage optimized wins when data is streamed from local disks with high IOPS, not when it must sit in RAM for instant queries.", "Storage optimized выигрывает, когда данные читаются с локальных дисков с высоким IOPS, а не когда они должны лежать в RAM ради мгновенных запросов."],
          ["Compute optimized", "Here the bottleneck is holding and scanning large data in memory, not raw CPU.", "Здесь узкое место — держать и сканировать большие данные в памяти, а не чистая мощность CPU."],
          ["General purpose", "A balanced instance has too little memory per vCPU for large in-memory datasets.", "У сбалансированного инстанса слишком мало памяти на vCPU для больших данных в памяти."],
        ], "Real-time big data analytics and in-memory databases are the textbook workloads of memory optimized instances (r5, x1).", "Аналитика больших данных в реальном времени и in-memory базы — хрестоматийные задачи memory optimized (r5, x1)."),
        qx("A NoSQL database needs very high random IOPS on local disks with low latency. Which category fits?", "Storage optimized (i3)", [
          ["Memory optimized (r5)", "Memory optimized adds RAM, not local disk IOPS.", "Memory optimized добавляет RAM, а не IOPS локальных дисков."],
          ["Compute optimized (c5)", "Compute optimized adds CPU; c5 is EBS-only without local NVMe disks.", "Compute optimized добавляет CPU; c5 работает только с EBS, без локальных NVMe-дисков."],
          ["General purpose (t3)", "A burstable t3 has no local disks and modest I/O.", "У burstable t3 нет локальных дисков и скромный ввод-вывод."],
        ], "Storage optimized instances deliver tens of thousands of low-latency random IOPS from local NVMe — NoSQL, data warehousing, OLTP.", "Storage optimized дают десятки тысяч случайных IOPS с низкой задержкой с локальных NVMe — NoSQL, data warehouse, OLTP."),
        qx("A studio needs GPUs to render 3D frames. Which instance type is designed for this?", "g4dn.xlarge", [
          ["c5n.xlarge", "c5n is compute optimized with fast networking, but has no GPU.", "c5n — compute optimized с быстрой сетью, но без GPU."],
          ["r5d.xlarge", "r5d is memory optimized with local disks, but has no GPU.", "r5d — memory optimized с локальными дисками, но без GPU."],
          ["i3en.xlarge", "i3en is storage optimized for dense local storage, but has no GPU.", "i3en — storage optimized для объёмного локального хранения, но без GPU."],
        ], "g families (g4dn) are accelerated computing instances with GPUs for graphics and ML inference.", "Семейства g (g4dn) — accelerated computing с GPU для графики и ML inference."),
        qx("A small company website is idle most of the day and has short traffic spikes. Which instance is the most cost-effective fit?", "t3.small", [
          ["c5.large", "Compute optimized power is wasted on a mostly idle site and costs more.", "Мощность compute optimized простаивает на почти пустом сайте и стоит дороже."],
          ["x1.16xlarge", "A huge memory optimized instance is far beyond the needs of a small website.", "Огромный memory optimized инстанс намного превышает нужды небольшого сайта."],
          ["p3.2xlarge", "A GPU instance is for ML and graphics, not for a small website.", "Инстанс с GPU нужен для ML и графики, а не для маленького сайта."],
        ], "Burstable T instances earn CPU credits while idle and spend them on spikes — cheap for low average load with peaks.", "Burstable-инстансы T копят CPU credits в простое и тратят их на пиках — дёшево для низкой средней нагрузки с всплесками."),
        qx("Which statement describes T3 burstable instances?", "They bank CPU credits when idle and burst with them", [
          ["AWS may reclaim them with a two-minute warning", "Reclaiming with a 2-minute notice describes Spot Instances, a purchase option.", "Отзыв с предупреждением за 2 минуты — это Spot Instances, вариант покупки."],
          ["They are sold only as Dedicated Hosts with BYOL licenses", "T3 instances run on shared tenancy by default; Dedicated Hosts are optional.", "T3 по умолчанию работают на общей tenancy; Dedicated Hosts — лишь опция."],
          ["They keep every vCPU at full speed at all times", "They run at a baseline and only burst above it while they have credits.", "Они работают на базовом уровне и разгоняются выше лишь пока есть кредиты."],
        ], "T instances provide a baseline CPU level and accumulate credits to burst above it when needed.", "Инстансы T дают базовый уровень CPU и копят кредиты, чтобы при необходимости разгоняться выше него."),
        tfx("A t3.micro that runs at full CPU around the clock is a good long-term choice, because burstable instances never slow down.", false,
          "Under constant load the credits run out and the instance drops to its baseline (or pays extra in unlimited mode); m or c instances fit steady heavy load better.",
          "При постоянной нагрузке кредиты кончаются, и инстанс падает до базового уровня (или доплачивает в режиме unlimited); для ровной тяжёлой нагрузки лучше подходят m или c.",
          "'True' ignores how bursting works: it is funded by credits that a constantly busy instance cannot earn.",
          "Ответ «верно» не учитывает механику: разгон оплачивается кредитами, которые постоянно занятый инстанс не успевает накопить."),
        qx("What is multi-tenancy in the context of Amazon EC2 instances?", "Each VM is isolated but shares a host's resources", [
          ["Only one user at a time can log in to an instance", "Multi-tenancy is about VMs sharing hardware, not about how many users log in.", "Multi-tenancy — про то, что VM делят оборудование, а не про число входящих пользователей."],
          ["Multiple servers run in the same data center", "Many servers in one building is just a data center, not multi-tenancy.", "Много серверов в одном здании — это просто дата-центр, а не multi-tenancy."],
          ["A server can run only one type of application", "Multi-tenancy puts many different workloads on one host — the opposite.", "При multi-tenancy на одном хосте работают много разных нагрузок — это противоположность."],
        ], "Many isolated virtual machines, often of different customers, share the CPU, memory and network of one physical host through the hypervisor.", "Много изолированных виртуальных машин, часто разных клиентов, делят CPU, память и сеть одного физического хоста через гипервизор."),
        qx("Which component keeps EC2 instances that share one physical host isolated from each other?", "The hypervisor (the Nitro System)", [
          ["The security group attached to each VM", "A security group filters network traffic; it does not separate memory or CPU.", "Security group фильтрует сетевой трафик и не разделяет память или CPU."],
          ["The internet gateway of the VPC", "The internet gateway connects a VPC to the internet and has no role in host isolation.", "Internet gateway связывает VPC с интернетом и к изоляции на хосте отношения не имеет."],
          ["The key pair chosen at launch", "A key pair controls logins to one instance, not isolation between VMs.", "Key pair управляет входом в один инстанс, а не изоляцией между VM."],
        ], "The hypervisor (AWS Nitro on current instances) gives each VM its own slice of CPU and memory and stops it from touching other tenants.", "Гипервизор (AWS Nitro у современных инстансов) выделяет каждой VM свою долю CPU и памяти и не даёт ей касаться других арендаторов."),
        qx("A bank's policy says no other AWS customer's VMs may run on the hardware hosting its instances. It does not need to see sockets or cores. What is the simplest option?", "Dedicated Instances", [
          ["Shared (default) tenancy", "Shared tenancy is exactly what the policy forbids: other customers on the same host.", "Shared tenancy — ровно то, что запрещает политика: другие клиенты на том же хосте."],
          ["Spot Instances", "Spot is a price model on spare capacity; it still runs on shared hosts.", "Spot — модель цены на свободных мощностях; инстансы всё равно на общих хостах."],
          ["Burstable T3 instances", "T3 is an instance family; it says nothing about who shares the hardware.", "T3 — семейство инстансов; оно ничего не говорит о том, кто делит оборудование."],
        ], "Dedicated Instances run on hardware dedicated to one customer; Dedicated Hosts add socket/core visibility and placement control, which is not required here.", "Dedicated Instances работают на оборудовании одного клиента; Dedicated Hosts добавляют видимость сокетов и ядер и контроль размещения, а здесь это не требуется."),
        qx("Both m4 and m5 fit a workload. Which should you normally prefer, and why?", "m5 — a newer generation, better price-performance", [
          ["m4 — older generations are always the cheaper ones", "Older hardware is often more expensive per unit of performance, not cheaper.", "Старое оборудование часто дороже в пересчёте на производительность, а не дешевле."],
          ["Either — the number is only the AMI version label", "The number is the instance generation, not anything about the AMI.", "Цифра — поколение инстанса, к AMI она отношения не имеет."],
          ["m4 — the lower number means a larger instance", "Size is written after the dot; the number is the generation.", "Размер пишется после точки; цифра — это поколение."],
        ], "Higher generation numbers are newer hardware and usually offer better performance for the price.", "Большая цифра поколения — более новое оборудование, обычно с лучшей производительностью за те же деньги."),
        qx("Which set lists only memory optimized families?", "r5, x1, z1d", [
          ["c5, c4, c5n", "These are compute optimized families.", "Это семейства compute optimized."],
          ["i3, d2, h1", "These are storage optimized families.", "Это семейства storage optimized."],
          ["p3, g4dn, f1", "These are accelerated computing families.", "Это семейства accelerated computing."],
        ], "R (RAM), X (extra-large memory) and z1d are the memory optimized families in the course.", "R (RAM), X (очень много памяти) и z1d — семейства memory optimized в курсе."),
        qx("Which workload is the WORST match for compute optimized instances?", "An in-memory cache holding 500 GB of data", [
          ["A farm that transcodes video files", "Media transcoding is CPU-bound — a classic compute optimized workload.", "Перекодирование медиа упирается в CPU — классическая задача compute optimized."],
          ["A batch job running scientific simulations", "Batch scientific modeling is a textbook compute optimized use.", "Пакетное научное моделирование — хрестоматийное применение compute optimized."],
          ["A dedicated multiplayer game server", "Dedicated game servers are listed among compute optimized uses.", "Выделенные игровые серверы входят в список задач compute optimized."],
        ], "A 500 GB in-memory cache needs lots of RAM per vCPU — memory optimized; compute optimized has the least memory per CPU.", "Кэш на 500 ГБ в памяти требует много RAM на vCPU — это memory optimized; у compute optimized меньше всего памяти на CPU."),
        qx("A typical web application with a database has a balanced, not yet known profile. Which category should it start on?", "General purpose, such as m5 or t3", [
          ["Accelerated computing, such as p3", "GPUs add cost with no benefit for an ordinary web application.", "GPU добавляют расходы без пользы для обычного веб-приложения."],
          ["Storage optimized, such as i3", "Nothing suggests a need for extreme local disk IOPS.", "Ничто не говорит о потребности в экстремальном IOPS локальных дисков."],
          ["Memory optimized, such as x1", "x1 instances are huge memory machines — wasteful for an unknown, ordinary load.", "x1 — огромные машины по памяти; для обычной неизвестной нагрузки это расточительно."],
        ], "General purpose instances balance CPU, memory and network; once metrics show a bottleneck you can right-size to another family.", "General purpose уравновешивают CPU, память и сеть; когда метрики покажут узкое место, можно перейти на другое семейство."),
        qx("What does the g in m6g.large mean?", "An AWS Graviton (Arm) processor", [
          ["An attached GPU for graphics work", "GPUs are the g family (g4dn) at the start of the name, not g after the number.", "GPU — это семейство g (g4dn) в начале имени, а не g после цифры."],
          ["The general purpose category letter", "m already says general purpose; letters after the number are attributes.", "Буква m уже означает general purpose; буквы после цифры — атрибуты."],
          ["Gigabit network bandwidth", "Network-optimized variants are marked with n, as in m5n.", "Версии с усиленной сетью обозначаются n, как в m5n."],
        ], "An attribute g after the generation number marks AWS Graviton, Arm-based processors with good price-performance.", "Атрибут g после цифры поколения обозначает процессоры AWS Graviton на Arm с хорошим соотношением цены и производительности."),
        tfx("Multi-tenancy means EC2 instances of different customers can read each other's memory because they share one host.", false,
          "They share the host's hardware, but the hypervisor isolates each VM — no tenant can see another tenant's memory or disks.",
          "Они делят оборудование хоста, но гипервизор изолирует каждую VM — ни один арендатор не видит память или диски другого.",
          "'True' mixes up sharing hardware with sharing data; isolation is the whole point of the hypervisor.",
          "Ответ «верно» путает общее оборудование с общими данными; изоляция — главная задача гипервизора."),
        qx("Analysts say the workload 'processes large datasets'. Which follow-up question best decides between memory optimized and storage optimized?", "Is the data held in RAM or read from local disk?", [
          ["Is the data encrypted at rest with AWS KMS keys?", "Encryption is available on every category and does not change the choice.", "Шифрование доступно в любой категории и на выбор не влияет."],
          ["Which Region will store the data for the team?", "Every category exists in many Regions; location does not pick the family.", "Каждая категория есть во многих Region; место не определяет семейство."],
          ["How many IAM users will run the analysis jobs?", "The number of IAM users says nothing about RAM or disk needs.", "Число пользователей IAM ничего не говорит о потребностях в RAM или дисках."],
        ], "Data worked on in memory points to memory optimized; data streamed from local disks with high IOPS points to storage optimized.", "Данные, которые обрабатываются в памяти, указывают на memory optimized; данные, которые читаются с локальных дисков с высоким IOPS, — на storage optimized."),
      ],
    ),
    part(
      "cc-l8-p3",
      { en: "Lifecycle, IP addresses, monitoring and Lab 3", ru: "Жизненный цикл, IP-адреса, мониторинг и Lab 3" },
      {
        en: `## Instance states
| State | What is happening | Billed for instance usage? |
|---|---|---|
| pending | launching from the AMI, or starting from stopped; being placed on a host | no |
| running | booted and usable | **yes** |
| rebooting | the OS restarts; the instance stays on the same host | yes |
| stopping | preparing to stop (or to hibernate) | no (yes when preparing to hibernate) |
| stopped | shut down; EBS volumes remain | **no** — but you still pay for EBS storage and Elastic IPs |
| shutting-down | preparing to terminate | no |
| terminated | permanently deleted; cannot be started again | no |
@diagram cc8-lifecycle
- Only **EBS-backed** instances can be **stopped**; an instance whose root device is instance store can only be rebooted or terminated.
- A terminated instance stays visible in the console for a while (about an hour), then disappears.
- Reboot through the console or the API rather than from inside the OS: AWS then records the action and forces a hard reboot if the OS hangs.
## Reboot, stop, hibernate, terminate — what survives
| Action | Host | EBS data | Instance store data | Public IPv4 | Private IPv4 | RAM |
|---|---|---|---|---|---|---|
| Reboot | same | kept | kept | kept | kept | cleared |
| Stop → start | usually a new one | kept | **lost** | **new one** (unless Elastic IP) | kept | cleared |
| Hibernate → start | usually a new one | kept | lost | new one | kept | **saved to the EBS root and restored** |
| Terminate | released | root deleted by default; other volumes per their flag | lost | released | released | gone |
> Exam trap: "You stop an EC2 instance that has an EBS root volume — what happens to the data?" — it **persists**. Data is lost only on **instance store** volumes, or when the instance is **terminated** with delete on termination switched on.
- **Hibernate** saves the contents of RAM to the **encrypted EBS root volume**; after start, processes and in-memory state continue where they stopped — useful for apps with a long warm-up (caches, big in-memory structures).
- Stopping is how you **save money** on idle servers: no instance charges while stopped, only storage.
## Public IP, private IP and Elastic IP
- **Private IPv4** — taken from the subnet's CIDR; stays with the instance for its whole life, including stop and start; used inside the VPC.
- **Public IPv4** (auto-assigned) — comes from Amazon's pool; **released at stop** and replaced by a new one at start, so the **public DNS name changes** too. A reboot keeps it.
- **Elastic IP address** — a **static** public IPv4 allocated to your account; you **associate** it with an instance or network interface. It survives stop and start and can be **remapped** to another instance within seconds (simple failover). It belongs to a Region and stays yours until you **release** it; an Elastic IP that sits unused still costs money. Default quota: 5 per Region.
= reboot: all IPs kept | stop/start: new public IPv4, same private IPv4 | Elastic IP: same public IPv4
## Termination protection
**Termination protection** (the attribute DisableApiTermination) blocks termination from the console, the CLI and the API. To terminate, first **disable** it: Actions → Instance settings → Change termination protection.
- It does **not** block a shutdown from inside the OS when the instance's **shutdown behavior** is set to terminate, and it does not stop an **Auto Scaling** scale-in or a **Spot interruption**.
- A separate **stop protection** blocks accidental stops.
- If a user cannot terminate an instance that has no protection, look at **IAM**: the policy may allow ec2:StartInstances and ec2:StopInstances but not ec2:TerminateInstances.
## Monitoring an instance
- **Status checks** run every minute. **System status check** — problems on the AWS side of the host: hardware, power, network (fix: stop and start to move to healthy hardware). **Instance status check** — problems inside your instance: OS, network configuration, a full disk (fix: reboot or repair the configuration).
- **Amazon CloudWatch** metrics: **basic monitoring** — free, data every **5 minutes**; **detailed monitoring** — paid, every **1 minute**. Default metrics include CPU utilization, network in and out, disk operations and status checks; **memory utilization is not** collected without the **CloudWatch agent**.
- **Get system log** — the console output of the boot: did user data install the packages? are there kernel or service errors?
- **Get instance screenshot** — a picture of the instance's console when you cannot connect to it.
- **Service Quotas** — EC2 limits per Region, e.g. the number of vCPUs for running On-Demand standard instances; increases are requested there.
## Lab 3 — Introduction to Amazon EC2
| Task | What is done | Lesson |
|---|---|---|
| 1. Launch | name Web Server, Amazon Linux AMI, a micro burstable type, key pair vockey, Lab VPC, a new security group, 8 GiB EBS, **termination protection enabled**, user data that installs Apache | the nine decisions in practice |
| 2. Monitor | Status checks tab, Monitoring tab (CloudWatch), Get system log, Get instance screenshot | where to look when something is wrong |
| 3. Security group | the browser cannot open the page → add inbound **HTTP, TCP 80, source 0.0.0.0/0** to the existing group | rules apply immediately, no reboot |
| 4. Resize | **stop** → change instance type (micro → small) → modify the EBS volume 8 → 10 GiB → **start** | the type changes only while the instance is stopped |
| 5. EC2 limits | browse Service Quotas for EC2 | quotas are per Region |
| 6. Termination protection | Terminate → error; disable protection → Terminate succeeds | protection prevents accidents |
- Instance type: the lab starts with a **micro** burstable instance (the classic lab text uses **t2.micro**) and resizes it one step up to the **small** size (**t2.small**). Newer console versions may preselect t3 types — what matters is the procedure: stop, change type, start.
- An EBS volume can be made **bigger** but never smaller.
> Troubleshooting "the web server runs but the browser cannot open it": does it have a public IP? → does the security group allow **TCP 80 inbound**? → did the service start (system log)? → does the subnet route 0.0.0.0/0 to an internet gateway? The usual exam answer: **add an inbound rule for TCP port 80 to the existing security group**.
?? You stop and start an instance with an EBS root and an instance store volume. What survives?
?= The EBS root with its data and the private IP; the instance store data and the auto-assigned public IP are lost.
?? Why did Terminate fail in Lab 3, and how is it fixed?
?= Termination protection was enabled at launch; disable it (Change termination protection), then terminate.
?? A partner allow-lists your server's public IP, and the server is stopped every night. What keeps the address stable?
?= An Elastic IP address associated with the instance.`,
        ru: `## Состояния инстанса
| Состояние | Что происходит | Оплата за работу инстанса? |
|---|---|---|
| pending | запуск из AMI или старт после остановки; инстанс размещается на хосте | нет |
| running | загружен и готов к работе | **да** |
| rebooting | перезапуск ОС; инстанс остаётся на том же хосте | да |
| stopping | подготовка к остановке (или к hibernate) | нет (да при подготовке к hibernate) |
| stopped | выключен; тома EBS остаются | **нет** — но хранение EBS и Elastic IP оплачиваются |
| shutting-down | подготовка к удалению | нет |
| terminated | удалён навсегда; запустить снова нельзя | нет |
@diagram cc8-lifecycle
- **Остановить (stop)** можно только инстанс с **EBS**; инстанс, у которого корневое устройство — instance store, можно только перезагрузить или удалить.
- Удалённый инстанс ещё какое-то время (около часа) виден в консоли, потом исчезает.
- Перезагружать лучше через консоль или API, а не изнутри ОС: тогда AWS фиксирует действие и делает жёсткую перезагрузку, если ОС зависла.
## Reboot, stop, hibernate, terminate — что сохраняется
| Действие | Хост | Данные EBS | Данные instance store | Public IPv4 | Private IPv4 | RAM |
|---|---|---|---|---|---|---|
| Reboot | тот же | сохраняются | сохраняются | сохраняется | сохраняется | очищается |
| Stop → start | обычно новый | сохраняются | **теряются** | **новый** (если нет Elastic IP) | сохраняется | очищается |
| Hibernate → start | обычно новый | сохраняются | теряются | новый | сохраняется | **сохраняется на корневой EBS и восстанавливается** |
| Terminate | освобождается | корневой удаляется по умолчанию; остальные — по своему флагу | теряются | освобождается | освобождается | пропадает |
> Ловушка экзамена: «Инстанс EC2 с корневым томом EBS остановили — что с данными?» — они **сохраняются**. Данные теряются только на томах **instance store** или при **terminate** с включённым delete on termination.
- **Hibernate** сохраняет содержимое RAM на **зашифрованный корневой том EBS**; после старта процессы и данные в памяти продолжают с того же места — полезно для приложений с долгим «прогревом» (кэши, большие структуры в памяти).
- Остановка — способ **сэкономить** на простаивающих серверах: пока инстанс остановлен, платить за него не нужно, только за хранилище.
## Public IP, private IP и Elastic IP
- **Private IPv4** — берётся из CIDR подсети; остаётся с инстансом на всю жизнь, в том числе после stop и start; используется внутри VPC.
- **Public IPv4** (auto-assigned) — из пула Amazon; **освобождается при stop** и при start заменяется новым, поэтому меняется и **публичное DNS-имя**. Reboot его сохраняет.
- **Elastic IP address** — **постоянный (static)** публичный IPv4, выделенный аккаунту; его **связывают (associate)** с инстансом или сетевым интерфейсом. Он переживает stop и start и за секунды **переназначается** на другой инстанс (простой failover). Он принадлежит Region и остаётся за аккаунтом, пока его не **освободят (release)**; простаивающий Elastic IP тоже стоит денег. Квота по умолчанию — 5 на Region.
= reboot: all IPs kept | stop/start: new public IPv4, same private IPv4 | Elastic IP: same public IPv4
## Termination protection
**Termination protection (защита от удаления)** — атрибут DisableApiTermination — блокирует удаление из консоли, CLI и API. Чтобы удалить инстанс, защиту сначала **выключают**: Actions → Instance settings → Change termination protection.
- Она **не** мешает выключению изнутри ОС, если **shutdown behavior** инстанса — terminate, и не останавливает scale-in в **Auto Scaling** или **прерывание Spot**.
- Отдельная **stop protection** защищает от случайной остановки.
- Если пользователь не может удалить инстанс без защиты, смотреть нужно в **IAM**: политика может разрешать ec2:StartInstances и ec2:StopInstances, но не ec2:TerminateInstances.
## Мониторинг инстанса
- **Status checks (проверки состояния)** идут каждую минуту. **System status check** — проблемы на стороне AWS: оборудование, питание, сеть хоста (лечится stop и start — переезд на исправное железо). **Instance status check** — проблемы внутри самого инстанса: ОС, сетевые настройки, переполненный диск (лечится перезагрузкой или исправлением настроек).
- Метрики **Amazon CloudWatch**: **basic monitoring** — бесплатно, данные каждые **5 минут**; **detailed monitoring** — платно, каждую **1 минуту**. По умолчанию есть загрузка CPU, входящий и исходящий трафик, дисковые операции и status checks; **загрузка памяти не** собирается без **CloudWatch agent**.
- **Get system log** — вывод консоли при загрузке: поставил ли user data пакеты? есть ли ошибки ядра или сервисов?
- **Get instance screenshot** — снимок консоли инстанса, когда подключиться к нему не получается.
- **Service Quotas** — лимиты EC2 по Region, например число vCPU для работающих On-Demand standard инстансов; там же запрашивают увеличение.
## Lab 3 — Introduction to Amazon EC2
| Задание | Что делается | Вывод |
|---|---|---|
| 1. Launch | имя Web Server, AMI Amazon Linux, burstable-тип размера micro, key pair vockey, Lab VPC, новая security group, 8 GiB EBS, **termination protection включена**, user data ставит Apache | девять решений на практике |
| 2. Monitor | вкладка Status checks, вкладка Monitoring (CloudWatch), Get system log, Get instance screenshot | куда смотреть, когда что-то не так |
| 3. Security group | браузер не открывает страницу → в существующую группу добавляется входящее правило **HTTP, TCP 80, источник 0.0.0.0/0** | правила действуют сразу, без перезагрузки |
| 4. Resize | **stop** → смена instance type (micro → small) → увеличение тома EBS 8 → 10 GiB → **start** | тип меняется только у остановленного инстанса |
| 5. EC2 limits | просмотр Service Quotas для EC2 | квоты действуют на Region |
| 6. Termination protection | Terminate → ошибка; защита выключена → Terminate проходит | защита спасает от случайностей |
- Тип инстанса: лаба начинается с burstable-инстанса размера **micro** (в классическом тексте лабы — **t2.micro**) и увеличивает его на шаг, до размера **small** (**t2.small**). Новые версии консоли могут подставлять типы t3 — важна сама процедура: stop, смена типа, start.
- Том EBS можно **увеличить**, но не уменьшить.
> Диагностика «веб-сервер работает, а браузер страницу не открывает»: есть ли public IP? → разрешает ли security group **входящий TCP 80**? → запустился ли сервис (system log)? → есть ли в подсети маршрут 0.0.0.0/0 на internet gateway? Обычный ответ на экзамене: **добавить в существующую security group входящее правило для TCP-порта 80**.
?? Инстанс с корневым EBS и томом instance store остановили и запустили. Что сохранилось?
?= Корневой EBS с данными и private IP; данные instance store и автоматически выданный public IP потеряны.
?? Почему в Lab 3 не получился Terminate и как это исправить?
?= При запуске была включена termination protection; её выключают (Change termination protection), затем удаляют инстанс.
?? Партнёр пускает трафик только с публичного IP сервера, а сервер каждую ночь останавливают. Как сохранить адрес неизменным?
?= Связать с инстансом Elastic IP address.`,
      },
      [
        qx("You stop an EC2 instance whose root volume is Amazon EBS. What happens to the data on the root volume?", "It persists and is there after the next start", [
          ["It is erased, just as on an instance store disk", "Erasing on stop is the behavior of instance store, not of EBS.", "Стирание при остановке — поведение instance store, а не EBS."],
          ["It is moved to an instance store volume", "Nothing is moved; the EBS volume simply stays attached to the stopped instance.", "Ничего не переносится; том EBS просто остаётся подключённым к остановленному инстансу."],
          ["It survives only if a snapshot was taken first", "Snapshots protect against loss or termination; a plain stop keeps EBS data anyway.", "Snapshots защищают от потери или удаления; при обычной остановке данные EBS и так сохраняются."],
        ], "EBS is persistent, network-attached storage; stopping the instance does not touch its data.", "EBS — постоянное хранилище, подключённое по сети; остановка инстанса его данные не затрагивает."),
        qx("An instance keeps temporary files on an instance store volume and is rebooted, not stopped. What happens to the files?", "They are kept; a reboot preserves them", [
          ["They are lost, just as after a stop", "A stop moves the instance off its host, a reboot does not — so the disks and their data stay.", "Stop уводит инстанс с хоста, а reboot — нет, поэтому диски и данные остаются."],
          ["They are uploaded to S3 before the reboot", "AWS never copies instance store data anywhere on its own.", "AWS никогда сам не копирует данные instance store."],
          ["They move to the root EBS volume", "Nothing moves; the same physical disks stay attached.", "Ничего не переносится; остаются те же физические диски."],
        ], "A reboot keeps the instance on the same host, so instance store data survives; stop, hibernate and terminate lose it.", "При reboot инстанс остаётся на том же хосте, и данные instance store сохраняются; stop, hibernate и terminate их теряют."),
        qx("After a stop and a start, which attribute of an instance without an Elastic IP usually changes?", "Its auto-assigned public IPv4 address", [
          ["Its private IPv4 address in the subnet", "The private IPv4 address stays with the instance for its whole life.", "Частный IPv4 остаётся с инстансом на всю его жизнь."],
          ["Its instance ID shown in the console", "The instance ID never changes; it identifies the instance until termination.", "Instance ID никогда не меняется — он идентифицирует инстанс до удаления."],
          ["The set of EBS volumes attached to it", "EBS volumes stay attached through a stop and start.", "Тома EBS остаются подключёнными при stop и start."],
        ], "The auto-assigned public IPv4 (and the public DNS name) is released at stop; a new one is assigned at start.", "Автоматически выданный public IPv4 (и публичное DNS-имя) освобождается при stop; при start выдаётся новый."),
        qx("A partner's firewall allows traffic only from one fixed public IP of your server, and the server is stopped every night. What should you use?", "An Elastic IP address", [
          ["A larger instance type", "Instance size has nothing to do with whether the public IP changes.", "Размер инстанса не влияет на то, меняется ли public IP."],
          ["The private IPv4 address", "Private addresses are not reachable from the partner's network over the internet.", "Частные адреса недоступны из сети партнёра через интернет."],
          ["A new key pair each night", "Key pairs are for logging in; they do not affect IP addresses.", "Key pair нужен для входа и на IP-адреса не влияет."],
        ], "An Elastic IP is a static public IPv4 that stays associated through stop and start.", "Elastic IP — постоянный публичный IPv4, который остаётся связанным с инстансом при stop и start."),
        qx("An EBS-backed instance has been stopped for a week. What still costs money during that week?", "Its EBS volumes and any Elastic IP", [
          ["Its vCPU hours at the On-Demand rate", "Instance usage is not billed in the stopped state.", "В состоянии stopped работа инстанса не оплачивается."],
          ["Nothing at all while it stays stopped", "Storage is still provisioned and billed per GB-month, even with the instance stopped.", "Хранилище остаётся выделенным и оплачивается за ГБ в месяц, даже когда инстанс остановлен."],
          ["Its instance store volumes", "Instance store is released at stop, so there is nothing to bill.", "Instance store освобождается при остановке, платить не за что."],
        ], "A stopped instance costs nothing for compute, but its EBS storage and allocated Elastic IPs keep being billed.", "Остановленный инстанс ничего не стоит по вычислениям, но хранение EBS и выделенные Elastic IP продолжают оплачиваться."),
        qx("Which statement about the terminated state is correct?", "The instance can never be started again", [
          ["It can be restarted within one hour", "It stays visible for about an hour, but it cannot be started — it is gone.", "Он виден около часа, но запустить его нельзя — он удалён."],
          ["It keeps all its EBS volumes by default", "The root volume is deleted by default (delete on termination).", "Корневой том по умолчанию удаляется (delete on termination)."],
          ["It is billed at a reduced hourly rate", "Terminated instances are not billed at all.", "Удалённые инстансы не оплачиваются вовсе."],
        ], "Terminate permanently deletes the instance; only volumes with delete on termination switched off survive.", "Terminate удаляет инстанс навсегда; сохраняются только тома с выключенным delete on termination."),
        qx("Termination protection is enabled on an instance, and an admin clicks Terminate in the console. What happens?", "The request fails until protection is off", [
          ["The instance is stopped instead of terminated", "Protection does not convert the action; it simply rejects termination.", "Защита не подменяет действие — она просто отклоняет удаление."],
          ["It is terminated anyway after 24 hours", "There is no delayed termination; the instance keeps running.", "Отложенного удаления нет; инстанс продолжает работать."],
          ["AWS Support must approve it first", "The owner turns protection off in the console; Support is not involved.", "Защиту выключает сам владелец в консоли; Support не участвует."],
        ], "With DisableApiTermination on, the console, CLI and API refuse to terminate; Lab 3 shows exactly this error.", "При включённом DisableApiTermination консоль, CLI и API отказываются удалять инстанс; Lab 3 показывает именно эту ошибку."),
        tfx("Termination protection also prevents Amazon EC2 Auto Scaling from terminating the instance during a scale-in.", false,
          "Termination protection does not stop Auto Scaling scale-in (that needs scale-in protection), a Spot interruption or an OS shutdown with shutdown behavior set to terminate.",
          "Termination protection не мешает scale-in в Auto Scaling (для этого есть scale-in protection), прерыванию Spot и выключению из ОС при shutdown behavior = terminate.",
          "'True' overestimates the attribute: it only blocks terminate calls from the console, CLI and API.",
          "Ответ «верно» переоценивает атрибут: он блокирует только вызовы terminate из консоли, CLI и API."),
        qx("How does hibernating an instance differ from a normal stop?", "RAM contents are saved to EBS and restored", [
          ["Instance store data is preserved", "Instance store is lost on hibernate, just as on stop.", "Instance store теряется при hibernate так же, как при stop."],
          ["It stays on the same host and keeps billing", "After hibernate the instance usually starts on a new host, and compute is not billed while it is stopped.", "После hibernate инстанс обычно стартует на новом хосте, а вычисления в остановленном состоянии не оплачиваются."],
          ["Its public IPv4 is guaranteed to stay", "The auto-assigned public IPv4 is released, just as with a stop.", "Автоматически выданный public IPv4 освобождается, как и при stop."],
        ], "Hibernate writes RAM to the encrypted EBS root volume, so after start the processes continue where they stopped.", "Hibernate записывает RAM на зашифрованный корневой том EBS, и после старта процессы продолжают с того же места."),
        qx("You want to change an EBS-backed instance from t2.micro to t2.small. What must you do first?", "Stop the instance first", [
          ["Terminate it and launch a new one", "Termination is unnecessary and destroys the root volume by default.", "Удалять не нужно, к тому же это по умолчанию уничтожит корневой том."],
          ["Create and attach a new key pair", "Key pairs are unrelated to the instance type.", "Key pair не связан с типом инстанса."],
          ["Detach its security group first", "Security groups stay attached; they do not block a type change.", "Security groups остаются подключёнными и смене типа не мешают."],
        ], "The instance type can be changed only while the instance is stopped: stop → change instance type → start (Lab 3).", "Тип инстанса меняется только у остановленного инстанса: stop → change instance type → start (Lab 3)."),
        qx("Your web server instance is running, but users cannot open the site in a browser. Its security group allows only SSH on port 22. What fixes it?", "Add an inbound TCP 80 rule to the existing SG", [
          ["Add an outbound rule for TCP 80 to the same SG", "Outbound is already open, and the problem is inbound: browsers connect in on port 80.", "Исходящий трафик и так открыт, а проблема во входящем: браузеры подключаются на порт 80."],
          ["Change to a larger instance type", "The server is not overloaded; its traffic is simply blocked.", "Сервер не перегружен — его трафик просто блокируется."],
          ["Replace the key pair and reboot", "Key pairs only affect SSH logins, not HTTP access.", "Key pair влияет только на вход по SSH, а не на доступ по HTTP."],
        ], "HTTP uses TCP 80; adding an inbound allow rule (source 0.0.0.0/0) to the existing group takes effect immediately — exactly Lab 3, task 3.", "HTTP работает на TCP 80; входящее разрешающее правило (источник 0.0.0.0/0) в существующей группе действует сразу — ровно задание 3 из Lab 3."),
        qx("You add an HTTP rule to a security group used by three running instances. When does the rule take effect?", "Immediately, for all instances in the group", [
          ["After each instance is rebooted", "Security group changes need no reboot.", "Изменения security group не требуют перезагрузки."],
          ["Only after a stop and start of each instance", "No stop and start is needed; rules are evaluated live.", "Stop и start не нужны: правила применяются на лету."],
          ["Within 24 hours, after propagation", "There is no propagation delay of that kind for security groups.", "У security groups нет такой задержки распространения."],
        ], "Security group rules apply right away to every instance associated with the group.", "Правила security group сразу применяются ко всем инстансам, связанным с группой."),
        qx("Which failed status check usually points to a problem with AWS hardware that a stop and start can fix?", "The system status check", [
          ["The instance status check", "The instance status check reports problems inside your OS or configuration, which you fix yourself.", "Instance status check сообщает о проблемах внутри ОС или настроек, их исправляет владелец."],
          ["The CloudWatch billing alarm", "Billing alarms watch spending, not the health of the host.", "Billing alarms следят за расходами, а не за здоровьем хоста."],
          ["The IAM credential report", "The credential report lists IAM users' credentials; it is not a health check.", "Credential report перечисляет учётные данные пользователей IAM и проверкой здоровья не является."],
        ], "The system status check covers the AWS side — hardware, power, network; stop and start moves the instance to healthy hardware.", "System status check охватывает сторону AWS — оборудование, питание, сеть; stop и start переносят инстанс на исправное железо."),
        qx("A user data script should have installed Apache, but the page does not load. Where can you read the boot output to check?", "Get system log", [
          ["Service Quotas", "Service Quotas shows account limits, not boot output.", "Service Quotas показывает лимиты аккаунта, а не вывод загрузки."],
          ["The VPC route table", "Route tables show network routes, not what the instance printed while booting.", "Таблицы маршрутов показывают маршруты, а не то, что инстанс выводил при загрузке."],
          ["IAM credential report", "The IAM credential report is about user credentials, not instances.", "Credential report IAM — про учётные данные пользователей, а не про инстансы."],
        ], "Actions → Monitor and troubleshoot → Get system log shows the console output, including package installation by user data.", "Actions → Monitor and troubleshoot → Get system log показывает вывод консоли, включая установку пакетов скриптом user data."),
        qx("How often does CloudWatch basic monitoring send EC2 metrics?", "Every 5 minutes, at no extra charge", [
          ["Every 1 minute, with no extra charge", "One-minute data is detailed monitoring, which costs extra.", "Данные раз в минуту — это detailed monitoring, за него доплачивают."],
          ["Every 5 minutes, for a monthly fee", "Basic monitoring is free.", "Basic monitoring бесплатен."],
          ["Every hour, at no extra charge", "Basic monitoring is far more frequent than hourly.", "Basic monitoring присылает данные гораздо чаще, чем раз в час."],
        ], "Basic monitoring: free, 5-minute intervals; detailed monitoring: paid, 1-minute intervals.", "Basic monitoring — бесплатно, интервал 5 минут; detailed monitoring — платно, интервал 1 минута."),
        qx("Which EC2 metric is NOT available in CloudWatch by default, without installing an agent?", "Memory utilization", [
          ["CPU utilization", "CPU utilization is a standard EC2 metric.", "Загрузка CPU — стандартная метрика EC2."],
          ["Network packets in", "Network in/out metrics are collected by default.", "Метрики входящего и исходящего трафика собираются по умолчанию."],
          ["Status check failed", "Status check results are published as default metrics.", "Результаты status checks публикуются как стандартные метрики."],
        ], "The hypervisor cannot see memory use inside the guest OS, so memory metrics need the CloudWatch agent.", "Гипервизор не видит расход памяти внутри гостевой ОС, поэтому для метрик памяти нужен CloudWatch agent."),
        qx("Where do you view EC2 limits, such as the vCPUs allowed for running On-Demand instances, and request an increase?", "Service Quotas", [
          ["AWS Cost Explorer", "Cost Explorer analyzes spending; it does not manage limits.", "Cost Explorer анализирует расходы и лимитами не управляет."],
          ["IAM account settings", "IAM settings cover passwords and STS, not EC2 capacity limits.", "Настройки IAM касаются паролей и STS, а не лимитов EC2."],
          ["Instance metadata", "Metadata describes one instance and cannot change account quotas.", "Метаданные описывают один инстанс и не меняют квоты аккаунта."],
        ], "Service Quotas lists per-Region limits for EC2 and accepts increase requests — task 5 of Lab 3.", "Service Quotas показывает лимиты EC2 по Region и принимает запросы на увеличение — задание 5 из Lab 3."),
        qx("Users in the group EC2-Admin can start and stop instances but cannot terminate them; termination protection is off. What is the most likely reason?", "Their IAM policy lacks ec2:TerminateInstances", [
          ["AWS Support must first unlock the terminate action", "Terminate is not a feature Support unlocks; permissions come from IAM.", "Terminate — не функция, которую открывает Support; права даёт IAM."],
          ["The account reached its EC2 instance limit", "Limits stop new launches, not terminations.", "Лимиты мешают запускать новые инстансы, а не удалять."],
          ["Stopped instances cannot be terminated", "Stopped instances can be terminated at any time.", "Остановленные инстансы можно удалить в любой момент."],
        ], "IAM permissions are per action: the group's policy can allow start and stop without allowing terminate.", "Права IAM задаются по действиям: политика группы может разрешать start и stop, не разрешая terminate."),
        tfx("The private IPv4 address of an instance in a VPC stays the same after the instance is stopped and started.", true,
          "The private IPv4 address stays attached to the instance's network interface for its whole life; only the auto-assigned public IPv4 changes.",
          "Частный IPv4 остаётся на сетевом интерфейсе инстанса всю его жизнь; меняется только автоматически выданный public IPv4.",
          "'False' confuses the private address with the auto-assigned public one, which is replaced at start.",
          "Ответ «неверно» путает частный адрес с автоматически выданным публичным, который при старте заменяется."),
        qx("Which instance can NOT be stopped, only rebooted or terminated?", "One whose root device is instance store", [
          ["One that has an Elastic IP attached", "An Elastic IP stays associated through a stop; it does not prevent stopping.", "Elastic IP остаётся связанным при остановке и ей не мешает."],
          ["One with termination protection switched on", "Termination protection blocks terminate, not stop.", "Termination protection блокирует удаление, а не остановку."],
          ["One launched from a Marketplace AMI", "Marketplace AMIs can be EBS-backed and stopped like any other.", "AMI из Marketplace бывают EBS-backed и останавливаются, как любые другие."],
        ], "Stopping requires an EBS root; an instance store root would lose the OS, so such instances can only reboot or terminate.", "Для остановки нужен корневой EBS; с корнем на instance store потерялась бы ОС, поэтому такие инстансы можно только перезагрузить или удалить."),
      ],
    ),
    part(
      "cc-l8-p4",
      { en: "Purchase options and other compute services", ru: "Варианты покупки и другие вычислительные сервисы" },
      {
        en: `## Purchase options at a glance
| Option | Commitment | Discount vs On-Demand | Best for |
|---|---|---|---|
| On-Demand | none; pay per second or per hour | none — the reference price | unknown, spiky or short-term workloads; dev and test; new apps |
| Reserved Instances (RI) | 1 or 3 years for one instance configuration | up to about 72% | steady, predictable 24/7 usage |
| Scheduled RI | 1 year of capacity on a recurring schedule | cheaper for the reserved hours | jobs at known recurring times — monthly reports, nightly batches |
| Savings Plans | 1 or 3 years of a fixed $/hour spend | up to about 72% | steady spend with freedom to change family or Region, or to move to Fargate and Lambda |
| Spot Instances | none; AWS can reclaim with a **2-minute notice** | up to **90%** | interruptible, flexible, stateless, fault-tolerant jobs |
| Dedicated Instances | per instance; hardware dedicated to one customer | costs more | isolation without control of the host |
| Dedicated Hosts | a whole physical server (on demand or reserved) | costs more, saves on licenses | compliance, BYOL, control of instance placement |
@diagram cc8-purchase
## On-Demand
- No upfront payment and **no long-term commitment**; you pay only while the instance runs.
- Billed **per second** (60-second minimum) for Linux such as Amazon Linux and Ubuntu.
> Exam pattern: "the customer is **unsure of usage patterns**, expects usage to grow and stabilize, and wants to start **without a long-term commitment**" → **On-Demand**. Once usage is stable, the steady part moves to RIs or a Savings Plan.
## Reserved Instances
- You commit to an instance configuration (type, Region, OS, tenancy) for **1 or 3 years** and get a big discount on the hourly rate. Longer term and more paid upfront = bigger discount.
- Payment options: **All Upfront**, **Partial Upfront**, **No Upfront**.
- **Standard RI** — the largest discount; the AZ and (for Linux) the size within the family can change, but not the family. **Convertible RI** — a smaller discount, but it can be exchanged for another family, OS or tenancy.
- **Scheduled Reserved Instances** — capacity reserved for a **recurring time window** (daily, weekly or monthly) for one year: ideal for a job such as **monthly reports that iterate through large amounts of data**. AWS no longer sells new Scheduled RIs, but the course and the exam still use them.
> Exam pattern: "a web app on a single EC2 instance, **consistent and predictable**, will run **for at least 1 year**, reduce cost" → **Reserved Instances with a 1-year term**. Not Spot — an interruption would take the site down; not Lambda — that is a rewrite, not a pricing choice.
## Savings Plans
You commit to a **consistent amount of compute spend** (dollars per hour) for 1 or 3 years.
- **Compute Savings Plans** — the most flexible: any instance family, size, OS, tenancy or Region, and they also cover **AWS Fargate** and **AWS Lambda**; up to about 66% off.
- **EC2 Instance Savings Plans** — one instance family in one Region (any size, OS or AZ); up to about 72% off.
- Compared with RIs: a similar discount and more flexibility, but **no capacity reservation**.
## Spot Instances
- They run on **spare EC2 capacity** at up to **90% off** the On-Demand price.
- When AWS needs the capacity back, it gives a **2-minute interruption notice** and then **terminates, stops or hibernates** the instance.
- Good for **stateless, fault-tolerant, flexible** work: batch jobs and big data analytics, CI/CD builds, image and video rendering, test environments.
- Bad for the only copy of a database, a single production web server, or anything that must finish uninterrupted at a fixed time.
> Exam pattern: "a **stateless** analytics job that **can be interrupted**, and **cost is the key** factor" → **Spot Instances**.
## Dedicated Instances vs Dedicated Hosts
| | Dedicated Instances | Dedicated Hosts |
|---|---|---|
| Hardware | runs on hardware dedicated to one customer | a whole physical server allocated to you |
| Visibility | no view of sockets, cores or host ID | you see sockets, cores and the host ID |
| Placement | AWS decides which host runs each instance | **you control instance placement** on the host |
| Licenses | no special license support | **BYOL**: per-socket, per-core or per-VM licenses such as Windows Server, SQL Server, Oracle |
> Exam pattern: "sensitive data, **industry regulations / compliance**, **complete control over the physical server**, including instance placement and resource allocation" → **Dedicated Hosts**. If the only rule is "no other customers on our hardware", Dedicated Instances are enough.
## Other compute options
| Service | Model | You manage | Choose it when |
|---|---|---|---|
| AWS Lambda | serverless functions | only the code | event-driven code that finishes within **15 minutes** (an S3 upload, an API call, a schedule); pay per request and per millisecond |
| Amazon ECS | container orchestration | containers, plus the EC2 cluster unless you use Fargate | Docker containers with AWS-native orchestration |
| Amazon EKS | managed Kubernetes | pods and worker nodes (or Fargate) | you already use Kubernetes or need its tools |
| AWS Fargate | serverless compute for containers | container definitions only | containers without managing servers or clusters |
| Amazon ECR | container image registry | images | store, version and pull Docker images |
| AWS Elastic Beanstalk | PaaS for web apps | only the application code | upload the app (Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker); it provisions EC2, load balancing, scaling and monitoring; **no extra charge** |
| Amazon Lightsail | simple virtual private servers | a small server | a blog, a simple website or a dev box for a **fixed low monthly price** (VM, SSD, transfer and static IP bundled) |
- Lambda limits: memory 128 MB – 10,240 MB, maximum run time **15 minutes**; scaling is automatic.
> Exam trap: a job that runs for 2 hours cannot be one Lambda invocation (15-minute limit) — use EC2, AWS Batch or Fargate.
## Cost optimization — the four pillars from the course
- **Right-size** — the cheapest type that meets the need, judged by CloudWatch metrics.
- **Increase elasticity** — stop unused instances (dev and test at night) and let Auto Scaling follow demand.
- **Choose the optimal pricing model** — On-Demand for spiky load, RIs or Savings Plans for the steady baseline, Spot for interruptible work; combine them.
- **Optimize storage choices** — right-size EBS volumes, delete unattached volumes and old snapshots.
?? An app runs 24/7 at a steady load, but the team may move from m5 to Graviton instances next year. RI or Savings Plan?
?= A Compute Savings Plan (or a Convertible RI): the commitment discount stays even if the family changes.
?? A nightly image-rendering batch can simply restart if it is interrupted. What is the cheapest option?
?= Spot Instances — up to 90% off; a 2-minute interruption notice is acceptable for this job.`,
        ru: `## Варианты покупки — обзор
| Вариант | Обязательство | Скидка к On-Demand | Лучше всего для |
|---|---|---|---|
| On-Demand | никакого; оплата посекундно или почасово | нет — это базовая цена | неизвестных, скачущих или краткосрочных нагрузок; разработки и тестов; новых приложений |
| Reserved Instances (RI) | 1 или 3 года на одну конфигурацию инстанса | примерно до 72% | ровной, предсказуемой работы 24/7 |
| Scheduled RI | 1 год мощности по повторяющемуся расписанию | дешевле в зарезервированные часы | задач в известное повторяющееся время — ежемесячных отчётов, ночных пакетов |
| Savings Plans | 1 или 3 года фиксированных трат в $/час | примерно до 72% | ровных трат со свободой сменить семейство или Region либо перейти на Fargate и Lambda |
| Spot Instances | никакого; AWS может забрать инстанс с **предупреждением за 2 минуты** | до **90%** | прерываемых, гибких, stateless, устойчивых к сбоям задач |
| Dedicated Instances | за инстанс; оборудование выделено одному клиенту | дороже | изоляции без контроля над хостом |
| Dedicated Hosts | целый физический сервер (по запросу или в резерв) | дороже, но экономит на лицензиях | compliance, BYOL, контроля размещения инстансов |
@diagram cc8-purchase
## On-Demand
- Без предоплаты и **без долгосрочных обязательств**; оплачивается только время работы.
- Оплата **посекундная** (минимум 60 секунд) для Linux вроде Amazon Linux и Ubuntu.
> Шаблон экзамена: «клиент **не уверен в характере нагрузки**, ожидает роста и стабилизации и хочет начать **без долгосрочных обязательств**» → **On-Demand**. Когда нагрузка стабилизируется, постоянную часть переводят на RI или Savings Plan.
## Reserved Instances
- Клиент обязуется использовать конфигурацию инстанса (тип, Region, ОС, tenancy) **1 или 3 года** и получает большую скидку на почасовую цену. Длиннее срок и больше предоплата — больше скидка.
- Варианты оплаты: **All Upfront** (всё сразу), **Partial Upfront** (частично), **No Upfront** (без предоплаты).
- **Standard RI** — самая большая скидка; можно сменить AZ и (для Linux) размер внутри семейства, но не само семейство. **Convertible RI** — скидка меньше, зато его можно обменять на другое семейство, ОС или tenancy.
- **Scheduled Reserved Instances** — мощность, зарезервированная на **повторяющееся окно времени** (ежедневно, еженедельно или ежемесячно) на год: идеально для задачи вроде **ежемесячных отчётов, которые перебирают большие объёмы данных**. Новые Scheduled RI AWS больше не продаёт, но курс и экзамен их по-прежнему используют.
> Шаблон экзамена: «веб-приложение на одном инстансе EC2, нагрузка **ровная и предсказуемая**, работать будет **не меньше года**, нужно снизить расходы» → **Reserved Instances на 1 год**. Не Spot — прерывание уронит сайт; не Lambda — это переписывание приложения, а не выбор цены.
## Savings Plans
Клиент обязуется **тратить постоянную сумму на вычисления** (долларов в час) 1 или 3 года.
- **Compute Savings Plans** — самые гибкие: любое семейство, размер, ОС, tenancy или Region, плюс они покрывают **AWS Fargate** и **AWS Lambda**; скидка примерно до 66%.
- **EC2 Instance Savings Plans** — одно семейство в одном Region (любой размер, ОС или AZ); скидка примерно до 72%.
- В сравнении с RI: похожая скидка и больше гибкости, но **мощность не резервируется**.
## Spot Instances
- Работают на **свободных мощностях EC2** со скидкой до **90%** от цены On-Demand.
- Когда мощность нужна AWS обратно, он присылает **предупреждение о прерывании за 2 минуты** и затем **удаляет, останавливает или переводит в hibernate** инстанс.
- Подходят для **stateless, устойчивой к сбоям, гибкой** работы: пакетные задачи и аналитика больших данных, сборки CI/CD, рендеринг изображений и видео, тестовые окружения.
- Не подходят для единственной копии базы данных, единственного боевого веб-сервера и всего, что должно непрерывно завершиться к сроку.
> Шаблон экзамена: «**stateless**-задача аналитики, которую **можно прерывать**, и **главное — цена**» → **Spot Instances**.
## Dedicated Instances против Dedicated Hosts
| | Dedicated Instances | Dedicated Hosts |
|---|---|---|
| Оборудование | работают на оборудовании, выделенном одному клиенту | целый физический сервер, выделенный клиенту |
| Видимость | сокеты, ядра и ID хоста не видны | видны сокеты, ядра и ID хоста |
| Размещение | AWS решает, на каком хосте работает инстанс | **клиент сам управляет размещением** инстансов на хосте |
| Лицензии | особой поддержки лицензий нет | **BYOL**: лицензии на сокет, ядро или VM, например Windows Server, SQL Server, Oracle |
> Шаблон экзамена: «чувствительные данные, **отраслевые требования / compliance**, **полный контроль над физическим сервером**, включая размещение инстансов и распределение ресурсов» → **Dedicated Hosts**. Если правило только одно — «на нашем железе нет других клиентов», — хватит Dedicated Instances.
## Другие варианты вычислений
| Сервис | Модель | Чем управляет клиент | Когда выбирать |
|---|---|---|---|
| AWS Lambda | serverless-функции | только кодом | код по событию, который укладывается в **15 минут** (загрузка в S3, вызов API, расписание); оплата за запрос и за миллисекунды |
| Amazon ECS | оркестрация контейнеров | контейнерами и кластером EC2, если не используется Fargate | Docker-контейнеры с оркестрацией от AWS |
| Amazon EKS | управляемый Kubernetes | подами и рабочими узлами (или Fargate) | Kubernetes уже используется или нужны его инструменты |
| AWS Fargate | serverless-вычисления для контейнеров | только описанием контейнеров | контейнеры без управления серверами и кластерами |
| Amazon ECR | реестр образов контейнеров | образами | хранить, версионировать и скачивать Docker-образы |
| AWS Elastic Beanstalk | PaaS для веб-приложений | только кодом приложения | загрузить приложение (Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker); он сам создаёт EC2, балансировку, масштабирование и мониторинг; **без доплаты** |
| Amazon Lightsail | простые виртуальные серверы (VPS) | небольшим сервером | блог, простой сайт или машина для разработки за **фиксированную низкую плату в месяц** (VM, SSD, трафик и статический IP одним пакетом) |
- Лимиты Lambda: память 128 МБ – 10 240 МБ, максимальное время работы **15 минут**; масштабирование автоматическое.
> Ловушка экзамена: задачу на 2 часа нельзя выполнить одним вызовом Lambda (лимит 15 минут) — нужны EC2, AWS Batch или Fargate.
## Оптимизация затрат — четыре принципа из курса
- **Right-size (подобрать размер)** — самый дешёвый тип, который справляется, по метрикам CloudWatch.
- **Increase elasticity (повысить эластичность)** — останавливать неиспользуемые инстансы (разработка и тесты ночью) и дать Auto Scaling следовать за спросом.
- **Choose the optimal pricing model (выбрать модель цены)** — On-Demand для скачущей нагрузки, RI или Savings Plans для постоянной базы, Spot для прерываемой работы; сочетать их.
- **Optimize storage choices (оптимизировать хранилище)** — подбирать размер томов EBS, удалять неподключённые тома и старые snapshots.
?? Приложение работает 24/7 с ровной нагрузкой, но в следующем году команда может перейти с m5 на инстансы Graviton. RI или Savings Plan?
?= Compute Savings Plan (или Convertible RI): скидка за обязательство сохранится, даже если семейство сменится.
?? Ночной пакетный рендеринг картинок можно просто перезапустить при прерывании. Какой вариант дешевле всего?
?= Spot Instances — скидка до 90%; предупреждение о прерывании за 2 минуты для такой задачи приемлемо.`,
      },
      [
        qx("A customer is building a new application, is unsure of its usage patterns, and expects usage to grow and stabilize over time. They want to start without a long-term commitment. Which pricing option fits?", "On-Demand Instances", [
          ["Spot Instances", "Spot can be interrupted at any time; a new app with unknown behavior should not depend on spare capacity.", "Spot могут прервать в любой момент; новому приложению с неизвестным поведением нельзя зависеть от свободных мощностей."],
          ["Reserved Instances, 3-year term", "An RI is a 1- or 3-year commitment — exactly what the customer wants to avoid.", "RI — обязательство на 1 или 3 года, ровно то, чего клиент хочет избежать."],
          ["Compute Savings Plans", "A Savings Plan also commits a spend for 1 or 3 years; it fits after usage stabilizes.", "Savings Plan тоже обязывает тратить сумму 1 или 3 года; он уместен после стабилизации нагрузки."],
        ], "On-Demand needs no commitment and no upfront payment — the right start for unknown usage; commitments come later.", "On-Demand не требует ни обязательств, ни предоплаты — верный старт при неизвестной нагрузке; обязательства — потом."),
        qx("A startup runs its web app on a single EC2 instance. The workload is consistent, predictable and will run for at least 1 year. Finance asks to reduce costs. What do you recommend?", "Reserved Instances with a 1-year term", [
          ["Move the app to AWS Lambda right away", "Rewriting the app as functions is an architecture project, not a pricing decision, and may not fit a server app.", "Переписать приложение на функции — архитектурный проект, а не выбор цены, и серверному приложению это может не подойти."],
          ["Keep On-Demand for maximum flexibility", "Flexibility is not needed for a steady year-long load; On-Demand is the most expensive choice here.", "Гибкость не нужна для ровной нагрузки на год; On-Demand здесь самый дорогой вариант."],
          ["Switch to Spot Instances to cut cost", "A single production web server must not be interrupted with a 2-minute notice.", "Единственный боевой веб-сервер нельзя прерывать с предупреждением за 2 минуты."],
        ], "Steady, predictable usage for at least a year is the textbook case for a 1-year Reserved Instance.", "Ровная предсказуемая нагрузка минимум на год — хрестоматийный случай для Reserved Instance на 1 год."),
        qx("A stateless analytics job can be interrupted and restarted at any time, and cost is the most important factor. Which option fits best?", "Spot Instances", [
          ["On-Demand", "On-Demand works, but costs far more than Spot for interruptible work.", "On-Demand подойдёт, но для прерываемой работы стоит намного дороже Spot."],
          ["Dedicated Hosts", "Dedicated Hosts are the most expensive option, for compliance and licensing.", "Dedicated Hosts — самый дорогой вариант, он для compliance и лицензий."],
          ["Standard RIs, 3-year", "A 3-year commitment makes no sense for a flexible, interruptible job.", "Обязательство на 3 года бессмысленно для гибкой прерываемой задачи."],
        ], "Spot gives up to 90% off for work that tolerates interruption — stateless, fault-tolerant, flexible jobs.", "Spot даёт скидку до 90% для работы, которая переносит прерывания, — stateless, устойчивых к сбоям, гибких задач."),
        qx("A project needs monthly reports that iterate through very large amounts of data. Which EC2 purchasing option should it consider?", "Scheduled Reserved Instances", [
          ["On-Demand Instances", "On-Demand works but gives no discount for a predictable recurring window.", "On-Demand подойдёт, но не даёт скидки за предсказуемое повторяющееся окно."],
          ["Spot Instances with hibernation", "Reports due on schedule can be interrupted on Spot; hibernation does not guarantee capacity.", "На Spot отчёты к сроку могут прервать; hibernation не гарантирует мощность."],
          ["Dedicated Hosts", "Nothing in the scenario asks for physical-server control or licensing.", "В сценарии нет требования контроля над физическим сервером или лицензий."],
        ], "Scheduled RIs reserve capacity for a recurring time window (daily, weekly, monthly) — exactly a monthly reporting job.", "Scheduled RI резервируют мощность на повторяющееся окно времени (день, неделя, месяц) — ровно под ежемесячные отчёты."),
        qx("A financial services company runs sensitive applications under industry regulations. It needs complete control over the physical server, including instance placement and resource allocation. Which option should it choose?", "Dedicated Hosts", [
          ["Dedicated Instances", "Dedicated Instances isolate hardware but give no control over placement or visibility of sockets and cores.", "Dedicated Instances изолируют оборудование, но не дают контроля размещения и видимости сокетов и ядер."],
          ["Savings Plans", "Savings Plans are a discount model; instances still run on shared hosts.", "Savings Plans — модель скидки; инстансы всё равно работают на общих хостах."],
          ["Spot Instances", "Spot runs on shared spare capacity and can be interrupted — the opposite of control.", "Spot работают на общих свободных мощностях и могут быть прерваны — противоположность контролю."],
        ], "A Dedicated Host is a whole physical server for one customer, with control over instance placement — the answer for compliance with full server control.", "Dedicated Host — целый физический сервер одного клиента с контролем размещения инстансов; это ответ для compliance с полным контролем над сервером."),
        qx("A company wants to bring its existing per-core Windows Server and SQL Server licenses (BYOL) to AWS. Which option supports this best?", "Dedicated Hosts", [
          ["Spot Instances", "Spot does not expose sockets or cores, so per-core licenses cannot be tracked.", "Spot не показывают сокеты и ядра, поэтому лицензии на ядро не отследить."],
          ["Dedicated Instances", "Dedicated Instances do not show the physical cores a license is counted against.", "Dedicated Instances не показывают физические ядра, по которым считается лицензия."],
          ["Compute Savings Plans", "A Savings Plan changes the price, not the licensing visibility.", "Savings Plan меняет цену, а не видимость для лицензирования."],
        ], "Dedicated Hosts show sockets and cores and keep instances on a known server, which per-socket and per-core BYOL licenses require.", "Dedicated Hosts показывают сокеты и ядра и держат инстансы на известном сервере — этого требуют лицензии BYOL на сокет и ядро."),
        qx("How much warning does AWS give before it interrupts a Spot Instance?", "Two minutes", [
          ["Thirty seconds", "The Spot interruption notice is longer than 30 seconds.", "Предупреждение о прерывании Spot длиннее 30 секунд."],
          ["One hour", "An hour is far longer than the real notice.", "Час — намного больше настоящего срока."],
          ["Twenty-four hours", "Spot gives no day-long notice; that is why jobs must tolerate interruption.", "Spot не предупреждает за сутки — поэтому задачи должны переносить прерывания."],
        ], "Spot sends a 2-minute interruption notice, then terminates, stops or hibernates the instance.", "Spot присылает предупреждение за 2 минуты, затем удаляет, останавливает или переводит инстанс в hibernate."),
        qx("Which Reserved Instance purchase gives the largest discount?", "3-year term, All Upfront", [
          ["1-year term, No Upfront", "The shortest term with no prepayment gives the smallest RI discount.", "Самый короткий срок без предоплаты даёт наименьшую скидку RI."],
          ["1-year term, Partial Upfront", "A 1-year term discounts less than a 3-year one.", "Срок 1 год даёт меньшую скидку, чем 3 года."],
          ["3-year term, No Upfront", "The term is right, but paying nothing upfront lowers the discount.", "Срок верный, но без предоплаты скидка меньше."],
        ], "The longer the term and the more you pay upfront, the bigger the RI discount.", "Чем длиннее срок и чем больше предоплата, тем больше скидка RI."),
        qx("Compared with a Standard RI, what does a Convertible RI allow?", "Exchange for another family, OS or tenancy", [
          ["Cancellation at any time with a full refund", "RIs are commitments; neither type can be cancelled for a refund.", "RI — обязательства; ни один их тип нельзя отменить с возвратом денег."],
          ["Spot-level prices without any interruptions", "Convertible RIs give a smaller discount than Standard RIs, far from Spot prices.", "Convertible RI дают скидку меньше, чем Standard, и далеки от цен Spot."],
          ["Sharing with any AWS account in the world", "RI discounts can be shared only within an organization's consolidated billing.", "Скидками RI можно делиться только внутри consolidated billing одной организации."],
        ], "Convertible RIs trade some discount for the right to exchange into a different family, OS or tenancy.", "Convertible RI жертвуют частью скидки ради права обменять их на другое семейство, ОС или tenancy."),
        qx("Which commitment-based discount also applies to AWS Fargate and AWS Lambda usage?", "Compute Savings Plans", [
          ["Zonal RIs", "Reserved Instances apply only to EC2 instances.", "Reserved Instances действуют только на инстансы EC2."],
          ["EC2 Instance Savings Plans", "This plan is limited to one EC2 family in one Region.", "Этот план ограничен одним семейством EC2 в одном Region."],
          ["Scheduled Reserved Instances", "Scheduled RIs reserve EC2 capacity for a time window; they do not cover Lambda.", "Scheduled RI резервируют мощность EC2 на окно времени и не покрывают Lambda."],
        ], "Compute Savings Plans apply across EC2 families and Regions and also to Fargate and Lambda.", "Compute Savings Plans действуют на любые семейства и Region EC2, а также на Fargate и Lambda."),
        qx("Which workload is the WORST fit for Spot Instances?", "The single production database server", [
          ["A CI build fleet that retries failed jobs", "Retried builds tolerate interruption — a good Spot use.", "Сборки с повтором переносят прерывания — хорошее применение Spot."],
          ["Rendering video frames in parallel", "Frames can be re-rendered elsewhere — a classic Spot workload.", "Кадры можно перерисовать на другой машине — классическая задача Spot."],
          ["Big data analysis split into small tasks", "Small independent tasks survive interruptions well.", "Мелкие независимые задачи хорошо переживают прерывания."],
        ], "A single stateful database cannot be lost with 2 minutes' notice; Spot is for stateless, fault-tolerant work.", "Единственную stateful-базу нельзя терять с предупреждением за 2 минуты; Spot — для stateless, устойчивой к сбоям работы."),
        tfx("Spot Instances are a good choice for a production web server that must never be interrupted, because they are the cheapest option.", false,
          "Spot can be reclaimed with a 2-minute notice, so it does not suit work that must never be interrupted; cheap is not enough.",
          "Spot могут забрать с предупреждением за 2 минуты, поэтому они не подходят для работы, которую нельзя прерывать; дешевизны недостаточно.",
          "'True' looks only at the price and ignores the interruption risk that comes with it.",
          "Ответ «верно» смотрит только на цену и не учитывает риск прерывания, который к ней прилагается."),
        qx("A thumbnail must be created each time a photo is uploaded to an S3 bucket; each run takes about 2 seconds. Which solution fits best?", "AWS Lambda, triggered by the S3 upload", [
          ["A t3.micro instance polling the bucket 24/7", "An always-on server costs money while idle and must be patched; events make polling unnecessary.", "Постоянно работающий сервер стоит денег в простое и требует обновлений; события делают опрос ненужным."],
          ["An Amazon Lightsail server with a cron job", "A fixed server and a timer add delay and idle cost for a short event-driven task.", "Постоянный сервер и таймер добавляют задержку и плату за простой для короткой задачи по событию."],
          ["An EC2 Dedicated Host", "A whole physical server for 2-second jobs is wildly oversized.", "Целый физический сервер для задач по 2 секунды — огромный перебор."],
        ], "Lambda runs code on events such as an S3 upload, scales automatically and bills per request and millisecond.", "Lambda запускает код по событиям вроде загрузки в S3, масштабируется сам и берёт плату за запрос и миллисекунды."),
        qx("A nightly ETL job runs for about 3 hours. Why is a single AWS Lambda function the wrong choice?", "A function may run 15 minutes at most", [
          ["Lambda cannot read objects from Amazon S3", "Lambda reads and writes S3 easily through the SDK and an IAM role.", "Lambda легко читает и пишет S3 через SDK и роль IAM."],
          ["Lambda supports only JavaScript code", "Lambda supports Python, Java, Go, .NET, Ruby, Node.js and custom runtimes.", "Lambda поддерживает Python, Java, Go, .NET, Ruby, Node.js и собственные среды выполнения."],
          ["Lambda bills a full hour for every call", "Lambda bills per request and per millisecond of run time.", "Lambda берёт плату за запрос и за миллисекунды работы."],
        ], "The maximum Lambda timeout is 15 minutes; a 3-hour job needs EC2, AWS Batch or Fargate, or must be split into smaller steps.", "Максимальное время работы Lambda — 15 минут; задаче на 3 часа нужны EC2, AWS Batch или Fargate, либо её надо разбить на мелкие шаги."),
        qx("A developer wants to upload a Java web app and have AWS provision the servers, load balancing, auto scaling and health monitoring, paying only for the resources used. Which service fits?", "AWS Elastic Beanstalk", [
          ["Amazon Lightsail", "Lightsail gives simple fixed-price servers, not managed deployment with auto scaling.", "Lightsail даёт простые серверы по фиксированной цене, а не управляемый деплой с автомасштабированием."],
          ["Amazon EC2 Auto Scaling", "Auto Scaling only adds and removes instances; it does not deploy your code or set up the whole stack.", "Auto Scaling только добавляет и убирает инстансы; он не разворачивает код и не собирает весь стек."],
          ["Amazon ECR", "ECR only stores container images; it runs nothing.", "ECR лишь хранит образы контейнеров и ничего не запускает."],
        ], "Elastic Beanstalk is the PaaS option: upload code, and it handles provisioning, load balancing, scaling and monitoring at no extra charge.", "Elastic Beanstalk — вариант PaaS: загружается код, а он сам занимается ресурсами, балансировкой, масштабированием и мониторингом без доплаты."),
        qx("A freelancer needs a server for a small WordPress blog at a simple fixed monthly price that includes storage and data transfer. Which service fits?", "Amazon Lightsail", [
          ["Amazon EKS", "Managed Kubernetes is far too complex and costly for one small blog.", "Управляемый Kubernetes слишком сложен и дорог для одного маленького блога."],
          ["An EC2 Dedicated Host", "A whole physical server is massive overkill and costs much more.", "Целый физический сервер — огромный перебор и стоит намного дороже."],
          ["AWS Elastic Beanstalk", "Beanstalk deploys apps onto pay-as-you-go resources; it has no all-in-one fixed monthly bundle.", "Beanstalk разворачивает приложения на ресурсах с оплатой по факту; фиксированного пакета на месяц у него нет."],
        ], "Lightsail bundles a VM, SSD storage, data transfer, DNS and a static IP for a predictable monthly price.", "Lightsail объединяет VM, SSD, трафик, DNS и статический IP за предсказуемую плату в месяц."),
        qx("A team runs Docker containers and does not want to provision or manage EC2 servers or clusters. Which service runs the containers for them?", "AWS Fargate", [
          ["Amazon ECR", "ECR stores container images but does not run them.", "ECR хранит образы контейнеров, но не запускает их."],
          ["Amazon EKS on self-managed EC2 nodes", "Self-managed nodes are exactly the servers the team wants to avoid.", "Самоуправляемые узлы — это как раз те серверы, от которых команда хочет избавиться."],
          ["EC2 instances with Docker installed", "Installing Docker on EC2 leaves all server management to the team.", "Docker на EC2 оставляет всё управление серверами команде."],
        ], "Fargate is serverless compute for containers: you define CPU, memory and networking, and AWS runs the infrastructure for ECS or EKS.", "Fargate — serverless-вычисления для контейнеров: задаются CPU, память и сеть, а инфраструктуру для ECS или EKS ведёт AWS."),
        qx("Dev and test instances sit idle every night and weekend. Which cost optimization pillar and action fit best?", "Increase elasticity: stop them when idle", [
          ["Right-size: move them to larger types", "Larger types cost more; right-sizing would mean smaller types, and it does not address idle hours.", "Крупные типы дороже; right-size означал бы меньшие типы и всё равно не решает проблему простоя."],
          ["Optimal pricing: buy 3-year RIs for all of them", "An RI is paid for every hour, so it would lock in payment for the idle hours too.", "RI оплачивается за каждый час, то есть закрепит оплату и за часы простоя."],
          ["Move them to Dedicated Hosts", "Dedicated Hosts cost more and do nothing about idle time.", "Dedicated Hosts дороже и с простоем ничего не делают."],
        ], "Increasing elasticity means running resources only when needed: stop or hibernate non-production instances outside working hours.", "Повысить эластичность — значит держать ресурсы включёнными только когда нужно: останавливать или переводить в hibernate не боевые инстансы вне рабочего времени."),
        tfx("Dedicated Instances let you see the sockets and physical cores of the server and choose the host that each instance runs on.", false,
          "That visibility and placement control belong to Dedicated Hosts; Dedicated Instances only guarantee hardware dedicated to one customer.",
          "Такая видимость и контроль размещения есть у Dedicated Hosts; Dedicated Instances лишь гарантируют оборудование, выделенное одному клиенту.",
          "'True' merges the two options; the exam often tests exactly this difference.",
          "Ответ «верно» сливает два варианта в один; экзамен часто проверяет именно эту разницу."),
        qx("A company runs a steady baseline of 10 instances 24/7 and adds about 30 instances during unpredictable peaks that must not be interrupted. Which combination is most cost-effective?", "Savings Plan for 10, On-Demand for the rest", [
          ["Spot Instances for all 40 of the instances", "The peak work must not be interrupted, and the baseline would be at risk too.", "Работу на пиках нельзя прерывать, а под риском оказалась бы и база."],
          ["Dedicated Hosts for all 40 instances", "Nothing requires dedicated hardware; it would only raise the cost.", "Ничто не требует выделенного оборудования; это только поднимет цену."],
          ["On-Demand for the base 10, Spot for the 30 peaks", "That is backwards: the steady part deserves the commitment discount, and peaks must not be interrupted.", "Это наоборот: скидку за обязательство заслуживает постоянная часть, а пики прерывать нельзя."],
        ], "Cover the predictable baseline with a commitment (Savings Plan or RIs) and the unpredictable, uninterruptible peaks with On-Demand.", "Предсказуемую базу закрывают обязательством (Savings Plan или RI), а непредсказуемые пики, которые нельзя прерывать, — On-Demand."),
      ],
    ),
  ],
};

# Computer Networks — full study notes

Explanations based on lectures 5–10 and available NetAcad text. Consult the original course for diagrams, videos and Packet Tracer activities.

## 8. Network layer: how a packet reaches another network

**Key idea:** IP addresses and forwards packets between networks. A router selects the next hop using the destination IP and its routing table.

Data path: application data → TCP segment/UDP datagram → IP packet → Ethernet frame → bits. The receiver removes these layers in reverse order. Each router removes the old frame and creates a new one for the next link.

## Three characteristics of IP

- **Connectionless:** IP does not establish a connection before sending.
- **Best effort:** IP does not guarantee delivery, order or freedom from duplicates. It does not retransmit a lost packet itself.
- **Media independent:** IP can run over Ethernet, Wi-Fi and other links.

TCP or the application provides reliability when needed. “Unreliable” does not mean “always loses packets”; it means there is no delivery guarantee or built-in recovery.

## IPv4 and IPv6 headers

| Feature | IPv4 | IPv6 |
|---|---|---|
| Address size | 32 bits | 128 bits |
| Base header | at least 20 bytes, variable length | fixed 40 bytes |
| Hop restriction | TTL | Hop Limit |
| Next protocol | Protocol | Next Header |
| Base-header error check | Header Checksum | no such field |

IPv4 Protocol values: ICMP = 1, TCP = 6, UDP = 17. Routers decrement TTL/Hop Limit; at zero, the packet is discarded. Source/Destination IP normally remain unchanged without NAT; MAC addresses change when crossing a routed link.

**MTU** is the maximum packet size a link can carry. IPv4 permits fragmentation under the appropriate conditions; an IPv6 router does not fragment packets and instead informs the source with Packet Too Big. The source must adjust the size.

## Local destination or gateway

A PC at 192.168.1.10/24 sends to 192.168.1.20: both are on the same network, so the frame targets the recipient’s MAC address.

For destination 192.168.2.20, the network is different: the frame targets the MAC of the gateway, for example 192.168.1.1. The destination IP remains 192.168.2.20. A wrong gateway often causes “local communication works, remote networks do not.”

The routing table contains connected, static and dynamic routes. The longest matching prefix wins. A default route is the route of last resort: IPv4 `0.0.0.0/0`, IPv6 `::/0`. IOS codes: `C` connected, `L` local, `S` static, `O` OSPF.

Check with IOS `show ip route`; on Windows, `route print` or `netstat -r`.

**Open-question answer:** IP provides logical addressing and routing. It is connectionless, offers best-effort delivery and is independent of the transmission medium; acknowledgments and retransmissions, when required, are handled at higher layers.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Connected, local and remote routes: the next hop

A **next hop** is the neighboring router's IP address used to forward a packet toward its destination. A **remote route** reaches a network that is not directly attached. Thus “What routing table entry has a next hop address associated with a destination network?” expects **remote routes**.

| Entry | Meaning | Example |
| --- | --- | --- |
| C — connected | Network attached to an interface | C 192.168.1.0/24, GigabitEthernet0/0 |
| L — local | The router's own interface address | L 192.168.1.1/32, GigabitEthernet0/0 |
| S — static | Manually configured route to a remote network | S 192.168.2.0/24 via 192.168.1.254 |
| O — OSPF | Route learned through OSPF | O 192.168.3.0/24 via 192.168.1.254 |

For destination 192.168.2.10, forward to neighbor 192.168.1.254. The packet still targets 192.168.2.10; the Ethernet frame targets the neighbor's MAC. C needs no intermediate router on that network. L means the router itself, not any local PC. S/O describe the route's source; remote describes the network's location. Some remote static routes specify an exit interface rather than an explicit next-hop IP.

### IP fields and MTU

IPv4 Version is 4 bits (0100). Protocol identifies ICMP (1), TCP (6) or UDP (17). The IPv4 checksum covers only its header. Routers decrement TTL; expiration discards the packet and normally generates ICMP Time Exceeded. IPv6 has a fixed 40-byte base header, Hop Limit and no base-header checksum.

MTU limits **packet size, not transmission speed**. The data link supplies this constraint to the network layer; Ethernet commonly supports a 1500-byte IP packet. IPv4 may fragment for a smaller outgoing MTU unless DF forbids it. IPv6 routers return Packet Too Big; the sender adjusts packet size.

### Addresses and related revision

An ordinary MAC address has 48 bits (12 hex digits); IPv4 has 32 bits, IPv6 128. Ethernet places destination MAC before source MAC; IP places source IP before destination IP. Without NAT, endpoint IPs remain while routers replace link encapsulation. OSPF/BGP learn routes; IP carries packets.

Binary octet weights are 128, 64, 32, 16, 8, 4, 2, 1: 192 = 11000000; 168 = 10101000; 11 = 00001011; 10 = 00001010. Five subnets require 3 borrowed bits (8 choices). 2662 hosts require 12 host bits (4094 usable addresses), hence /20. A Layer 2 switch needs an IP for management. 127.0.0.1 tests the local stack. Voice and video are delay-sensitive.

## NetAcad module 8 coverage: remaining essentials

### Four Layer 3 operations and host decisions

1. Addressing gives participating IP interfaces their addresses.
2. Encapsulation adds an IP header to transport data at the source.
3. Routing chooses the next hop from destination IP at each router.
4. De-encapsulation removes the IP header at the destination and dispatches data using Protocol/Next Header.

A host distinguishes itself, on-link destinations and off-link destinations. Loopback 127.0.0.1/::1 stays inside the computer and does not test a cable. IPv4 uses its address and mask for on-link decisions; IPv6 uses prefix information, normally from RA. DHCP or manual settings supply an IPv4 default gateway; IPv6 discovers a default router through RA. DHCPv6 alone does not supply a default router.

### Understand every header field

| IPv4 | Meaning |
| --- | --- |
| Version / IHL | IP version / IPv4 header length in 32-bit words |
| DS | DSCP traffic treatment and ECN congestion indication |
| Total Length | Entire packet, header plus payload |
| Identification, Flags, Fragment Offset | Associate fragments, control/indicate fragmentation, locate fragments |
| TTL | Limits lifetime during forwarding |
| Protocol | Encapsulated protocol: ICMP 1, TCP 6, UDP 17 |
| Header Checksum | Checks only the IPv4 header |
| Source / Destination | Endpoint IP addresses |
| Options / padding | Optional information and alignment |

IPv6 has eight base fields: Version, Traffic Class, Flow Label, Payload Length, Next Header, Hop Limit, Source and Destination. Traffic Class provides DS-style classification; Flow Label identifies a flow for consistent treatment. Payload Length excludes the 40-byte base header. Next Header can identify TCP/UDP/ICMPv6 or another extension header. Optional functions move into extension headers, preserving a fixed base header.

### Read a route instead of guessing its letter

`O 10.2.0.0/16 [110/20] via 192.168.1.254, 00:00:12, GigabitEthernet0/0` identifies an OSPF-learned /16, [administrative distance/metric], next-hop neighbor, age and exit interface. D marks EIGRP. The bracketed numbers are not prefix length or TTL.

Longest matching prefix comes first. For destination 10.2.3.4, 10.2.3.0/24 is more specific than 10.2.0.0/16 and default 0.0.0.0/0. Competing routes to the same prefix use route-source/metric rules; different protocols' metrics are not one common scale. With no matching route including a default, the packet is dropped.

Static routes are configured manually; dynamic protocols (OSPF/EIGRP/BGP) exchange reachability and adapt after convergence. Both approaches may coexist. In Wireshark, expand IP and identify addresses, TTL/Hop Limit, Protocol/Next Header and lengths. Comparing captures on both router sides reveals a new Layer 2 frame and reduced TTL.


---

## 9. ARP and ND: finding the MAC address

**Key idea:** knowing an IP address does not yet provide the destination MAC for an Ethernet frame.

## ARP for IPv4

1. The sender identifies the next neighbor: the final local host or the gateway.
2. It looks for the IPv4→MAC mapping in its ARP cache.
3. If no entry exists, it sends an ARP Request to `FF:FF:FF:FF:FF:FF`.
4. The owner of the requested IPv4 address replies with its MAC, usually by unicast.
5. The mapping is temporarily stored in RAM.

`arp -a` shows a PC’s cache; `show ip arp` does so on Cisco; `arp -d *` clears the dynamic cache on Windows. ARP does not search through every router for a remote internet server’s MAC: a remote network requires the local gateway’s MAC.

Do not confuse these two tables:

| Table | Mapping |
|---|---|
| ARP | IPv4 → MAC |
| Switch MAC address table | MAC → port/VLAN |

A switch learns from the **source MAC** and forwards using the **destination MAC**. Unknown unicasts and broadcasts are flooded within the VLAN through eligible ports except the incoming port.

## Neighbor Discovery for IPv6

IPv6 uses neither ARP nor broadcast. ICMPv6 ND includes:

- **NS / NA:** Neighbor Solicitation / Advertisement — discovering neighbors and resolving IPv6→MAC.
- **RS / RA:** Router Solicitation / Advertisement — requesting and advertising router/network settings.
- **DAD:** checking address uniqueness using NS.

ARP spoofing/poisoning falsifies IP→MAC mappings and can redirect traffic through an attacker.

**Check yourself:** a packet sent to another network has the remote host’s destination IP, while its first frame has the local gateway’s destination MAC.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### How a switch decides

A switch **learns source MAC** and ingress port, but forwards by **destination MAC**. A known source refreshes its entry timer. Known unicast uses the matching port; unknown unicast and broadcast are flooded within the VLAN except the ingress port. If the destination is on the ingress port, the frame is filtered rather than sent back.

ARP caches IPv4-to-MAC mappings in RAM; dynamic entries expire. A static broadcast entry such as 192.168.1.255 → FF:FF:FF:FF:FF:FF is not by itself evidence of an attack. IPv4 multicast MAC starts with 01:00:5E; it is a group address, unlike Ethernet broadcast FF:FF:FF:FF:FF:FF.

### Which address should be resolved?

Compare source and destination networks using the mask. Same subnet: resolve the destination host. Different subnet: resolve the gateway. ARP does not discover an Internet server's remote MAC. IPv6 Neighbor Solicitation normally uses solicited-node multicast; Neighbor Advertisement supplies the neighbor's address. DAD also uses NS to detect duplicates. Router Solicitation seeks routers; Router Advertisement supplies network configuration.

MAC, FCS and 802.2 belong to Layer 2; IP and TTL to Layer 3; ports and TCP ACK to Layer 4.

## NetAcad details: ARP frames, failed resolution and all five ND messages

### What an ARP request actually contains

ARP is carried directly in Ethernet, without a separate IPv4 header, even though the ARP message contains sender/target IPv4 addresses. The request’s destination MAC is FF:FF:FF:FF:FF:FF, its source MAC is the sender’s and EtherType 0x0806 selects ARP processing. Broadcast MAC determines who receives the frame; EtherType determines which protocol handles its payload. These are different decisions.

All VLAN nodes receive the request, but ordinarily only the target IPv4 owner replies. The reply targets the requester’s MAC and uses the responder’s source MAC: it is unicast. The requester caches the IP-to-MAC mapping. If no reply arrives, the MAC remains unknown; after resolution attempts fail, the packet is discarded rather than broadcast as ordinary data.

### Dynamic cache, static entries and overhead

Dynamic entries expire using system-dependent timers. Static entries do not age in the same way and are removed administratively. Clearing a cache triggers fresh resolution; it does not change IP configuration or synchronize devices. Initial traffic can wait briefly for a request/reply. Numerous broadcasts consume bandwidth and processing on every node; scale, not the mere existence of ARP, creates the problem.

ARP does not authenticate the claim that an IP belongs to a MAC. Poisoning may replace the gateway mapping. Compare `arp -a` with a trusted MAC to investigate; one unexpected mapping is not proof of an attack because an interface might legitimately have changed.

### The fifth ND message and the multicast qualification

ND uses five ICMPv6 messages: NS, NA, RS, RA and Redirect. Redirect informs a host of a better next hop; its detailed configuration is outside this module, but its name/purpose belong to the overview. Initial MAC resolution uses solicited-node multicast NS. A reachability probe for an already-known neighbor may use unicast NS: do not memorize “every NS is always multicast.”

### Practice without guessing an absent exhibit

For each Ethernet hop, write four fields: source/destination IP and source/destination MAC. Without NAT the endpoint IPs stay the same; MACs identify the sender and next recipient on this particular link. In Packet Tracer compare PDUs before/after a router, then inspect ARP/neighbor cache. An intermediate switch does not become the transit frame’s destination MAC. If a card asks for an exhibit’s precise port/MAC, the rule can be explained without the exhibit but that specific value cannot be verified.

**Self-check:** ARP or an IP header? Ethernet carries ARP directly. Does everyone receive or reply? All VLAN nodes receive; the owner replies. No reply? Delivery fails after address-resolution attempts. Fifth ND message? Redirect identifies a better next hop.

Enterprise switches can use Dynamic ARP Inspection (DAI) to validate ARP mappings against trusted information. The course mentions this protection but leaves its configuration outside the module.


---

## 10. Configuring Cisco IOS

## Modes and memory

| Prompt | Mode | How to enter |
|---|---|---|
| `R1>` | user EXEC | initial login |
| `R1#` | privileged EXEC | `enable` |
| `R1(config)#` | global configuration | `configure terminal` |
| `R1(config-if)#` | interface configuration | `interface ...` |
| `R1(config-line)#` | line configuration | `line console 0` / `line vty 0 4` |

`exit` goes back one level; `end` or Ctrl-Z returns to privileged EXEC. `?` provides context-sensitive help; Tab completes a command.

**RAM:** running-config, ARP cache and routing table; data is lost when power is removed. **NVRAM:** startup-config. **Flash:** normally the IOS image. Changes to running-config take effect immediately, but use `copy running-config startup-config` to preserve them after a reboot.

## Practice configuration

Replace the values in angle brackets below; interface names depend on the device.

```text
enable
configure terminal
hostname R1
enable secret <strong-enable-secret>
service password-encryption
banner motd #Authorized access only#
line console 0
 password <console-password>
 login
 exec-timeout 5 0
 exit
interface gigabitEthernet 0/0
 description LAN
 ip address 192.168.10.1 255.255.255.0
 ipv6 address 2001:db8:10::1/64
 no shutdown
 exit
ipv6 unicast-routing
end
copy running-config startup-config
```

`no shutdown` administratively enables the interface. `description` is a comment. `ipv6 unicast-routing` enables IPv6 forwarding between interfaces.

On a Layer 2 switch, configure a management IP on an SVI such as `interface vlan 1`, and the gateway with `ip default-gateway 192.168.10.1`. This does not turn the Layer 2 switch into a router. The SVI also requires the relevant VLAN/port activity conditions to be met.

## SSH

```text
configure terminal
ip domain-name lab.example
username admin secret <strong-user-secret>
crypto key generate rsa
! When prompted in the lab, select a supported key size, for example 2048.
ip ssh version 2
line vty 0 4
 login local
 transport input ssh
 exec-timeout 5 0
end
copy running-config startup-config
```

The hostname is already configured. IP reachability, a user and RSA keys are required. `login local` uses the local user database. `transport input ssh` permits SSH on VTY lines. SSH encrypts the session; Telnet does not.

In classic IOS, `service password-encryption` hides plaintext passwords using weak, reversible Type 7 encoding; this is neither strong secret protection nor encryption of network traffic. See [Cisco on protecting secrets](https://www.cisco.com/c/en/us/about/trust-center/resilient-infrastructure/protecting-secrets.html).

## What to check

- `show ip interface brief` — IPv4 addresses and Status/Protocol; working interfaces are normally up/up.
- `show ipv6 interface brief` — interface IPv6 addresses.
- `show running-config` — active configuration commands.
- `show startup-config` — saved configuration.
- `show ip route` — routes.
- `ping` — reachability; `traceroute` — intermediate hops.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### IOS modes and startup

`R1>` is user EXEC with limited inspection commands. `enable` enters privileged EXEC (`R1#`). `configure terminal` enters `(config)#`; `line console 0` enters `(config-line)#`, and `interface g0/0` enters `(config-if)#`. `exit` moves up one level; `end` or Ctrl+Z returns to privileged EXEC.

Boot sequence: POST/bootstrap → IOS (usually Flash) → startup-config from NVRAM. A missing startup configuration may trigger the setup dialog. `copy running-config startup-config` saves changes. Reversing it **loads and merges** the saved configuration into the running one. `show version` reports IOS/hardware; `show ip interface brief` reports addresses and states (up/up means physical and line protocol are operational); `show ip route` lists routes and exit interfaces.

### Switch management and passwords

An SVI is a logical VLAN interface, not a physical port. A Layer 2 switch's SVI address/mask supports management; `ip default-gateway` enables its own management traffic to remote subnets. This does not turn it into an IP router.

Console is local out-of-band access; SSH/Telnet use the network and AUX may use a modem. A line `password` requires `login`; `login local` uses the local username database. `enable secret` protects privileged EXEC, not the console login. `service password-encryption` obscures plaintext in configuration, but legacy Type 7 is easily reversible.

Course hostname rules: start with a letter, end with a letter/digit, no spaces, letters/digits/hyphens, fewer than 64 characters. Example: RM-3-Switch-2A4.

## Understanding check: router setup and diagnosis

### When no shutdown is not enough

The command removes administrative shutdown. The physical link also needs working cabling/transceivers, a live neighbor and an enabled far-end port. `administratively down/down` suggests checking shutdown; `down/down` suggests the physical link; `up/down` suggests line-protocol/link configuration. `up/up` confirms Layer 1–2 operation, not correct IP addressing, routing or application availability. `description` labels a port; it does not enable it.

An SVI requires an existing active VLAN and normally at least one active forwarding port in that VLAN. Configure its IP under `interface vlan 1`, not arbitrarily on a Layer 2 access port.

### Choose the command for the question

| Need to know | Command | Why |
|---|---|---|
| All IPv4 addresses and states | show ip interface brief | Concise IP, Status and Protocol table |
| All interface IPv6 addresses | show ipv6 interface brief | Includes link-local and global addresses |
| Reachable networks | show ip route / show ipv6 route | Prefix, next hop and exit interface |
| Port details | show interfaces | Status, errors and link counters |
| Interface IP properties | show ip interface / show ipv6 interface | Detailed protocol-specific configuration |
| Active/saved commands | show running-config / show startup-config | Compare current settings with next-boot settings |
| IOS and boot information | show version | Version, hardware, uptime and configuration register where supported |

`?` lists valid commands/arguments in context. `Tab` completes an unambiguous word. “Invalid input” can mean the wrong mode, not a need to spell out the whole command: `conf t` works at # but not >.

### Diagnose a wrong gateway

PC 192.168.10.10/24 and SVI 192.168.10.2/24 use router 192.168.10.1 as gateway. Neighbor .20 is reached directly; 10.1.1.10 needs a router. Configure the PC gateway in its OS and the Layer 2 switch gateway with `ip default-gateway 192.168.10.1`; the switch setting does not assign its clients a gateway. An IPv6 gateway may be a router’s link-local address learned through RA; it need not share the host’s global prefix.

Troubleshoot in order: compare address/mask/gateway with the addressing table → check Status/Protocol → ping the gateway → ping a remote IP → check forward and return routes → fix the cause → retest and document. One timeout does not prove a broken cable because ICMP may be filtered. IOS ping uses `!` for reply, `.` for timeout and `U` for unreachable; the ICMP code further identifies the cause.

### Save, load or revert

`copy running-config startup-config` saves active commands for boot. `copy startup-config running-config` merges saved commands into the active configuration; it does not guarantee removal of every new command. For the exercise asking to discard all unsaved changes, reload without saving loads the old startup-config at boot. A real reload interrupts service.

### Practical self-check

Explain without notes why an SVI address does not guarantee SSH, why local ping can work with a wrong gateway, how saving differs from applying a setting, and why routers replace link encapsulation at each hop. In the lab, assemble the topology, configure addressing/access, verify connectivity and show-command output, then save. Interface names depend on the model; G0/0 and G0/0/0 are not interchangeable by assumption.

The archive contains lab descriptions and video headings 10.4.1–10.4.2, but empty transcripts for those videos. Their unseen contents and unavailable PT-file answers are not represented as independently rechecked here.


---

## 11. IPv4 and subnetting

**Key idea:** a mask divides a 32-bit address into network and host portions. Bitwise AND of the address and mask produces the network address.

## A table worth learning

| Prefix | Mask | Block size | Usable hosts in an ordinary LAN |
|---|---|---:|---:|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |

If h = 32 − prefix, the address count is 2^h and the usual host count is 2^h−2. The network and broadcast addresses are excluded. /31 point-to-point networks and /32 are exceptions: do not apply this formula mechanically.

## Solve a problem in a minute

Address `192.168.10.77/28`:

1. /28 → mask .240, block size 256−240=16.
2. Boundaries: 0,16,32,48,64,80… The value 77 lies between 64 and 79.
3. Network: `192.168.10.64`.
4. Broadcast: `192.168.10.79`.
5. Hosts: `.65`–`.78`, 14 in total.

Example `/22`: `172.16.16.0/22` has mask 255.255.252.0. The third-octet increment is 4, covering 16–19. Broadcast: `172.16.19.255`; usable hosts: 1022.

## Number of subnets and VLSM

For N equal-size subnets, borrow b bits such that 2^b ≥ N. Five networks: 2²=4 is insufficient; 2³=8 is enough → borrow 3 bits. Starting from /24 gives /27.

VLSM permits different subnet sizes. Suppose a /24 must support 100, 50 and 20 hosts: choose /25 (126), /26 (62), /27 (30). Allocate largest first: `.0/25`, `.128/26`, `.192/27`. Blocks must be aligned and must not overlap.

## Special address ranges

| Range | Purpose |
|---|---|
| 10.0.0.0/8 | private |
| 172.16.0.0/12 | private: 172.16–172.31 |
| 192.168.0.0/16 | private |
| 127.0.0.0/8 | loopback, commonly 127.0.0.1 |
| 169.254.0.0/16 | link-local, often following unsuccessful DHCP |
| 224.0.0.0/4 | multicast |
| 255.255.255.255 | limited broadcast |

Not all of 172/8 is private. A subnet’s broadcast is its last address, which does not necessarily end in 255.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Classify an address using its mask

An address can be host, network or broadcast depending on the prefix. 192.168.1.96 is a network address with /27 but a host in 192.168.1.64/26. 192.168.1.15/29 is the broadcast of .8/29. For .17/30: network .16, hosts .17–.18, broadcast .19. For .35/29: network .32, hosts .33–.38, broadcast .39.

/20 means 255.255.240.0. /26 leaves 6 host bits: 64 total and 62 ordinary usable addresses; a /24 splits into four /26 networks. 90 or 126 hosts need /25 (128 total, 126 usable); 2662 need /20. Allocate VLSM largest first and count remaining space using allocated blocks, not just the number of computers.

### Special addresses and delivery

Unicast targets one host, multicast a selected group, broadcast a broadcast domain. Limited broadcast 255.255.255.255 differs from a subnet's directed broadcast. Routers normally do not forward broadcasts between networks; VLANs/subnets bound their propagation.

169.254.0.0/16 is link-local and often indicates no DHCP response. DHCP Discover may use source 0.0.0.0 and destination 255.255.255.255. 127/8 is loopback. 192.0.2/24, 198.51.100/24 and 203.0.113/24 are documentation networks; 240/4 is reserved. Not being RFC 1918 does not automatically make an address ordinary public unicast. IANA coordinates global resources; RIRs allocate regional blocks to providers and organizations.

## NetAcad 11 audit: subnetting from basics to planning

### AND and prefix length

Bitwise AND gives 1 only for 1 AND 1; all other pairs give 0. Thus the mask preserves network bits and clears host bits. /24, /16, /8 align with octet boundaries, while many problems cut inside an octet. Block size in the changing octet =256 minus that mask octet. Example: /22 uses 255.255.252.0, step 4 in octet 3; 172.16.130.7 belongs to 172.16.128.0/22, broadcast 172.16.131.255.

### Subnet count and host count are separate checks

For N subnets, choose the smallest b with 2^b≥N. For H hosts, choose the smallest h with 2^h−2≥H. New prefix=old prefix+b, while 32−new prefix must still leave enough host bits.

100 subnets from 172.16.0.0/16: 6 bits give 64, 7 give 128→/23. Each has 512 addresses, 510 usable, with step 2 in octet 3.1000 subnets from 10.0.0.0/8: 9 bits give 512, 10 give 1024→/18, mask 255.255.192.0. Each has 16384 addresses, 16382 usable; step 64 in octet 3, so 10.0.192.0/18 is followed by 10.1.0.0/18.

### Complete VLSM example

Fit 60, 28, 12, 2 hosts into 192.168.10.0/24. Sort largest first: 60→.0/26 (.1–.62), 28→.64/27 (.65–.94), 12→.96/28 (.97–.110), 2→.112/30 (.113–.114). Broadcasts are.63, .95, .111, .115. Every block is aligned and non-overlapping. Space after.115 is not automatically one arbitrary CIDR block; future allocation must respect boundaries again.

### Address planning and historical classes

Historical Classes A/B/C used default /8, /16, /24; modern CIDR explicitly specifies the mask, which takes precedence over first-octet assumptions. Class D meant multicast 224/4, Class E reserved 240/4. Classful tables explain older wording but never replace the subnet mask.

Segmentation reduces broadcasts, separates departments/security policies and simplifies management. Before calculating, inventory LAN/WAN/DMZ networks, host requirements and growth. Clients commonly use DHCP; gateways, servers, printers and infrastructure management need predictable addresses (static or reserved). Exclude these from dynamic pools. An organization may use its assigned public addresses internally; private addresses cannot simply be advertised as globally routable.

For a PT lab, record network/prefix, usable range, broadcast and gateway for each LAN; configure addresses, verify interfaces up/up and ping the local gateway/remote host. This explains the method; it does not claim completion of an unavailable PT activity.


---

## 12. IPv6

128 bits are written as eight 16-bit hexadecimal groups. Example: `2001:0db8:0000:abcd:0000:0000:0000:0001` → `2001:db8:0:abcd::1`.

Rules: omit leading zeros within a group; replace one consecutive run of zero groups with `::`. You cannot use `::` twice. When equally long zero runs tie for the longest, the standard representation compresses the first.

## Address types

- **GUA:** global unicast; typical course examples use 2000::/3.
- **LLA:** link-local FE80::/10; limited to a single link and not forwarded by routers.
- **Loopback:** ::1/128.
- **Unspecified:** ::/128 — no assigned address during the relevant procedures.
- **Multicast:** FF00::/8; FF02::1 means all nodes, FF02::2 means all routers on the link.
- **Anycast:** one unicast address assigned to multiple interfaces; delivery goes to the nearest according to the routing metric.

**IPv6 has no broadcast.** Do not confuse link-local addresses with private IPv4: their mechanisms and scopes differ.

## Prefixes and subnets

An ordinary LAN uses /64. In `2001:db8:cafe:1111:2222:3333:4444:5555/64`, the first four groups are the prefix and the last four form the interface ID. If a provider assigns /48, the fourth group (`1111`) is the 16-bit subnet ID. This permits 2^16 = 65536 /64 subnets.

## How addresses are assigned

| Method | Address | Other settings |
|---|---|---|
| SLAAC | the host forms it from the RA prefix | from RA, depending on supported features |
| SLAAC + stateless DHCPv6 | the host forms it itself | additional settings, such as DNS, through DHCPv6 |
| Stateful DHCPv6 | assigned by a DHCPv6 server | DHCPv6 |

The default gateway is normally learned from RA, not DHCPv6. RS solicits routers; RA is a router’s response/advertisement. DAD checks whether the address is already in use.

EUI-64: split the MAC in half, insert FFFE, and invert the U/L bit. Another option is a generated interface ID. Not all devices derive their IPv6 address from a MAC.

Coexistence: dual stack runs both stacks; tunneling places a packet inside another packet; translation converts between protocols.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Prefix, subnet ID and interface ID

A global unicast address can be divided into the provider's global routing prefix, the organization's subnet ID and the host interface ID. A /48 allocation with /64 LANs leaves 16 subnet bits; /32 to /64 leaves 32. An ordinary /64 uses the last 64 bits for the interface ID. Do not confuse the subnet ID with the entire network prefix.

2001:db8::1000:a9cd:47ff:fe57:fe94 expands to 2001:db8:0000:1000:a9cd:47ff:fe57:fe94. Its /64 network is 2001:db8:0:1000::/64; its interface ID is a9cd:47ff:fe57:fe94. Splitting 2001:db8::/48 into /52 borrows 4 bits: 16 subnets, with fourth hextets 0000, 1000, …, f000. The last is 2001:db8:0:f000::/52.

### Easily confused addresses and messages

fe80::/10 is link-local and cannot be routed off-link. ff02::1 targets all link-local nodes; ff02::2 targets all routers. Hosts send RS; routers send RA. ND uses solicited-node multicast with prefix ff02::1:ff00:0/104. IPv6 has no broadcast.

An interface ID may be random or derived using modified EUI-64: split the MAC, insert ff:fe and invert the first byte's U/L bit. SLAAC does not require a MAC-derived ID. IPv6 removes address-conservation pressure for NAT, but does not replace a firewall. /64 is the normal LAN prefix, not a mandatory size for every IPv6 link.

## Practical IPv6 configuration and precise terminology

### ULA, LLA and documentation addresses

Unique-local FC00::/7 (normally locally generated FD…) serves internal communication within an organization or limited sites. It can route between internal subnets but normally not across the global Internet. LLA FE80::/10 never leaves one link. ULA and LLA are therefore not synonyms. 2001:db8::/32 is reserved for documentation: exercises use its familiar GUA form, but it is not for a real public service. IPv6 alone does not replace filtering/security.

### IOS mini-lab

```text
configure terminal
ipv6 unicast-routing
interface gigabitethernet 0/0/0
ipv6 address 2001:db8:acad:1::1/64
ipv6 address fe80::1 link-local
no shutdown
end
show ipv6 interface brief
show ipv6 route
```

`ipv6 address …/64` sets a GUA with no space before `/64`; `link-local` explicitly sets an LLA. Interface addressing alone does not enable forwarding: use global `ipv6 unicast-routing`. `show ipv6 interface brief` displays GUA/LLA and up/up physical/line-protocol states; `show ipv6 route` shows IPv6 routes. Look in `show running-config` to verify routing is enabled. Windows configures address, prefix length and default gateway separately; the gateway may be the router’s LLA.

An LLA appears automatically when IPv6 is enabled and may use EUI-64 or another IID method. It must be unique on its link, not globally: fe80::1 can exist on two separate links. Accessing an LLA may require a source interface/zone so the system knows which link to use.

### EUI-64 step by step

MAC 00:1A:2B:3C:4D:5E → split 00:1A:2B and 3C:4D:5E → insert FF:FE → 00:1A:2B:FF:FE:3C:4D:5E → flip the U/L bit (XOR first byte with 0x02) → 02:1A:2B:FF:FE:3C:4D:5E. IID: 021a:2bff:fe3c:4d5e. This flips one bit, not the whole MAC. Random/stable privacy IIDs need not contain FFFE. DAD checks uniqueness before normal address use.

### Three RA scenarios without the gateway trap

SLAAC constructs the address on the host; SLAAC plus stateless DHCPv6 adds server settings such as DNS; stateful DHCPv6 assigns the address and tracks leases. In these course scenarios the default router still comes from RA, not ordinary DHCPv6. RA does not choose a unique IID for the host. DNS through RA depends on supported options/implementation.

### Subnet plan and multicast

For allocation 2001:db8:acad::/48, assign LANs 2001:db8:acad:1::/64, :2::/64 and :3::/64. Change subnet ID while retaining 64 IID bits. Do not subtract IPv4-style network/broadcast addresses when counting IPv6 subnets; IPv6 has no broadcast. FF02::1 targets all link-local nodes; FF02::2 routers. Solicited-node multicast uses a unicast/anycast address’s final 24 bits to narrow NS recipients: …:1234:5678 maps to FF02::1:FF34:5678. Missing-exhibit problems require actual site/sub-site/subnet field widths before a result such as 16 or 256 can be computed.


---

## 13. ICMP, ping and traceroute

ICMP reports IP errors and assists diagnosis. It does not guarantee delivery and does not replace TCP.

**ping:** Echo Request → Echo Reply. It helps assess reachability and round-trip time (RTT). A loopback reply confirms the local stack; a gateway reply confirms gateway reachability. Neither alone proves access to the entire internet.

**traceroute / tracert:** probes use TTL/Hop Limit values 1,2,3… The router where the value expires replies with Time Exceeded, revealing intermediate hops. The transport used for probes depends on the implementation.

In IOS, `!` means a reply, `.` a timeout, and `U` unreachable. ICMP filtering and response-rate limits may hide a working device: a single `*` in a trace is not proof of a failure.

Diagnostic order: IP/mask → loopback → local neighbor/gateway → remote IP → domain name. If the IP works but the name does not, check DNS. `ipconfig`, `nslookup`, `ping` and `tracert` answer different questions.

Trap: “ICMP code 0” is insufficient without a type. ICMPv4 Type 3/Code 0 means network unreachable; Echo Reply Type 0/Code 0 is a successful reply. In IPv6, an unknown Next Header is reported through Parameter Problem; do not apply IPv4’s code table to IPv6. [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443).



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### What ping and traceroute actually prove

Successful ping shows reachability and round-trip time (RTT), not that every application works. Higher RTT than a baseline indicates increased delay. A timeout can result from ICMP filtering, addressing, missing routes or faults; it does not identify a unique cause.

For IOS extended ping, enter `ping` without a destination, enable extended commands and select a source address/interface. This tests reachability from that source rather than the usual outgoing-interface address. Windows `tracert -6` explicitly selects IPv6.

### ICMP needs both type and code

ICMPv4 Echo Reply is type 0/code 0; Destination Network Unreachable is type 3/code 0. “Code 0” alone is ambiguous. TTL/Hop Limit expiration produces Time Exceeded. An unknown IPv6 Next Header may produce Parameter Problem. Pinging ::1 or 127.0.0.1 tests the local stack, not a cable or ISP.

`ipv6 unicast-routing` enables IPv6 forwarding; routers normally send RA on suitable interfaces. Check the command in `show running-config`. In diagram questions, identify the actual gateway/interface first: a server address and a gateway address serve different purposes.

## ICMP: messages and result interpretation

### Message matrix

| Message | Trigger | What it establishes |
|---|---|---|
| Echo Request / Echo Reply | Ping test | Two-way Echo exchange with the specified address |
| Destination Unreachable | A host/router cannot deliver a packet | Type and code identify the reason; it does not automatically mean the target is powered off |
| Time Exceeded | TTL/Hop Limit expires during forwarding | The probe reached the reporting router; the basis of traceroute |
| Packet Too Big (ICMPv6) | Packet exceeds the next link MTU | Sender must reduce size; IPv6 routers do not fragment |
| Parameter Problem | Invalid field/unknown Next Header | Packet structure or interpretation problem |
| RS / RA | Router discovery and IPv6 configuration | Host requests; router advertises prefix/gateway information |
| NS / NA | IPv6 resolution, DAD and neighbor checking | Resolve a neighbor or detect a tentative-address conflict |
| Redirect | Router suggests a better local next hop | Not a protocol for constructing the entire routing table |

ICMPv4 Destination Unreachable type 3 uses codes 0 network, 1 host, 2 protocol and 3 port. Do not transfer those numbers to ICMPv6. ICMP reports errors; it does not retransmit lost packets or turn IP into reliable transport.

### Traceroute through three routers

TTL=1 expires at R1 → R1 returns Time Exceeded. TTL=2 expires at R2, TTL=3 at R3, and TTL=4 reaches the target. Completion differs: ICMP Echo probes receive Echo Reply; classic UDP probes to a closed port receive Port Unreachable. Thus not every trace response is Time Exceeded.

Each row’s RTT is measured from the source to that responder and back. Subtracting adjacent RTTs is not an exact link-delay measurement because return routes may differ. `*` means no timely response, not a proven router failure. If later hops respond, traffic passes the silent portion.

### Testing ladder

1. Loopback 127.0.0.1 / ::1 tests local IP implementation, not cabling or gateway settings.
2. A neighbor/default gateway tests the local network, not further connectivity.
3. A remote IP tests a two-way ICMP path, not HTTP/mail functionality.
4. A domain adds DNS resolution. `nslookup` separates it from Echo; a resolved name with no ping reply may still mean DNS worked.

The first ping can time out during ARP/ND resolution; repeat a series and inspect success rate rather than one packet. Record source/target, time, loss and RTT for a baseline and compare equivalent measurements. Increased RTT suggests delay but does not directly measure bandwidth.

### A course boundary worth understanding

RS/RA are particularly important in IPv6, but also exist in IPv4 Router Discovery ([RFC 1256](https://www.rfc-editor.org/info/rfc1256/)). A bank question demanding exactly two shared messages from RS, RA and Redirect is therefore ambiguous. IPv6 unknown Next Header is Parameter Problem in [RFC 4443](https://www.rfc-editor.org/info/rfc4443/). Such cards are flagged and excluded from unambiguous testing.


---

## 14. TCP and UDP

**Key idea:** IP delivers a packet to a device; the transport layer helps deliver data to the correct application and distinguish conversations.

| Property | TCP | UDP |
|---|---|---|
| Connection | established | not established |
| Delivery | ACKs and retransmissions | no guarantee or retransmissions |
| Order | restored | UDP does not reorder |
| Flow control | available | unavailable |
| Header | at least 20 bytes | 8 bytes |
| Course examples | HTTP, FTP, SMTP | VoIP, TFTP, DNS queries |

A UDP checksum can detect corruption; lack of reliability does not mean lack of checking. For IPv6, the UDP checksum is generally mandatory, with narrow special exceptions. [RFC 8200](https://datatracker.ietf.org/doc/html/rfc8200).

## Ports and sockets

Socket = IP:port, for example `192.168.1.10:49152`. Addresses, ports and the transport protocol identify an exchange. The client uses an ephemeral port and the server uses its service’s known port.

- 0–1023: well-known/system.
- 1024–49151: registered/user.
- 49152–65535: dynamic/private.

HTTP request: client `10.1.1.10:49152` → server `10.1.1.254:80`; the source/destination roles reverse in the response.

## TCP handshake and termination

Opening: SYN → SYN+ACK → ACK. SYN synchronizes initial sequence numbers; ACK acknowledges. Typical closing: FIN → ACK, then FIN → ACK in the other direction; messages may be combined, so “always exactly four” is too strict.

A sequence number identifies a byte in the stream. ACK identifies the next expected byte. After receiving bytes 1–4500, the ACK is 4501, not 4500.

The receive window advertises how much data the receiver can accept: this is **flow control**. A sliding window allows multiple segments to be sent without waiting for an ACK after each one. **Congestion control** separately responds to network congestion and reduces the amount of unacknowledged data.

UDP is useful when low delay matters more than retransmitting old data, or when the application handles recovery. This does not mean all video always uses UDP: streaming video may use TCP/QUIC.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Headers, ports and connections

UDP has an 8-byte header with four fields: source port, destination port, length and checksum. TCP has a minimum 20-byte header; sequence number, acknowledgment, flags and window support functions absent from UDP. UDP neither restores original order nor retransmits lost datagrams. Its checksum detects errors; it does not guarantee delivery.

Well-known ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. Client source ports distinguish application conversations. Operating systems may use their own ephemeral range: not every temporary source port must be >=49152. Connections are distinguished by protocol, source/destination IP and source/destination port.

`netstat` shows connections, addresses/ports and states; `netstat -r` shows routes; `ipconfig` shows IP configuration. Destination port 80 usually indicates HTTP, 25 SMTP and 53 DNS. A client's source port need not equal the server's service port.

### ACK, windows and closing

ACK identifies the next expected **byte**: bytes 4001–4500 lead to ACK 4501. The receive window limits unacknowledged data according to receiver capacity (flow control); congestion control responds to network congestion. Opening: SYN → SYN/ACK → ACK. Typical closing: FIN → ACK in each direction; some messages can combine. TCP segmentation belongs to transport, IP fragmentation to the network layer.

## NetAcad 14 audit: transport in operation

### Two TCP directions and byte numbers

TCP is a bidirectional byte stream with separate sequence/ACK spaces per direction. Opening: client SYN with ISN=x; server SYN+ACK with ISN=y and ACK=x+1; client ACK=y+1. SYN and FIN each consume one sequence position. ACK names the next expected byte, not the last packet number. Bytes 1001–1500 lead toACK 1501. An ACK confirms TCP reception, not that the application has processed a file.

If 1501–2000 are missing but 2001–2500 arrive, cumulativeACK remains 1501 until the gap is filled. TCP may buffer later data; timers/loss signals trigger retransmission. Each direction closes separately withFIN→ACK; the reverse direction can still send until its own FIN. RST is a reset, not the ordinary four-message close.

### Header fields and their jobs

TCP: source/destination port, sequence number, acknowledgment number, data offset(header length), reserved bits, control flags, window, checksum, urgent pointer, plus optional options/padding. The course groups these as ten base fields occupying at least 20 bytes. Flags: SYN synchronizes, ACK validates the acknowledgment field, FIN ends one direction’s data, RST resets, PSH requests application delivery andURG enables urgent-pointer semantics. The checksum checks header/data with a pseudo-header; it does not guarantee delivery.

UDP has two ports, length and checksum, totaling 8 bytes. Length includes its header and data. There is no window, sequence/ACK or handshake. Applications choose how to handle loss/reordering. TFTP adds its own acknowledgments above UDP without changing its transport into TCP.

### MSS, MTU, receive window and congestion window

MTU bounds an IP packet on a link. MSS is maximum TCP data in one segment, excluding TCP/IP headers; it is advertised as a TCP option during the handshake. MTU 1500 minus IPv 4 header 20 minus TCP header 20 gives MSS 1460. IPv 6 base 40 plus TCP 20 leaves 1440 without additional headers. Options/tunnels may reduce payload.

Receive window(rwnd) protects the receiver’s buffer; congestion window(cwnd) limits load on the network. Actual sending is constrained by both. A sliding window advances with ACKs and allows multiple segments in flight. A 6000-byte window is neither one mandatory packet size nor a rule that ACKs occur only after filling the entire window.

### Servers, clients and observation

Servers listen on service ports; clients choose available temporary source ports. Replies reverse source/destination ports. One listening port serves many connections through distinct socket pairs; NAT clients may share one public IP but use different ports. netstat shows local/foreign endpoints and TCP states. In Wireshark compare SYN/SYN-ACK/ACK, Seq/Ack/Window and retransmissions. PT Simulation can contrast HTTP/TCP with DNS/UDP, but reading this explanation does not itself complete a PT exercise.


---

## 15. Application layer

The TCP/IP application layer combines the OSI application, presentation and session layers. Presentation concerns formats, encoding/compression; session concerns managing dialogs; application provides network services to applications.

## Protocols and ports

| Service | Port in basic examples | Purpose |
|---|---|---|
| FTP | TCP 21; data TCP 20 in active mode | file transfer |
| SSH | TCP 22 | secure management |
| Telnet | TCP 23 | unencrypted management |
| SMTP | TCP 25 | sending/relaying email |
| DNS | UDP/TCP 53 | name records |
| DHCPv4 | UDP 67 server, 68 client | assigning IP configuration |
| TFTP | UDP 69 for the initial request | simple file transfer |
| HTTP | TCP 80 in the classic model | web |
| POP3 | TCP 110 | receiving email |
| IMAP | TCP 143 | server-side mailbox |
| HTTPS | 443 | secure web |
| SMB | TCP 445 | files and printers |

This is a course reference table: secure email ports, passive FTP and HTTP/3 over QUIC/UDP also exist. For an MCQ, follow the specific wording.

## DNS

A → IPv4, AAAA → IPv6, MX → mail exchanger, NS → authoritative nameserver, CNAME → alias. `.com` is a top-level domain. A DNS server does not have to refuse a query just because the name is outside its zone: it may use recursion/forwarding. `nslookup` checks name resolution; DNS uses both UDP and TCP.

## DHCP

DORA: Discover → Offer → Request → Acknowledge. A client without an address searches for a server using a broadcast. DHCP leases an address and supplies network settings. A home router often performs this role. A 169.254.x.x address instead of the expected DHCP address is a reason to check server availability.

## HTTP and email

GET retrieves a resource; POST submits data; PUT creates/replaces a resource at the specified address. HTTPS uses TLS to protect HTTP.

SMTP sends mail, POP3 retrieves it to a client, and IMAP supports centralized storage and synchronization. POP3 can leave copies, so “always deletes mail from the server” is incorrect.

FTP has control and data connections and supports upload/download. SMB provides shared files/printers and persistent sessions; it is not limited to Windows.

Client/server: the client initiates a request and the server provides a service. A PC remains the client while uploading. P2P: a node may act as both client and server; no dedicated server is required.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Roles and application layers

In client/server, the client initiates a request even when **uploading to the server**. In P2P, a participant can act as both client and server; resources are decentralized and no dedicated server is required. A home PC sharing a folder or printer is an example. These are application roles, not physical locations.

TCP/IP application combines OSI application (application protocols), presentation (formats, encoding and compression: GIF/JPG/MKV) and session (dialog establishment/maintenance). Outgoing web data follows HTTP → TCP → IP → Ethernet; incoming data is decoded in reverse.

### DNS, mail and files

DNS A maps to IPv4; AAAA to IPv6; NS identifies authoritative name servers; MX identifies domain mail servers. An out-of-zone query need not fail immediately: recursion, forwarding or referral may resolve it. `nslookup` queries DNS and displays the selected server. The top-level domain in www.cisco.com is .com. DNS uses UDP and TCP 53: ordinary queries often use UDP, zone transfers TCP, but clients can also use TCP.

SMTP sends mail; POP3 downloads it (retaining a server copy is configurable); IMAP synchronizes server folders for multiple devices and centralized storage. FTP has separate control/data connections: control TCP 21, server data port 20 in active mode; passive mode negotiates another port. FTP supports upload and download. SMB supports persistent file/printer sharing connections and is not limited to Windows.

### HTTP and DHCP scenarios

GET requests a resource; POST submits data for processing, often for uploads; PUT creates/replaces the resource at a known URI. HTTPS protects HTTP with TLS; plain HTTP does not encrypt. Course questions assume HTTP/1.1 or HTTP/2 over reliable TCP; HTTP/3 uses QUIC over UDP.

DHCP automates address, mask, gateway and DNS settings. Server UDP 67, client UDP 68. A home router commonly supplies DHCP. An automatic 169.254.x.x address instead of the expected lease suggests DHCP did not succeed; it does not uniquely prove a server fault. TFTP uses UDP 69, unlike FTP.

## The complete web, DNS and DHCP lease sequence

### From URL to page

In `http://www.cisco.com/index.html`, http is the scheme, www.cisco.com the server name and /index.html the path. The browser needs an IP through cache/DNS, establishes the classic HTTP TCP connection, sends GET for the path and receives status/headers/body to render HTML. HTML structures a document; HTTP transfers it. Images may require further requests. HTTPS adds TLS protection without guaranteeing site honesty. HTTP/3 uses QUIC instead of TCP, so note the question’s version.

### DNS is distributed

Hierarchy: root → TLD (.com) → cisco.com → www.cisco.com. An authoritative server knows its zone; a recursive resolver assists clients using other servers and cache. TTL limits cached-answer lifetime, reducing queries while allowing stale data until expiry. DNS messages include question, answer, authority and additional sections. A/AAAA contain addresses, NS names authoritative servers and MX mail exchangers; exchanger names still need IP resolution.

`nslookup example.com` tests server-side resolution; `ipconfig /displaydns` displays the Windows local cache. If IP access works but name access fails, investigate DNS rather than assuming a broken link. An out-of-zone name need not fail immediately: recursion, forwarding or referral can supply an answer.

### Why DORA needs four messages

Discover finds DHCPv4 servers; Offer proposes address, mask, gateway, DNS and lease duration. With multiple offers, the client selects one in Request. ACK finalizes the lease; NAK invalidates it and restarts acquisition. The client requests renewal before expiry; an address is not permanent property. Static assignment suits predictable infrastructure, while DHCP manages many clients efficiently.

An initial unconfigured client uses 0.0.0.0 and broadcast; UDP 68 is client, 67 server. A 169.254.x.x fallback suggests checking connectivity, VLAN, relay and DHCP availability, not one proven failure cause. DHCPv6 uses different message names; DORA is not its literal packet-name sequence.

### Mail, files and roles

Mail flows sender client → SMTP server → recipient SMTP server → recipient IMAP/POP3 client. IMAP synchronizes a server mailbox and folders; POP3 is download-oriented and may optionally retain copies. Secure variants can use TLS and ports beyond the basic course table.

FTP retains a control channel for commands and opens a data channel for file/directory transfer. Active/passive differ in data-connection establishment; both upload and download. SMB creates/authenticates/terminates sessions and controls file/printer access. Samba connects Linux/Unix systems; SMB is not Microsoft-only.

P2P applications need a user interface and background resource-sharing service. Hybrid P2P can centralize an index while peers store the files, so a directory/tracker does not necessarily make file exchange a central file-server model. Upload/download direction does not change client/server roles: the client requests a service and the server provides it.

**Self-check:** Explain URL→DNS→TCP→HTTP, DNS TTL, Request after Offer, IP assignment versus MAC resolution, IMAP versus SMTP, and why uploading does not make the client the server.


---

## 16. Security

## Distinguish the terms

**Threat** is a potential danger; **vulnerability** is a weakness; **exploit** is a way to take advantage of it. Confidentiality/Integrity/Availability describe keeping information private, accurate and accessible.

| Scenario | Category |
|---|---|
| Stealing a database/secret documents | information theft |
| Using someone else’s identity/card | identity theft |
| Deleting/altering records | data loss/manipulation |
| Overloading a website until it fails | disruption of service / DoS |
| Scanning a network before an attack | reconnaissance |
| Unauthorized login | access attack |
| Interception between parties | man-in-the-middle |

A virus inserts itself into another object; a worm spreads independently; a Trojan masquerades as useful software; spyware gathers information. Viruses also replicate: “viruses do not replicate at all” is incorrect.

A firewall filters traffic; stateful inspection considers connection state. IDS detects and reports; IPS can block. A DMZ isolates public servers from the internal network. Layered defense combines updates, firewalls, endpoint protection, strong secrets, restricted privileges and backups.

## AAA

- Authentication: who are you? Verifying identity.
- Authorization: what may you do? Read/change permissions.
- Accounting: what did you do? Recording actions and events.

## IOS security

`login block-for 30 attempts 2 within 10`: block logins for 30 seconds after 2 failures within 10 seconds. Do not mix up the three numbers.

`exec-timeout 5 0` ends an inactive session after 5 minutes. Console and VTY lines are protected separately. SSH is preferable to Telnet. Secrets based on a person’s name, even with altered capitalization, are easy to guess.

Physical threats: hardware — physical damage; environmental — temperature/humidity; electrical — power; maintenance — servicing mistakes.



Source: the corresponding NetAcad module and Lectures 5–10; the general notes include introductory explanations.


## Question-bank study supplement

### Identify threats by the action

Information theft steals documents/databases; identity theft impersonates someone, such as applying for credit; data loss/manipulation destroys or changes records; disruption of service prevents legitimate access. These are consequences. Reconnaissance maps systems/ports; access attacks gain unauthorized access; DoS disrupts or overloads service. One incident can include multiple stages.

A virus attaches to an infected program/object; a worm spreads independently through vulnerabilities; a Trojan masquerades as useful software; spyware secretly collects information. Patches close worm vulnerabilities, while antivirus helps detect malicious code. Slow performance alone does not prove a worm. Man-in-the-middle intercepts or modifies communication between endpoints.

### AAA and filtering

Authentication asks who you are; authorization determines permitted actions; accounting records your actions. Read-only for everyone and Edit only for administrators is authorization. A firewall restricts traffic; stateful inspection relates replies to existing connections. Packet filtering can inspect IP, protocol and transport ports; URL filtering uses web addresses/categories. Modern application filtering identifies applications beyond port numbers, although an older bank question simplifies it to ports.

A DMZ separates externally accessible servers from the internal network. A VPN provides a protected remote tunnel. Layered security combines controls, such as perimeter firewall, internal IPS and endpoint protection. Backups enable recovery; secure them with permissions/passwords and test restoration.

### SSH and physical threats

SSH TCP 22 encrypts login and data; Telnet TCP 23 does not. IOS SSH needs a hostname, domain name, RSA keys and a local user; VTY requires `login local` and `transport input ssh`. `login block-for 180 attempts 2 within 30` blocks login for 180 seconds after two failures within 30 seconds. `exec-timeout` limits console/VTY idle sessions. Personal names such as RobErT remain weak passwords despite mixed case.

Environmental threats involve temperature/humidity; electrical threats involve voltage/power; hardware threats involve physical damage; maintenance threats involve handling errors, ESD, poor cabling/labels or missing spares. An OS technological vulnerability differs from an incorrect ACL configuration and a weak security policy.

## Security: omitted course topics and practical meaning

### Three weaknesses and four impacts

A technological weakness is a flaw in software/protocol/hardware. A configuration weakness is a bad ACL, unnecessary open service or weak password. A policy weakness is missing or poorly designed access, update or responsibility rules. One incident can combine all three. Avoid saying any protocol is always insecure: TLS, version and configuration matter.

CIA classifies impact: information theft violates confidentiality; record alteration integrity; service overload availability. Identity theft specifically uses another person’s identity, rather than merely stealing a database containing names.

### Layers and their roles

| Control | Specific role |
|---|---|
| VPN | Protected remote-access/site-to-site tunnel |
| Firewall | Network allow/deny policy |
| IPS | Analyze traffic and block detected attacks |
| IDS | Detection/alerts, not automatically prevention |
| ESA / WSA | Filter suspicious email / dangerous web resources |
| AAA server | Centralize administrator identity, permissions and accounting |
| Endpoint protection | Antivirus/host IPS, updates, host firewall and trained users |

A DMZ publishes needed servers under separate rules without exposing the whole internal network. A stateful firewall need not deny every new inbound connection: explicit rules can permit a public service. Its defining feature is connection-state tracking.

### Backups: four separate questions

**Frequency:** when to make full backups and capture changes. **Storage:** where to keep a copy, including another site so one incident cannot destroy both original and backup. **Security:** who has access and how copies/recovery keys or passwords are protected. **Validation:** verify integrity and actually test restoration. A copied file alone does not prove the recovery plan works.

Updates close known vulnerabilities, particularly those used for autonomous worm spread. A standard OS image with approved applications simplifies management but still needs patches after deployment. Antivirus definitions improve detection; they do not replace OS fixes.

### Hardening and Cisco AutoSecure

`auto secure` from privileged EXEC runs a security configuration assistant on supported IOS. It helps but does not make the router invulnerable; understand its service/access changes before using it on a real network. General steps are replacing default credentials, limiting privileges, removing unused services, updating software and protecting physical access.

Physical planning includes locked equipment rooms, access controls/logs and cameras; cooling mitigates overheating, UPS/quality power addresses electrical threats, and ESD procedures/labels reduce maintenance mistakes.

### Why each security command matters

| Command / mode | What it does | What it does not do |
|---|---|---|
| security passwords min-length 10 / global | Enforces minimum length for new supported passwords | Does not make a predictable name strong or automatically replace existing passwords |
| login block-for 120 attempts 3 within 60 / global | Blocks VTY attempts for 120 seconds after 3 failures in 60 seconds | Does not block all IP traffic or secure physical entry |
| exec-timeout 5 30 / line | Disconnects after 5 minutes 30 seconds idle | Not a maximum active working-session duration |
| login local / VTY | Uses the local username database | Does not create users or generate SSH keys |
| transport input ssh / VTY | Permits SSH instead of Telnet | Does not encrypt a plaintext Telnet session |
| no ip http server / global | Disables an unnecessary HTTP server | Does not automatically disable a separate HTTPS server |

Inspect services first using `show ip ports all` on applicable IOS-XE or `show control-plane host open-ports` on older IOS. Disable only unneeded services to avoid losing the management path in use. `show running-config | section line vty` verifies line rules; save using `copy running-config startup-config`.

### Historical teaching examples versus operational settings

The source course uses RSA 1024, MD5 and example passwords cisco/class. These illustrate older-platform syntax rather than a modern security benchmark. Real deployments should select supported current algorithms, SSHv2 and strong unique secrets; the existing notes use RSA 2048 as an example. Type 7 is reversible and mixed-case personal names remain weak. A long unpredictable passphrase can improve memorability without obvious personal information.

The SSH sequence is hostname → domain name → RSA keys → local username secret → VTY login local → transport input ssh. IP reachability and access-policy permission are also required. Verify login/permissions, idle-session termination and persistence. Covering lab objectives does not mean the specific PT activities have already been executed.

### Reconnaissance, access and DoS are different stages

Reconnaissance includes Internet queries (public information and DNS/registration), ping sweeps (which addresses respond) and port scans (which services are available). This maps the environment rather than proving a break-in; administrators use the same tools for authorized diagnosis.

Access attack types: a **password attack** tries to obtain credentials through guessing, theft or interception; **trust exploitation** uses a compromised trusted system/account to access another; **port redirection** relays through a compromised system to reach a resource not directly accessible; **man-in-the-middle** intervenes in communication to read or alter it. Do not equate malicious port redirection with ordinary authorized NAT port forwarding: unauthorized use, not the feature name, determines the attack.

DoS exhausts resources/disrupts service. DDoS has the same goal but comes from many sources, often infected devices. Many packets from one computer do not establish DDoS. A Trojan is defined by its deceptive disguise and need not replicate itself; it may open a backdoor or load other malware, including a worm.

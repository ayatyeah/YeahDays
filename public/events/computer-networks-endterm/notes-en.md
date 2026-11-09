# Computer Networks — full study notes

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

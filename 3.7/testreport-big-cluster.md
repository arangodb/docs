 guten morgen willi.
hier ist der plan. einfach mal schweinereien machen.
- einzelne instanzen der coordinatoren abschießen und schauen, wie sie wieder erreichbar werden. (das sollte nichts aufregendes ergeben)
  - C11 coordinator neustart dauert etwa eine minuten
  -  C11 11:14:48 dbserver shutdown dauert die agency waechst im RAM waerenddessen 

```
2020-10-08T09:14:48Z [6712] INFO [b4133] control-c received, beginning shut down sequence
2020-10-08T09:14:48Z [6712] DEBUG [76bb8] {cluster} Agency callback (/arango/Current/Version, 10364233174282478671) has been triggered. refetching!
2020-10-08T09:14:48Z [6712] DEBUG [cc768] {cluster} Unregistering callback for /arango/Current/Version
2020-10-08T09:14:48Z [6712] WARNING [359bc] {replication} truncateLocal: could not drop follower PRMR-e499f6e3-28f1-4ed8-9954-9821c10aab80 for shard s8936683: shutdown in progress
2020-10-08T09:14:48Z [6712] DEBUG [cc768] {cluster} Unregistering callback for /arango/Plan/Version
2020-10-08T09:14:48Z [6712] WARNING [11928] caught exception in RestCollectionHandler: a follower could not be dropped in agency
2020-10-08T09:14:48Z [6712] DEBUG [8f555] {requests} "http-request-end","0x7f6a67a06a10","::ffff:127.0.0.1","PUT","500",116.050841
2020-10-08T09:14:48Z [6712] TRACE [595fd] {requests} Connection closed by peer, with ptr 0x7f6a67a06a10
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a06a10
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a40490
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a04a90
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a3d010
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a3f310
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67af7f90
2020-10-08T09:14:48Z [6712] DEBUG [395fe] {requests} Error while reading from socket: 'Operation canceled'
2020-10-08T09:14:48Z [6712] DEBUG [395fe] {requests} Error while reading from socket: 'Operation canceled'
2020-10-08T09:14:48Z [6712] TRACE [595fd] {requests} Connection closed by peer, with ptr 0x7f6a67a04a90
2020-10-08T09:14:48Z [6712] TRACE [595fd] {requests} Connection closed by peer, with ptr 0x7f6a67a3d010
2020-10-08T09:14:48Z [6712] DEBUG [395fe] {requests} Error while reading from socket: 'Operation canceled'
2020-10-08T09:14:48Z [6712] DEBUG [395fe] {requests} Error while reading from socket: 'Operation canceled'
2020-10-08T09:14:48Z [6712] WARNING [2b6b3] {requests} asio IO error: 'Operation canceled'
2020-10-08T09:14:48Z [6712] WARNING [2b6b3] {requests} asio IO error: 'Operation canceled'
2020-10-08T09:14:48Z [6712] TRACE [595fd] {requests} Connection closed by peer, with ptr 0x7f6a67af7f90
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a04a90
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a3d010
2020-10-08T09:14:48Z [6712] WARNING [2b6b3] {requests} asio IO error: 'Operation canceled'
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67af7f90
2020-10-08T09:14:48Z [6712] TRACE [595fd] {requests} Connection closed by peer, with ptr 0x7f6a67a3f310
2020-10-08T09:14:48Z [6712] WARNING [2b6b3] {requests} asio IO error: 'Operation canceled'
2020-10-08T09:14:48Z [6712] TRACE [090d8] {requests} unregistering CommTask with ptr 0x7f6a67a3f310
2020-10-08T09:14:48Z [6712] DEBUG [bd5f1] {cluster} changing state of PRIMARY server from SERVING to SHUTDOWN
2020-10-08T09:14:51Z [6712] INFO [1776b] {cluster} unable to unregister server from agency, because agency is in shutdown
```
```
2020-10-08T09:22:58Z [6556] WARNING [2c712] {agency} Got bad callback from AppendEntriesRPC: comm_status(Request timeout), last(0), follower(AGNT-16c3ace3-2c5a-4fe7-a523-6419f7584366), time(9.00076)
```
Nach 10 minuten erfolglosem shutdown versucht kill -9 11:24 
```
2020-10-08T09:26:03Z [13584] WARNING [ecdbb] {engines} recalculating index estimate for index type 'edge' with id '2'
2020-10-08T09:26:48Z [13584] WARNING [77655] {heartbeat} ATTENTION: Sending a heartbeat took longer than 2 seconds, this might be causing trouble with health checks. Please contact ArangoDB Support.
```
11:27:25 - 'db-servers' im ui zaehlt wieder 3
UI ist traege beim aufbauen der info, reagiert auf clicks im menue erst deutlich spaeter (bricht dashboard requests nicht ab)
nodes tab braucht sehr lange zum laden, collections tab bleibt lange sichtbar
UI sagt: error 500 agency communication failed 11:30

im UI sagt es:
Server statistics (PRMR-d12e454f-2f78-4202-bf2a-3954c0f719a4) are disabled.
load auf den maschinen bleibt sehr hoch. 
11:33 - die db-server beruhigen sich, alles scheint wieder in sync
click auf `nodes` dauert etwa 40s
es stehen immer noch `shards` auf gelb, das UI flipt kurz zurueck auf 'overview'

z.b.:
```
Shard      Leader m      Followers                Sync
s24077333 DBServer0001 DBServer0002, DBServer0003 n/A
```
cpu auf den anderen DB-Servern geht wieder hoch


- einzelne db server ab schießen und schauen, wie alles läuft.
- die beiden oberen actions sind wahrscheinlich komplett harmlos, das der starter die biester sofort zurück bringt.

dann kommen die schweinereien das sollte schon richtig unheil anrichtien.

- db server / mit kill -STOP und kill -CONT mal für eine - fünf minuten am arbeiten hindern.
- coordinatoren  mit kill -STOP und kill -CONT mal für eine - fünf minuten am arbeiten hindern.

- dann die starter killen

- db server richtig killen und wieder bringen
- coord richtig killen und wieder bringen



so alles etwas dokumentieren, wenn du fehler entdeckst "ALARM HIER!" schreien


vielleicht lässt du die db server mit "cluster" / "maintenance" in debug laufen. die agenten mit "supervision" in debug.
das musst du dann jedes mal neu setzen, wenn du eine instanz neu startest.
for machine in c11 c12 c13; do
    for port in 8531 8528 8529 8530; do
      curl -X POST "${machine}:${port}/_admin/log/level" -d '{"agency":"info", "supervision": "debug", "requests":"trace", "cluster":"debug", "maintainance":"debug"}'
    done
done
                                     

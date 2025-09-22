import { bootstrap } from '@libp2p/bootstrap';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { identify } from '@libp2p/identify';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import * as filters from '@libp2p/websockets/filters'
import { preSharedKey } from '@libp2p/pnet';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { kadDHT } from '@libp2p/kad-dht';
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { autoNAT } from '@libp2p/autonat';
import { dcutr } from '@libp2p/dcutr';
import { ping } from '@libp2p/ping'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
const swarm = `/key/swarm/psk/1.0.0/
/base16/
8463a7707bad09f63538d273aa769cbdd732e43b07f207d88faa323566168ad3`;

export const config = {
    peerDiscovery: [
      bootstrap({
        list: [
          '/dns4/node.cyberfly.io/tcp/31002/ws/p2p/12D3KooWA8mwP9wGUc65abVDMuYccaAMAkXhKUqpwKUZSN5McDrw',
        ],
      }),
     pubsubPeerDiscovery({
      interval: 10000,
      topics: ["cyberfly._peer-discovery._p2p._pubsub"],
      listenOnly: false,
    })
    ],
    connectionProtector: preSharedKey({
        psk: uint8ArrayFromString(swarm),
      }),
    addresses: {
      listen: [
        '/webrtc',
      ],
    },
    transports: [
      webSockets({
        filter: filters.all,
      }),
      webRTC(),
      circuitRelayTransport(),
    ],
    connectionEncrypters: [noise()],
    connectionGater: {
      denyDialMultiaddr: () => {
        return false
      }
    },
    streamMuxers: [yamux()],
    services: {
      autoNAT: autoNAT(),
      dcutr: dcutr(),
      pubsub: gossipsub({
        emitSelf: false,
        allowPublishToZeroTopicPeers: true,
  globalSignaturePolicy: 'StrictSign',
        heartbeatInterval: 1000
      }),
      identify: identify(),
      ping: ping(),
      dht: kadDHT({
        clientMode: true,
      })
    },
  };

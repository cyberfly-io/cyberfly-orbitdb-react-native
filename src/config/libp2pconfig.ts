import { bootstrap } from '@libp2p/bootstrap';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { identify } from '@libp2p/identify';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { all } from '@libp2p/websockets/filters';
import { preSharedKey } from '@libp2p/pnet';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { kadDHT } from '@libp2p/kad-dht';
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { autoNAT } from '@libp2p/autonat';
import { dcutr } from '@libp2p/dcutr';
const swarm = `/key/swarm/psk/1.0.0/
/base16/
8463a7707bad09f63538d273aa769cbdd732e43b07f207d88faa323566168ad3`;

export const config = {
    peerDiscovery: [
        pubsubPeerDiscovery({
            interval: 10000,
            topics: ['cyberfly._peer-discovery._p2p._pubsub'],
            listenOnly: false,
          }),
      bootstrap({
        list: [
          '/ip4/15.235.211.45/tcp/31002/ws/p2p/12D3KooWA8mwP9wGUc65abVDMuYccaAMAkXhKUqpwKUZSN5McDrw',
          '/ip4/139.99.91.128/tcp/31002/ws/p2p/12D3KooWSfGgUaeogSZuRPa4mhsAU41qJH5EpmwKg9wGVzUwFGth'
        ],
      }),
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
        filter: all,
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
        allowPublishToZeroTopicPeers: true,
        scoreThresholds: {
          gossipThreshold: -Infinity,
          publishThreshold: -Infinity,
          graylistThreshold: -Infinity,
        }, }),
      identify: identify(),
      dht: kadDHT({
        clientMode: true,
      })
    },
  };

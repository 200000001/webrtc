import { networkInterfaces, cpus } from 'os'
const ifaces = networkInterfaces()

const getLocalIp = () => {
  let localIp = '127.0.0.1'
  Object.keys(ifaces).forEach((ifname) => {
    for (const iface of ifaces[ifname]) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        continue
      }
      localIp = iface.address
      return
    }
  })
  return localIp
}

export const listenIp = '0.0.0.0'
export const listenPort = 3010
export const sslCrt = './ssl/cert.pem'
export const sslKey = './ssl/key.pem'
export const mediasoup = {
    // Worker settings
    numWorkers: Object.keys(cpus()).length,
    worker: {
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: 'warn',
        logTags: [
            'info',
            'ice',
            'dtls',
            'rtp',
            'srtp',
            'rtcp'
        ]
    },
    // Router setting
    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000
                }
            }
        ]
    },
    // WebRtcTransport setting
    webRtcTransport: {
        listenIps: [
            {
                ip: '0.0.0.0',
                announcedIp: getLocalIp()
            }
        ],
        maxIncomingBitrate: 1500000,
        initialAvailableOutgoingBitrate: 1000000
    }
}

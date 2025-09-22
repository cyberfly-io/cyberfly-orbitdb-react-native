import Pact from 'pact-lang-api';
import { toSortJson } from './utils';
const type = 'cyberfly'

const CyberflyAccessController = () => async ({ orbitdb, identities, address }) => {
  address = '/cyberfly/access-controller'
return  {
    address,
    canAppend : async (entry:any, identityProvider:any) =>  {
      //subscription verification should be done here
        const db = await orbitdb.open(entry.id);
        const sig = entry.payload.value.sig;
        const data = entry.payload.value.data;
        const sortedJsondata = toSortJson(data)
        const pubkey = db.name.split('-').at(-1)
        const verify = Pact.crypto.verifySignature(JSON.stringify(sortedJsondata), sig, pubkey);
     return verify
    }
}
}

CyberflyAccessController.type = type

export default CyberflyAccessController
import CyberflyAccessController from './cyberfly-access-controller'
import ManifestStore from '@orbitdb/core/src/manifest-store.js'

export const toSortJson = (data:any)=>{
    const sortedJsondata = Object.keys(data)
    .sort() // Sort the keys
    .reduce((obj, key) => {
        obj[key] = data[key]; // Build a new sorted object
        return obj;
    }, {});
    return sortedJsondata
  }

  export const getAddress = async (orbitdb:any, name:any) => {
    const manifestStore = await ManifestStore({ ipfs:orbitdb.ipfs })

    const db = await manifestStore.create({name, type: 'documents', accessController:'/cyberfly/access-controller' });
    return db.hash
  }
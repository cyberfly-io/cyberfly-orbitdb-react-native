import '../globals.js';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useAccessController } from '@orbitdb/core'
import { startOrbitDB } from './db-services';
import { getAddress } from './utils';
import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core'
import LevelStorage from './level-storage'

import CyberflyAccessController from './cyberfly-access-controller'

export default function App() {
  const [orbitdb, setOrbitDB] = useState(null)

  useAccessController(CyberflyAccessController)

 useEffect(()=>{ 

    async function getorbitdb(){
      const orbitdb = await startOrbitDB()
      setOrbitDB(orbitdb)
    }
    getorbitdb()

 },[])


  useEffect(()=>{
    if(orbitdb){
async function addData(){

    try{
      const dbname = 'testnewdb1235-94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8'
      const addr = await getAddress(orbitdb, dbname)
      const headsStorage = await ComposedStorage(await LRUStorage({ size: 1000 }), await LevelStorage({ path: `heads_${addr}` }))
      const indexStorage = await ComposedStorage(await LRUStorage({ size: 1000 }), await LevelStorage({ path: `index_${addr}` }))
      const entryStorage = await ComposedStorage(
        await LRUStorage({ size: 1000 }),
        await IPFSBlockStorage({ ipfs:orbitdb.ipfs, pin: true })
      )
    const db = await orbitdb.open('testnewdb1235-94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8', {type:'documents',AccessController:CyberflyAccessController(), indexStorage, headsStorage, entryStorage})
    // Add some records to the db.
    await db.put({_id:Math.random(), publicKey:"94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8", 
      sig:"df0dc7a643e696848ecbc45b9aeabf285c0be98c2ab91a6d0e54d1aaa65040211babf27fab8bb86a35cafbadf0b0acbb4952a9e9e99c1ff65092f97265983800",
    data:{
      latitude: -78.395184,
      longitude: 149.927618,
      member: 'chai kings',
      locationLabel: 'Coffee shop',
      streamName: 'mystream'
    }})
    // Print out the above records.
    console.log(await db.all())
  }
  catch(e){
    console.log(e)
  }

}
addData()
    }
    
  },[orbitdb])

  return (
    <SafeAreaView>

      <Text>Libp2p Node: {orbitdb ? orbitdb.ipfs.libp2p.peerId.toString() : 'Loading...'}</Text>
    </SafeAreaView>    );
}
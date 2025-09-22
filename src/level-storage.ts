
import { SKReactNativeLevel } from 'react-native-leveldb-level-adapter';


const LevelStorage =  async({ path } = {}) => {
  const name = path.replaceAll('/','_')


   const db = new  SKReactNativeLevel(name, {valueEncoding:'buffer'});
   await db.open()


  const put =  async(hash:string, value:any) => {
    await db.put(hash, value)
  }

  /**
   * Deletes data from Level.
   * @function
   * @param {string} hash The hash of the data to delete.
   * @param {*} data The data to store.
   * @memberof module:Storage.Storage-Level
   * @instance
   */
  const del = async(hash:string) => {
  };
  /**
   * Gets data from Level.
   * @function
   * @param {string} hash The hash of the data to get.
   * @memberof module:Storage.Storage-Level
   * @instance
   */
  const get =  async(hash:string) => {
   

    try {
      const value = await db.get(hash)
      if (value) {
        return value['data']
      }
    } catch (e) {
      // LEVEL_NOT_FOUND (ie. key not found)
    }
  }

  /**
   * Iterates over records stored in Level.
   * @function
   * @yields [string, string] The next key/value pair from Level.
   * @memberof module:Storage.Storage-Level
   * @instance
   */
  const iterator = async  function * ({ amount, reverse } = {}) {
    for await(const [key, value] of db.iterator()) {
      yield [key, value]
    }
  }
  const merge =  (other) => {}

  /**
  * Clears the contents of the Level db.
  * @function
  * @memberof module:Storage.Storage-Level
  * @instance
  */
  const clear = async () => {}

  /**
  * Closes the Level db.
  * @function
  * @memberof module:Storage.Storage-Level
  * @instance
  */
  const close =  () => {
     db.close()
  }

  return {
    put,
    del,
    get,
    iterator,
    merge,
    clear,
    close
  }
}

export default LevelStorage
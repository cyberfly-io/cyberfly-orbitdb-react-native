
import { SKReactNativeLevel } from 'react-native-leveldb-level-adapter';

const LevelStorage = async ({ path }: { path?: string } = {}) => {
  const name = (path ?? 'orbitdb').replaceAll('/', '_');
  const db = new SKReactNativeLevel(name, { valueEncoding: 'buffer' });
  await db.open();

  const put = async (hash: string, data: any) => {
    await db.put(hash, data);
  };

  const del = async (hash: string) => {
    await db.del(hash);
  };

  const get = async (hash: string) => {
    try {
      return await db.get(hash);
    } catch (err: any) {
      if (err.code === 'LEVEL_NOT_FOUND' || err.notFound) {
        return undefined;
      }
      throw err;
    }
  };

  const iterator = async function* ({ gte, gt, lte, lt, reverse = false, limit }: { gte?: string, gt?: string, lte?: string, lt?: string, reverse?: boolean, limit?: number } = {}) {
    const opts = { gte, gt, lte, lt, reverse, limit };
    for await (const [key, value] of db.iterator(opts)) {
      yield [key, value];
    }
  };

  const merge = (_other: any) => {};

  const clear = async () => {
    await db.clear();
  };

  const close = async () => {
    await db.close();
  };

  return {
    put,
    del,
    get,
    iterator,
    merge,
    clear,
    close,
  };
};

export default LevelStorage;

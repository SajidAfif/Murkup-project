import { MongoMemoryServer } from 'mongodb-memory-server';
declare let mongod: MongoMemoryServer | null;
declare const connectDB: () => Promise<void>;
export { mongod };
export default connectDB;
//# sourceMappingURL=database.d.ts.map
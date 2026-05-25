import { Response, NextFunction } from 'express';
import { CustomRequest } from './errorHandler.js';
export declare const adminOnly: (req: CustomRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default adminOnly;
//# sourceMappingURL=admin.d.ts.map
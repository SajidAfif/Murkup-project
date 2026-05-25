import { Response, NextFunction } from 'express';
import { CustomRequest } from './errorHandler.js';
export declare const auth: (req: CustomRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map
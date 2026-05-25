import { Response, NextFunction, Request } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: any;
        }
    }
}
export type CustomRequest = Request;
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
//# sourceMappingURL=errorHandler.d.ts.map
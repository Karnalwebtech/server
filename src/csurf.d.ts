declare module 'csurf' {
    import { RequestHandler } from 'express';

    interface CookieOptions {
        key?: string;
        path?: string;
        signed?: boolean;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: boolean | 'lax' | 'strict' | 'none';
        maxAge?: number | undefined;
    }

    interface CSRFOptions {
        cookie?: boolean | CookieOptions;
        value?: (req: Express.Request) => string;
        ignoreMethods?: string[];
    }

    function csurf(options?: CSRFOptions): RequestHandler;

    export = csurf;
}

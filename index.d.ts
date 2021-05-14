export interface PostCssPropertyLookupOptions {
    /**
     * When a lookup cannot be resolved, this specifies whether to throw an
     * error or log a warning. In the case of a warning, the invalid lookup
     * value will be replaced with an empty string.
     */
     logLevel?: string;
}

export = PostCssPropertyLookup;
declare function PostCssPropertyLookup(options: PostCssPropertyLookupOptions): { postcssPlugin: string; };
declare function PostCssPropertyLookup(): { postcssPlugin: string; };

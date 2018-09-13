/**
 * Represents a simple http service, which returns a promise.
 *
 * @module http
 * @author Sebastian Fitzner
 */

// Imports
import Base from '@veams/base';

export interface RequestObject {
    method?: string;
    url?: string;
    type?: string;
    data?: string;
}

export interface ServiceOptions {
    url?: string,
    type?: string,
    method?: string,
    fetchOnInit?: boolean,
    headers?: object
}

export interface Parser {
    type: string,
    request: Request
}

export interface Request {
    responseText: string;
    status: number;
    statusText: string;
}

class HttpService extends Base {
    data: any;
    options: ServiceOptions;

    constructor(options: ServiceOptions = {}) {
        let namespace = '@veams/http-service';
        let defaultOptions = {
            url: null,
            type: 'text',
            method: 'GET',
            fetchOnInit: false,
            headers: null
        };

        super({namespace, options}, defaultOptions);

        this.data = {};
        this.initialize();
    };

    initialize() {
        if (!window['Promise']) {
            console.error('@veams/http-service :: You should add a lightweight promise library like promise-polyfill!');
        }

        if (this.options.fetchOnInit) {
            return this.promiseRequest();
        }
    };

    // Request lifecycle
    requestWillOpen(request: XMLHttpRequest, obj) {
    }

    requestDidOpen(request: XMLHttpRequest, obj) {
        if (this.options.headers) {
            for (let header in this.options.headers) {
                if (this.options.headers.hasOwnProperty(header)) {
                    request.setRequestHeader(header, this.options.headers[header]);
                }
            }
        }
    }

    requestWillLoad(request: XMLHttpRequest, obj) {
    }

    requestDidLoad(request: XMLHttpRequest, obj) {
    }

    requestWillSend(request: XMLHttpRequest, obj) {
    }

    requestDidSend(request: XMLHttpRequest, obj) {
    }

    // Request function
    promiseRequest(obj?: RequestObject) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            let data = obj.type === 'json' ? JSON.stringify(obj.data) : obj.data;

            this.requestWillOpen(request, obj);
            request.open(obj.method, obj.url, true);
            this.requestDidOpen(request, obj);

            this.requestWillLoad(request, obj);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    resolve(this.parser({
                        request: request,
                        type: obj.type
                    }));

                    this.requestDidLoad(request, obj);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });

                    this.requestDidLoad(request, obj);
                }
            };

            request.onerror = function () {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };

            this.requestWillSend(request, obj);

            request.send(data);
            this.requestDidSend(request, obj);
        });
    };

    get(url = null) {
        let requestObject: RequestObject = {};

        this.options.method = requestObject.method = 'GET';
        this.options.url = requestObject.url = url || this.options.url;
        this.options.type = requestObject.type = this.options.type;

        return this.promiseRequest(requestObject);
    };

    delete(url = null) {
        let requestObject: RequestObject = {};

        requestObject.method = 'DELETE';
        requestObject.url = url || this.options.url;
        // requestObject.type = this.options.type;

        return this.promiseRequest(requestObject);
    }

    post(url = null, data) {
        let requestObject: RequestObject = {};

        requestObject.data = data ? data : null;
        requestObject.method = 'POST';
        requestObject.url = url || this.options.url;
        requestObject.type = this.options.type;

        if (this.options.type === 'json' && this.options.headers === null) {
            this.options.headers = {
                'content-type': 'application/json'
            };
        }

        return this.promiseRequest(requestObject);
    }

    put(url = null, data) {
        let requestObject: RequestObject = {};

        requestObject.data = data ? data : null;
        requestObject.method = 'PUT';
        requestObject.url = url || this.options.url;
        requestObject.type = this.options.type;

        if (this.options.type === 'json' && this.options.headers === null) {
            this.options.headers = {
                'content-type': 'application/json'
            };
        }

        return this.promiseRequest(requestObject);
    }

    /**
     * The default parser, which returns the response text.
     * This method can be overridden.
     *
     * @param {Object} obj - Generic object.
     * @param {Object} obj.request - Request object.
     * @param {String} obj.type - Define a type for the response text.
     * @param {Object} obj.data - Data object.
     */
    parser(obj: Parser): object {
        this.data = obj.request.responseText;

        if (obj.type === 'json') {
            this.data = JSON.parse(this.data);
        }

        return this.data;
    }
}

export default HttpService;
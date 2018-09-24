[//]: # ({{#wrapWith "content-section"}})

[//]: #     ({{#wrapWith "grid-row"}})
[//]: #         ({{#wrapWith "grid-col" colClasses="is-col-tablet-l-8"}})

# HTTP Service (`@veams/http-service`)

Simple http service provided for and by `VEAMS`. 

---------------

## Installation

Install the package: 

### NPM

```bash
npm install @veams/http-service --save 
```

### Yarn

```bash
yarn add @veams/http-service 
```

---------------

## Usage

You can simple use the http service and modify it for your needs.

### Lifecycle Hooks

You can intercept into the request by using the following methods: 

- `requestWillOpen(request: XMLHttpRequest, obj: any): void;`
- `requestDidOpen(request: XMLHttpRequest, obj: any): void;`
- `requestWillLoad(request: XMLHttpRequest, obj: any): void;`
- `requestDidLoad(request: XMLHttpRequest, obj: any): void;`
- `requestWillSend(request: XMLHttpRequest, obj: any): void;`
- `requestDidSend(request: XMLHttpRequest, obj: any): void;`

As you can see, each method gets the request object which you can modify like you wish.

### Methods

You can execute the typical `CRUD` methods: 
- `get(url?: any): Promise<{}>;`
- `delete(url?: any): Promise<{}>;`
- `post(url: any, data: any): Promise<{}>;`
- `put(url: any, data: any): Promise<{}>;`

Each method returns a Promise. Be sure you have a polyfill included!

### Parser

The default parser returns the `responseText` as string or object. This is dependent on the type you have defined. 

You can easily override the parser by taking a look at the example. 

---------------

## Example

```js 
import HttpService from '@veams/http-service';

let httpService = new HttpService({
	type: 'json'
});

/** 
 * Override the default parser,
 * in which we want to return more than the responseText
 */
httpService.parser = ({ request }) => {
	return {
		status: request.status,
		statusText: request.statusText,
		body: JSON.parse(request.responseText)
	};
};

class MyPagesService {
	url = 'http://localhost:3000/api/pages';
	http = httpService;

	/**
	 * Static id checker.
	 *
	 * @param {String} id - Id of the endpoint.
	 */
	static checkId(id) {
		if (!id || typeof id !== 'string') {
			throw new Error(`PagesService :: You have to provide an "id" and this "id" needs to be a string!`);
		}
	}

	/**
	 * Fetch data items from the endpoint.
	 */
	read() {
		return this.http.get(`${this.url}`);
	}

	/**
	 * Fetch data item by provided id from the endpoint.
	 *
	 * @param {String} id - Id of the endpoint.
	 */
	readById(id) {
		this.constructor.checkId(id);

		return this.http.get(`${this.url}/${id}`);
	}
}

const myPagesService = new MyPagesService();

export default myPagesService;
```

That's it!

[//]: #         ({{/wrapWith}})
[//]: #     ({{/wrapWith}})

[//]: # ({{/wrapWith}})
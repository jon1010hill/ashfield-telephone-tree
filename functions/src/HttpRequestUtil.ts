import * as querystring from 'querystring'
import * as express from 'express'
import {API_DATA} from './types'

export interface UrlBuilder {
  getNextActionUrl(thisDialedNumber?: string): string
}
export class HttpRequestUtil implements UrlBuilder {
  private readonly req: express.Request
  constructor(req: express.Request) {
    this.req = req
  }
  parseQueryStringToArray() {
    const numbersTriedStr = this.req.query.numbersTried
      ? `${this.req.query.numbersTried}`
      : ''
    const numbers = numbersTriedStr.split(',').filter(i => i)
    return numbers
  }

  getCurrentUrl() {
    if (this.req.host === 'localhost' || this.req.host.endsWith('ngrok.io')) {
      return (
        // tslint:disable-next-line: prefer-template
        this.req.protocol + '://' + this.req.get('host') + this.req.originalUrl
      )
    }

    return API_DATA.baseUri + this.req.originalUrl
  }

  getCallScreenUrl() {
    if (this.req.host === 'localhost') {
      // tslint:disable-next-line: prefer-template
      return this.req.protocol + '://' + this.req.get('host') + '/voice/screen'
    }
    // tslint:disable-next-line: prefer-template
    return API_DATA.baseUri + '/voice/screen'
  }

  getFirebaseFunctionCurrentUrl() {
    return (
      // tslint:disable-next-line: prefer-template
      this.req.protocol +
      '://' +
      process.env.FUNCTION_REGION +
      '-' +
      this.req.originalUrl
    )
  }

  getQueryStringFromArray(numbers: string[]) {
    return querystring.escape(numbers.join(','))
  }

  getNextActionUrl(thisDialedNumber?: string): string {
    const currentUrl = this.getCurrentUrl()
    if (currentUrl.indexOf('numbersTried=') !== -1) {
      return (
        currentUrl +
        (undefined !== thisDialedNumber
          ? querystring.escape(',') +
            this.getQueryStringFromArray([thisDialedNumber!])
          : '')
      )
    }
    // tslint:disable-next-line: prefer-template
    return (
      // tslint:disable-next-line: prefer-template
      currentUrl +
      this.getQueryStringFromArray(this.parseQueryStringToArray()) +
      '?numbersTried=' +
      (undefined !== thisDialedNumber
        ? this.getQueryStringFromArray([thisDialedNumber!])
        : '')
    )
  }
}

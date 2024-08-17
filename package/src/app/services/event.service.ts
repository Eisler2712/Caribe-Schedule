import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEventUrl = "http://127.0.0.1:8000/events/";


  constructor(public httpClient: HttpClient) {
  }

  private getHeader(body?: any): HttpHeaders {

    let headers = new HttpHeaders({
      'Accept-Language': 'es-ES',
      'X-K-App': '15'
    });

    if (body) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private getResponse(method: string, url: string, body: any): Observable<any> {
    const options =
      {
        headers: this.getHeader(body),
        body: body
      };
    return this.httpClient.request(method, url, options)
      .pipe(
        tap((resp: any) => {
          return resp;
        }),
        catchError((err) => {
          return of(err)
        })
      );
  }

  public createEvent(body: any) {
    const url = this.baseEventUrl;
    return this.getResponse('POST', url, body);
  }

  public getEvents() {
    const url = this.baseEventUrl;
    return this.getResponse('GET', url, null);
  }

  public getEvent(id: string) {
    const url = this.baseEventUrl + id;
    return this.getResponse('GET', url, null);
  }

  public updateEvent(body: any, id: string) {
    const url = this.baseEventUrl + id;
    return this.getResponse('PUT', url, body);
  }

  public deleteEvent(id: string) {
    const url = this.baseEventUrl + id;
    return this.getResponse('DELETE', url, null);
  }
}

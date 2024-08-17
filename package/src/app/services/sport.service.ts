import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SportService {

  private baseSportUrl = "http://127.0.0.1:8000/sports/";


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

  public createSport(body: any) {
    const url = this.baseSportUrl;
    return this.getResponse('POST', url, body);
  }

  public getSports() {
    const url = this.baseSportUrl;
    return this.getResponse('GET', url, null);
  }

  public getSport(id: string) {
    const url = this.baseSportUrl + id;
    return this.getResponse('GET', url, null);
  }

  public updateSport(body: any, id: string) {
    const url = this.baseSportUrl + id;
    return this.getResponse('PUT', url, body);
  }

  public deleteSport(id: string) {
    const url = this.baseSportUrl + id;
    return this.getResponse('DELETE', url, null);
  }
}

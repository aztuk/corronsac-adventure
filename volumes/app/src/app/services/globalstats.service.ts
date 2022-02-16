import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalstatsService {

  public apiUrl = 'https://api.globalstats.io';
  public accessToken;
  public gtd = 'highs';

  constructor(private http: HttpClient) {
    this.getAccessToken();
   }


  getAccessToken() {
    const headers = new HttpHeaders({
      //'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = 'grant_type=client_credentials&scope=endpoint_client&client_id=Z49NOgXFA61fCo3mIGKN24aGjVahAebAjln8BlNc&client_secret=Pr4evqWbaKefVUyQ5Qqk21DnoLZKzbbpDfD8GAjQ';

    return this.http.post(this.apiUrl + '/oauth/access_token', body, {headers}).subscribe({
      next: (data:any) => {
        this.accessToken = 'Bearer '+ data.access_token;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getScore():any {
    const headers = new HttpHeaders({
      //'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': this.accessToken
    });

    const body = {
      "limit": 10
    }

    return this.http.post(this.apiUrl + '/v1/gtdleaderboard/' + this.gtd, body, {headers}).toPromise();
  }

  saveScore(username, highscore) {
    const headers = new HttpHeaders({
      //'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': this.accessToken
    });

    let score:any = {
      name:'',
      values: {}
    };
    score.name = username;
    score.values[this.gtd] = highscore;

    return this.http.post(this.apiUrl + '/v1/statistics', score, {headers}).toPromise();
  }
}

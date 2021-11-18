import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGIFResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'Y1vdYrvijX7iEOTD0FutVJUnOxwvtlBJ';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];//rompemos la referencia
  }

  constructor (private http: HttpClient) {

    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || []
    // if ( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }

  buscarGifs( query: string = '' ) {

    query = query.trim().toLowerCase();

    if( !this._historial.includes( query ) ){ //si existe o lo incluye
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10); //aca se corta el arreglo de busqueda para que solo salgan 10

      localStorage.setItem('historial', JSON.stringify(this._historial) );
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGIFResponse>(`${ this.servicioUrl }/search`, { params })
        .subscribe( ( resp ) => {
          // console.log( resp.data );
          this.resultados = resp.data;
          localStorage.setItem('resultados', JSON.stringify( this.resultados ) )
        })


  }
}

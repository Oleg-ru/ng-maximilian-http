import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private BASE_URL = 'http://localhost:3000'
  private httpClient = inject(HttpClient);

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('/places', 'Ops.. Error. Please try again later.');
  }

  loadUserPlaces() {
      return this.fetchPlaces('/user-places', 'Ops.. Error in get your favorite places. Please try again later.')
          .pipe(tap({
              next: (userPlaces) => this.userPlaces.set(userPlaces),
          }))
  }

  addPlaceToUserPlaces(place: Place) {
      return this.httpClient.put(`${this.BASE_URL}/user-places`, {
          placeId: place.id
      })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(`${this.BASE_URL}${url}`)
        .pipe(
            map(response => response.places),
            catchError((error) => {
              console.log(error);
              return  throwError(() => new Error(errorMessage))
            })
        )
  }
}

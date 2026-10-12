import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { Trip } from '../models/trip';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

    constructor(private http: HttpClient) {}

    getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>('http://localhost:3000/api/trips');
    }

    addTrip(formData: Trip) : Observable<Trip> {
        return this.http.post<Trip>('http://localhost:3000/api/trips', formData);
    }

    getTrip(tripCode: string): Observable<Trip[]> {
        return this.http.get<Trip[]>(`http://localhost:3000/api/trips/${tripCode}`);
    }

    updateTrip(formData: Trip): Observable<Trip> {
        return this.http.put<Trip>(`http://localhost:3000/api/trips/${formData.code}`, formData);
    }
}

import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Trip } from '../models/trip';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

    constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
    ) {}

    baseUrl = 'http://localhost:3000/api';

    // Call to our /login endpoint, returns JWT
    login(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user, passwd);
    }

    // Call to our /register endpoint, creates user and returns JWT
    register(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
    }
    
    // helper method to process both login and register methods
    handleAuthAPICall(endpoint: string, user: User, passwd: string) :
    Observable<AuthResponse> {
    // console.log('Inside TripDataService::handleAuthAPICall');
    let formData = {
    name: user.name,
    email: user.email,
    password: passwd
    };
    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint,
    formData);
    }

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

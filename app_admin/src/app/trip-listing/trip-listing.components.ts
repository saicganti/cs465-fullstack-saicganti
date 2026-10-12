import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trips } from '../data/trips.data';
import { TripCardComponent } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-trip-listing',
standalone: true,
imports: [CommonModule, TripCardComponent],
templateUrl: './trip-listing.html',
styleUrls: ['./trip-listing.css'],
providers: [TripDataService]
})

export class TripListingComponent implements OnInit {

trips = signal<Trip[]>([]);
message: string = '';

constructor(
    private TripDataService: TripDataService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
    ) {
    console.log('trip-listing constructor');
    }

public addTrip(): void {
    this.router.navigate(['/add-trip']);
}

private getStuff(): void {
    this.TripDataService.getTrips().subscribe({
        next: (value: any) => {
            this.trips.set(value);
            this.changeDetector.detectChanges();
            if(value.length > 0) {
                this.message = 'There are' + value.length + ' trips available';
            }
            else {
                this.message = 'There were no trips retrieved';
            }
            console.log(this.message);
        },
        error: (err: any) => {
            console.error('Error retrieving trips:', err);
        }
    });
}

ngOnInit(): void {
    console.log('ngOnInit')
    this.getStuff();
}
}

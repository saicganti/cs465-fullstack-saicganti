import { Routes } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing.components';
import { AddTripComponent } from './add-trip/add-trip.component';
import { EditTrip } from './edit-trip/edit-trip.component';

export const routes: Routes = [
    { path: '', component: TripListingComponent },
    { path: 'add-trip', component: AddTripComponent },
    { path: 'edit-trip', component: EditTrip }
];

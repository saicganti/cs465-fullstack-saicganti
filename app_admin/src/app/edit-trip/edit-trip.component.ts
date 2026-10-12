import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-edit-trip',
  standalone: true,
  styleUrl: './edit-trip.component.css',
  templateUrl: './edit-trip.component.html',
})


export class EditTrip implements OnInit {
  submitted = false;
  saveError = '';
  public editForm! : FormGroup;
  trip!: Trip;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
  

    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      this.saveError = 'Something wrong, couldnt find where I stashed tripCode';
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value:any) => {
        this.trip = value;
        this.editForm.patchValue(value[0]);

        if (!value) {
          this.saveError = 'No trip found';
        }
        else {
          this.saveError = 'Trip: ' + tripCode + ' retrieved';
        }
        console.log(this.saveError);
      },
      error: (error: any) => {
        console.log("Error: " + error);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.saveError = '';
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
      .subscribe({
        next: (value:any)=> {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log("Error: " + error);
        }
      })
    }

    this.tripDataService.updateTrip(this.editForm.value as Trip).subscribe({
      next: () => this.router.navigate(['']),
      error: () => {
        this.saveError = 'Unable to save the trip. Check that the API is running and try again.';
      },
    });
  }

  get f() {
    return this.editForm.controls;
  }
}

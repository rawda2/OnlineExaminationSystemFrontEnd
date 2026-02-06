import { ITrack } from '../../../shared/interfaces/ITrack/ITrack';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  // Holds tracks for selected branch
  tracksByBranch: WritableSignal<ITrack[]> = signal([]);

  constructor(private httpClient: HttpClient) {}

  // =========================
  // Get all tracks (optional)
  // =========================
  getAllTracks(): Observable<ITrack[]> {
    return this.httpClient.get<ITrack[]>(
      `${environment.baseURL}Tracks`
    );
  }

  // =========================
  // Get tracks by branch (MAIN)
  // =========================
  getTracksByBranch(branchId: number): Observable<ITrack[]> {
    return this.httpClient.get<ITrack[]>(
      `${environment.baseURL}Tracks/by-branch/${branchId}`
    );
  }

  // =========================
  // Load tracks into signal
  // =========================
  loadTracksByBranch(branchId: number): void {
    this.getTracksByBranch(branchId).subscribe({
      next: (res) => {
        this.tracksByBranch.set(res);
        console.log('Tracks for branch', branchId, res);
      },
      error: (err) => {
        console.error('Failed to load tracks by branch', err);
        this.tracksByBranch.set([]);
      }
    });
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Team, User } from '../models/types.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;
  private usersUrl = `${environment.apiUrl}/users`;
  myTeams = signal<Team[]>([]);
  allUsers = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  loadTeams() {
    this.isLoading.set(true);
    this.http.get<Team[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.myTeams.set(data);
        this.isLoading.set(false);
      },
      error: (err) => this.isLoading.set(false)
    });
  }
  addTeam(name: string) {
    return this.http.post<Team>(this.apiUrl, { name }).pipe(
      tap((newTeam) => {
        this.myTeams.update(currentTeams => [...currentTeams, newTeam]);
      })
    );
  }
  loadAllUsers() {
    this.http.get<User[]>(this.usersUrl).subscribe({
      next: (users) => this.allUsers.set(users),
      error: (err) => console.error('Error loading users', err)
    });
  }
  addMemberToTeam(teamId: string, userId: number) {
    return this.http.post(`${this.apiUrl}/${teamId}/members`, { userId }).pipe(
      tap(() => {
        this.loadTeams();
      })
    );
  }
}
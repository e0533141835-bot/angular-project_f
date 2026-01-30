import { Component, OnInit, inject, signal } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css'
})
export class TeamList implements OnInit {
  public teamsService = inject(TeamsService);
  private toast = inject(ToastService);
  newTeamNameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  selectedMemberId = new FormControl<number | null>(null, Validators.required);
  isCreateOpen = signal(false);
  addingMemberToTeamId = signal<string | null>(null);
  ngOnInit() {
    this.teamsService.loadTeams();
  }
  toggleCreate() {
    this.isCreateOpen.update(value => !value);
  }
  createNewTeam() {
    if (this.newTeamNameControl.invalid) return;
    const name = this.newTeamNameControl.value!;
    this.teamsService.addTeam(name).subscribe({
      next: () => {
        this.toast.success('הצוות נוצר בהצלחה! 🎉')
        this.newTeamNameControl.reset();
        this.isCreateOpen.set(false);
      },
     error: () => this.toast.error('שגיאה ביצירת הצוות')
    });
  }
  openAddMemberModal(teamId: string) {
    this.addingMemberToTeamId.set(teamId);
    this.selectedMemberId.reset();
    this.teamsService.loadAllUsers();
  }
  closeAddMemberModal() {
    this.addingMemberToTeamId.set(null);
  }
  submitAddMember() {
    const teamId = this.addingMemberToTeamId();
    const userId = this.selectedMemberId.value;
    if (teamId && userId) {
      this.teamsService.addMemberToTeam(teamId, userId).subscribe({
        next: () => {
          this.closeAddMemberModal();
        },
        error: () => alert('שגיאה בהוספת חבר לצוות (אולי הוא כבר שם?)')
      });
    }
  }
}
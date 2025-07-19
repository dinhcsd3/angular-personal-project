import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs, KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'taskly-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private _authenticated: boolean = false;

  keycloakStatus: string | undefined;
  private readonly _keycloak = inject(Keycloak);
  private readonly _keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(private router: Router) {
    effect(() => {
      const keycloakEvent = this._keycloakSignal();

      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this._authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this._authenticated = false;
      }
    });
  }

  public loginWithSSO() {
    this._keycloak.login();
  }
}

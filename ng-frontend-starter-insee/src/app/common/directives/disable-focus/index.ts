import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule
} from '@angular/material';
import { DisableFocusButtonDirective } from './disable-focus-button.direactive';


@NgModule({
  declarations: [
    DisableFocusButtonDirective,
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    DisableFocusButtonDirective,
  ]
})

export class DisableFocusButtonModule {
}

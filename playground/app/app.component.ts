import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { AutocompleteExampleComponent } from './components/autocomplete-example/autocomplete-example.component';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [FsExampleModule, AutocompleteExampleComponent]
})
export class AppComponent {
  public config = environment;
}

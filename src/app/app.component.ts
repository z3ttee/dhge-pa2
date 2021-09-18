import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  goToRepo() {
    window.open("https://github.com/z3ttee/dhge-pa2", "_blank")
  }

}

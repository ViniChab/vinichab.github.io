import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "vini-embedded-content",
  templateUrl: "./embedded-content.component.html",
  styleUrls: ["./embedded-content.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedContentComponent {}
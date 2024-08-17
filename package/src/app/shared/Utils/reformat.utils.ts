import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ReformatUtils {

  public reformatDate(dateStr: string) {
    const dateObj = new Date(dateStr);
    const datePart = dateObj.toISOString().split('T')[0];

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const timePart = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return { date: datePart, time: timePart };
  }
}

import moment from 'moment';
import { monthsReference } from 'src/app/core/constants/constant';
export class AccountabilityData {
  constructor(
    public messageConversationDetails: any,
    public startDate: Date,
    public endDate: Date
  ) {}

  get count(): number {
    return this.messageConversationDetails?.pager?.total;
  }

  get weeks(): any[] {
    const startDate = moment(this.startDate, 'YYYY-MM-DD');
    const endDate = moment(this.startDate, 'YYYY-MM-DD');
    const weeksCount = endDate.diff(startDate, 'weeks');
    let weeks = [];
    for (let count = 0; count < weeksCount; count++) {
      weeks = [
        ...weeks,
        {
          id: count + 1,
          name: 'Week ' + (count + 1),
        },
      ];
    }
    return weeks;
  }
  get months(): any[] {
    const startDate = moment(this.startDate, 'YYYY-MM-DD');
    const endDate = moment(this.startDate, 'YYYY-MM-DD');
    const weeksCount = endDate.diff(startDate, 'months');
    let months = [];
    for (let count = 0; count < weeksCount; count++) {
      months = [
        ...months,
        {
          id: count + 1,
          name: monthsReference[count + 1],
        },
      ];
    }
    return months;
  }

  get messageConversations(): any {
    return this.messageConversationDetails?.messageConversations;
  }

  get pager(): any {
    return this.messageConversationDetails?.pager;
  }

  toJson(): any {
    return {
      count: this.count,
      weeks: this.weeks,
      months: this.months,
      pager: this.pager,
      messageConversations: this.messageConversations,
    };
  }
}

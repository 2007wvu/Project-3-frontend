import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
// import {MatTableDataSource} from '@angular/material/table';
import {Input} from '@angular/core';
import BugReport from '../../models/BugReport';
// import {AdminBugsTableComponent} from './admin-bugs-table.component';
import Solution from '../../models/Solution';
// import {ApiServiceService} from '../../services/api-service.service';

// TODO: Replace this with your own data model type

export interface AdminBugsTableItem {
  app: string[];
  approvedTime: number;
  bId: number;
  createdTime: number;
  description: string;
  location: string;
  pointValue: number;
  priority: string;
  repSteps: string;
  resolvedTime: number;
  severity: string;
  solutions: Solution[];
  status: string;
  title: string;
  username: string;
}


/**
 * Data source for the AdminBugsTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AdminBugsTableDataSource extends DataSource<BugReport> {
  @Input() bugReports: BugReport[];
  data: BugReport[] = this.bugReports;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<BugReport[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }



  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from theng server.
   */
  private getPagedData(data: BugReport[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: BugReport[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'app': return compare(a.app.title, b.app.title, isAsc);
        case 'location': return compare(a.location, b.location, isAsc);
        case 'severity': return compare(a.severity, b.severity, isAsc);
        case 'priority': return compare(a.priority, b.priority, isAsc);
        case 'date': return compare(a.dateCreated, b.dateCreated, isAsc);
        case 'username': return compare(a.username, b.username, isAsc);
        case 'description': return compare(a.description, b.description, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

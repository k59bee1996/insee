import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FuseNavigationService {
  flatNavigation: any[] = [];
  navigationModel: any[] = [];

  onItemCollapsed: Subject<any> = new Subject;
  onItemCollapseToggled: Subject<any> = new Subject;

  constructor() {
  }

  /**
   * Get navigation model
   *
   * @returns {any[]}
   */
  getNavigationModel() {
    return this.navigationModel || [];
  }

  /**
   * Set the navigation model
   *
   * @param model
   */
  setNavigationModel(model) {
    this.navigationModel = model;
  }

  /**
   * Get flattened navigation array
   * @param navigation
   * @returns {any[]}
   */
  getFlatNavigation(navigation?) {
    // If navigation items not provided,
    // that means we are running the function
    // for the first time...
    if (!navigation) {
      // Reset the flat navigation
      this.flatNavigation = [];

      // Get the entire navigation model
      navigation = this.navigationModel || [];
    }
    for (const navItem of navigation) {
      if (navItem.type === 'item') {
        this.flatNavigation.push({
          title: navItem.title,
          type: navItem.type,
          icon: navItem.icon || false,
          url: navItem.url
        });

        continue;
      }

      if (navItem.type === 'collapse' || navItem.type === 'group') {
        if (navItem.children) {
          this.getFlatNavigation(navItem.children);
        }
      }
    }

    return this.flatNavigation;
  }
}

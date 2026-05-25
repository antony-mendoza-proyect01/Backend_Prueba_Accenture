import {inject, Injectable} from '@angular/core';
import {fetchAndActivate, getValue, RemoteConfig} from "@angular/fire/remote-config";

@Injectable({
  providedIn: 'root'
})
export class RemoteconfigService {

  private remoteConfig = inject(RemoteConfig);

  async init() {

    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 10000
    };

    this.remoteConfig.defaultConfig = {
      show_categories: true
    };

    await fetchAndActivate(this.remoteConfig);

    console.log('REMOTE CONFIG VALUE:', getValue(this.remoteConfig, 'show_categories').asString()
    );
  }

  get showCategories(): boolean {
    return getValue(this.remoteConfig, 'show_categories').asBoolean();
  }
}

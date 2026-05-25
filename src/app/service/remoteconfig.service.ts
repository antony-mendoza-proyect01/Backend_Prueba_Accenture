import { inject, Injectable } from '@angular/core';
import { fetchAndActivate, getValue, getRemoteConfig, RemoteConfig } from "@angular/fire/remote-config";
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class RemoteconfigService {

  private app = inject(FirebaseApp);
  private remoteConfig!: RemoteConfig;

  async init() {
    this.remoteConfig = getRemoteConfig(this.app);

    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 10000
    };

    this.remoteConfig.defaultConfig = {
      show_categories: true
    };

    try {
      await fetchAndActivate(this.remoteConfig);
      console.log('REMOTE CONFIG VALUE:', getValue(this.remoteConfig, 'show_categories').asString());
    } catch (e) {
      console.warn('Remote config error:', e);
    }
  }

  get showCategories(): boolean {
    if (!this.remoteConfig) return true;
    return getValue(this.remoteConfig, 'show_categories').asBoolean();
  }
}


import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

export enum CommitStatus {
  rejected = 0,
  resolved
}

export interface CommitPromiseResult {
  map: CommitMap,
  status: CommitStatus
}

export type Commit = (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (value?: {} | PromiseLike<{}>) => void) => void;
interface CommitMap {
  id: string,
  operation: string
  commit: Commit
  errors: string[]
}


export class SpaceEx {

  private _pendingCommits: CommitMap[];
  private maxRetries: number;

  public retryCount: number;

  constructor(params?: any) {
    this._pendingCommits = [];
    this.retryCount = 0;

    this.maxRetries = params && params.maxRetries || 5;
  }

  waitForCommits(maxRetries?: number) {
    this.maxRetries = maxRetries || 0;
    return new Promise((resolve, reject) => {
      this.tryCommits(resolve, reject, this._pendingCommits);
    });
  }
  
  tryCommits(resolve: (value?: {} | PromiseLike<{}>) => void, reject: (value?: {} | PromiseLike<{}>) => void, commits: Array<CommitMap>) {
    let promises = new Array<Promise<any>>();
    let failedCommits = new Array<CommitMap>();

    // Create promises from commits
    commits.forEach((map: CommitMap) => {
      promises.push(new Promise((resolve, reject) => {
        map.commit(resolve, reject);
      }));
    });

    // Execute all commits and retry if failed
    Promise.all(promises)
    .then((commitResults: CommitPromiseResult[]) => {

      // Remove resolved commits from pending list
      commitResults
        .filter(SpaceEx.isResolved)
        .forEach((result: CommitPromiseResult) => this.removeResolved(result.map.id));

      // Remove the already resolved commits from result list
      _.remove(commitResults, SpaceEx.isResolved);

      // If some rejected and retry desired then recurse tryCommits
      if(commitResults.length > 0 && this.retryCount < this.maxRetries) {

        this.retryCount++;
        console.log(`retry attempt: ${this.retryCount}`);
        this.tryCommits(resolve, reject, commitResults.map(result => result.map));

      }
      else {

        // Resolve or reject waitForCommits Promise based on overall results
        if(commitResults.length == 0) {
          resolve('All commits success!');
        }
        else {
          reject(JSON.stringify(commitResults));
        }

      }

    })
    .catch((commits: any) => {
      console.error('This should never be called! Resolve a bad commit promise and set the status to {CommitStatus.rejected}.');
    });
  }

  get pendingCommits() {
    return this._pendingCommits;
  }

  private static isResolved(result: CommitPromiseResult): boolean {
    return result.status === CommitStatus.resolved;
  }

  private removeResolved(id: string) {
    _.remove(this._pendingCommits, (commitMap: CommitMap) => {
      return commitMap.id == id;
    });
  }

  addEntity(param1: any, param2: any, param3: any, attemptsTillSuccess: number, duration: number) {
    let result: CommitPromiseResult;
    let map: CommitMap;
    let errorReason = 1;

    let commit: Commit = (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (value?: {} | PromiseLike<{}>) => void) =>  {

      setTimeout(() => {

        // Simulate success
        let status = CommitStatus.resolved;

        // Simulate failure
        if(this.retryCount < attemptsTillSuccess) {
          map.errors.push(`error reason ${errorReason++}!`);
          status = CommitStatus.rejected;
        }
        
        result = { map: map, status: status, };
        console.log(`Creating an entity with | param1: ${param1} | param2: ${param2} | param3: ${param3} | ${result.status === CommitStatus.resolved ? 'SUCCESS!': 'FAILED!'}`);
        return resolve(result);

      }, duration);

    };

    map = {
      id: uuid(),
      operation: 'addEntity',
      commit: commit,
      errors: []
    };

    this._pendingCommits.push(map);
  }

  addRelationship(param1: any, param2: any) {
    let result: CommitPromiseResult;
    let map: CommitMap;

    let commit: Commit = (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (value?: {} | PromiseLike<{}>) => void)  => {

      // Simulate success
      result = { map: map, status: CommitStatus.resolved };
      console.log(`Creating a relationship with | param1: ${param1} | param2: ${param2} | ${result.status === CommitStatus.resolved ? 'SUCCESS!': 'FAILED!'}`);
      return resolve(result);

    };

    map = {
      id: uuid(),
      operation: 'addRelationship',
      commit: commit,
      errors: []
    };

    this._pendingCommits.push(map);
  }

  addComponent(param1: any) {
    let result: CommitPromiseResult;
    let map: CommitMap;

    let commit: Commit = (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (value?: {} | PromiseLike<{}>) => void) => {

      // Simulate success
      result = { map: map, status: CommitStatus.resolved };
      console.log(`Creating a component with | param1: ${param1} | ${result.status === CommitStatus.resolved ? 'SUCCESS!': 'FAILED!'}`);
      return resolve(result);

    };

    map = {
      id: uuid(),
      operation: 'addComponent',
      commit: commit,
      errors: []
    };

    this._pendingCommits.push(map);
  }
}